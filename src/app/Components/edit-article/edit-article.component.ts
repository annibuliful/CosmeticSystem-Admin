import gql from 'graphql-tag';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { UploadFile, UploadInput, UploadOutput } from 'ngx-uploader';
import { Component, OnInit, EventEmitter } from '@angular/core';

const removeContentMutation = gql`
  mutation remove($_id:String!){
    removeContent(_id:$_id){
      _id
    }
  }
`
const editArticleMutation = gql`
  mutation edit($_id:String! , $detail:String! ,$category:String! ,$topic:String!){
    editContent( _id: $_id , detail: $detail , category: $category, topic: $topic ){
      _id
    }
  }
`

const articleQuery = gql`
  query article($_id:String!){
    resContent(_id:$_id){
      detail
      _id
      coverImage
      category
      topic
    }
    listCategorys{
      name
    }
  }
`

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {

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
  articleID: String;
  articleTopic: String = '';
  articleDetail: String = '';
  articleCategory: String = '';
  oldCoverImage: String;
  constructor(private apollo: Apollo , private route : Router , private routeParam: ActivatedRoute) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    routeParam.params.subscribe((params)=>{
      this.resArticle(params.ID);
    })
  }

  removeContent(){
    this.apollo.mutate({mutation: removeContentMutation , variables:{
      _id: this.articleID
    }}).subscribe(({data})=>{
      let res: any = data;
      let {removeContent} = res;
      if(removeContent._id == "removed"){
        this.route.navigate(['/contents']);
      }
    })
  }

  resArticle(_id: string){
    this.apollo.watchQuery({query: articleQuery , variables:{
      _id: _id
    }}).subscribe(({data , loading})=>{
        let res: any = data;
        let {resContent , listCategorys} = res;
        this.categorys = listCategorys
        this.articleDetail = resContent.detail;
        this.articleCategory = resContent.category;
        this.articleTopic = resContent.topic;
        this.oldCoverImage = resContent.coverImage;
        this.articleID = resContent._id;
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
    if(this.previewImage != null){
      this.apollo.mutate({mutation: editArticleMutation , variables:{
        _id: this.articleID,
        detail: this.articleDetail,
        category: this.articleCategory,
        topic: this.articleTopic
      }}).subscribe(({data})=>{
        let res: any = data;
        let {addContent} = res;
          const event: UploadInput = {
            type: 'uploadAll',
            url: 'http://localhost:3001/content/coverImage',
            method: 'POST',
            data: { _id: this.articleID.toString()},
          };
          this.uploadInput.emit(event);
          this.route.navigate(['/contents']);
      })
    }else{
      this.apollo.mutate({mutation: editArticleMutation , variables:{
        _id: this.articleID,
        detail: this.articleDetail,
        category: this.articleCategory,
        topic: this.articleTopic
      }}).subscribe(({data})=>{
          this.route.navigate(['/contents']);
      })
    }
  }

  removeArticle(){

  }

  ngOnInit() {
  }

}
