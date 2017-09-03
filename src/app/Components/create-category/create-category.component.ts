import {
  Router
} from '@angular/router';
import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
import {
  UploadFile,
  UploadInput,
  UploadOutput
} from 'ngx-uploader';
import {
  Component,
  OnInit,
  EventEmitter
} from '@angular/core';

const addCategorysMutation = gql `
  mutation add($name:String!){
    addCategory(name:$name){
      _id
    }
  }
`

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter < UploadInput > ;
  previewImage: any;
  category: string = '';
  constructor(private apollo: Apollo, private route: Router) {
    this.files = [];
    this.uploadInput = new EventEmitter < UploadInput > ();
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
    if (output.type === 'allAddedToQueue') {} else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.files[0] = output.file;
      console.log(this.files)
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    }
  }

  addCategory() {
    this.apollo.mutate({
      mutation: addCategorysMutation,
      variables: {
        name: this.category
      }
    }).subscribe(({
      data
    }) => {
      let res: any = data;
      let {addCategory} = res;
      if(addCategory._id != null){
        const event: UploadInput = {
          type: 'uploadAll',
          url: 'http://localhost:3001/category/coverImage',
          method: 'POST',
          data: { _id: addCategory._id },
        };
        this.uploadInput.emit(event);
        //this.route.navigate(['/contents']);
      }
    })
  }

  ngOnInit() {}

}
