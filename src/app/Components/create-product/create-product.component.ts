import { UploadInput, UploadFile, UploadOutput } from 'ngx-uploader';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Component, OnInit, EventEmitter } from '@angular/core';

const listCategorysQuery = gql`
query list{
  listCategorys{
    name
  }
}
`

const addProductMutation = gql`
  mutation add(	$name:String! , $price:Int! , $category:String! , $number:Int! , $description:String){
    addProduct(	name:$name , price:$price , category: $category , number:$number , description: $description){
    _id
    }
  }
`

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  previewImage: any = [];
  categorys: any;
  name: string;
  price: number;
  number: number;
  category: string;
  description: string;
  constructor(private apollo:Apollo) {
    this.uploadInput = new EventEmitter<UploadInput>();
    this.listcategorys();
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

  submitProduct(){
    this.apollo.mutate({mutation: addProductMutation , variables:{
      name: this.name ,
      price: this.price ,
      category: this.category ,
      number: this.number ,
      description: this.description
    }}).subscribe(({data})=>{
      let res:any = data;
      let {addProduct} = res;
      console.log(addProduct);
      if(addProduct._id != 'failed'){
        const event: UploadInput = {
          type: 'uploadAll',
          url: 'http://localhost:3001/product/coverImage',
          method: 'POST',
          data: { _id: addProduct._id },
        };
        this.uploadInput.emit(event);
        this.name = '';
        this.price = 0;
        this.category = '';
        this.number = 0;
        this.description = '';
      }
    })
  }
  listcategorys(){
    this.apollo.watchQuery({query:listCategorysQuery})
    .subscribe(({data})=>{
      let res: any = data;
      let {listCategorys} = res;
      this.categorys = listCategorys;
    });
  }

  ngOnInit() {
  }

}
