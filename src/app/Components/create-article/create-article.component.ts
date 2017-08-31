import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploadFile, UploadInput, UploadOutput } from "ngx-uploader";


const addArticleMutation = gql`
  mutation create($content:String! , $category:String! , $topic:String!){
    addContent(detail:$content , category:$category , topic:$topic){
      _id
    }
  }
`

const listCategorysQuery = gql`
  query list{
    listCategorys{
      name
    }
  }
`
@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {
  froalaConfig: Object = {
    charCounterCount: false,
    imageUploadURL: 'http://localhost:3001/contentImage',
    height: 450,
    toolbarButtons: ['bold', 'italic', 'underline',
      'fontSize', 'color', '|', 'paragraphFormat', 'align'
      , 'outdent', 'indent', 'quote', 'insertLink', 'insertImage',],
    toolbarButtonsSM: ['bold', 'italic', 'underline',
      'fontSize', 'color', '|', 'paragraphFormat', 'align'
      , 'outdent', 'indent', 'quote', 'insertLink', 'insertImage',],
      toolbarButtonsXS: ['bold', 'italic', 'underline',
      'fontSize', 'color', '|', 'paragraphFormat', 'align'
      , 'outdent', 'indent', 'quote', 'insertLink', 'insertImage',],
  }

  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  previewImage: any;
  categorys: any;
  articleTopic: String = '';
  articleDetail: String = '';
  articleCategory: String = '';
  constructor(private apollo: Apollo , private route : Router) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.listCategory();
  }

  listCategory(){
    this.apollo.watchQuery({query: listCategorysQuery})
      .subscribe(({data , loading})=>{
        let res: any = data;
        let {listCategorys} = res;
        this.categorys = listCategorys;
      })
  }
  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event) => {
        let data: any = event.target;
        this.previewImage = data.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
      this.files[0] =output.file;
      console.log(this.files)
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    }
  }

  startUpload(){
    this.apollo.mutate({mutation: addArticleMutation , variables:{
      content: this.articleDetail,
      category: this.articleCategory,
      topic: this.articleTopic
    }}).subscribe(({data})=>{
      let res: any = data;
      let {addContent} = res;
      console.log(addContent)
      if(addContent._id != null){
        const event: UploadInput = {
          type: 'uploadAll',
          url: 'http://localhost:3001/content/coverImage',
          method: 'POST',
          data: { _id: addContent._id },
        };
        this.uploadInput.emit(event);
      }
    })
  }


  ngOnInit() {
  }

}
