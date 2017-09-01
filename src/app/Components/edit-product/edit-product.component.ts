import {
  ActivatedRoute,
  Router
} from '@angular/router';
import gql from 'graphql-tag';
import {
  Apollo
} from 'apollo-angular';
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

const removeProductMutation = gql `
  mutation remove($_id:String!){
    removeProduct(_id:$_id){
      _id
    }
  }
`;
const listCategorysQuery = gql `
  query list{
    listCategorys{
      name
    }
  }
`
const resProductQuery = gql `
  query res($_id:String!){
    resProducts(_id:$_id){
      _id
      name
      coverImage
      price
      number
      category
      description
    }
  }
`

const edtiProductMutation = gql `
  mutation edit(	$_id:String! , $name:String! ,
                  $price:Int! , $category:String! ,
                  $number:Int! , $description:String ){
    editProduct(  _id:$_id , name:$name , price:$price ,
                  category:$category , number:$number ,
                  description:$description){
    _id
    }
  }
`
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  formData: FormData;
  files: UploadFile[];
  oldCoverImage: String;
  uploadInput: EventEmitter < UploadInput > ;
  previewImage: any;
  categorys: any;
  productID: string;
  name: string;
  price: number;
  number: number;
  category: string;
  description: string;
  constructor(private apollo: Apollo, private routeParam: ActivatedRoute, private route: Router) {
    this.files = [];
    this.uploadInput = new EventEmitter < UploadInput > ();
    routeParam.params.subscribe((params) => {
      this.listCategorys();
      this.resProduct(params.ID);
    })

  }

  listCategorys() {
    this.apollo.watchQuery({
        query: listCategorysQuery
      })
      .subscribe(({
        data
      }) => {
        let res: any = data;
        let {
          listCategorys
        } = res;
        this.categorys = listCategorys;
      })
  }

  removeProduct() {
    this.apollo.mutate({
      mutation: removeProductMutation,
      variables: {
        _id: this.productID
      }
    }).subscribe(()=>{
      this.route.navigate(['/products']);
    })
  }
  resProduct(_id: string) {
    this.apollo.watchQuery({
      query: resProductQuery,
      variables: {
        _id: _id
      }
    }).subscribe(({
      data
    }) => {
      let res: any = data;
      let {
        resProducts
      } = res;
      this.name = resProducts.name;
      this.category = resProducts.category;
      this.price = resProducts.price;
      this.number = resProducts.number;
      this.description = resProducts.description;
      this.oldCoverImage = resProducts.coverImage
      this.productID = resProducts._id;
    })
  }
  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {} else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.files[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    }
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

  submitProduct() {
    if (this.previewImage != null) {
      this.apollo.mutate({
        mutation: edtiProductMutation,
        variables: {
          _id: this.productID,
          name: this.name,
          price: this.price,
          category: this.category,
          number: this.number,
          description: this.description
        }
      }).subscribe(({
        data
      }) => {
        let res: any = data;
        let {
          editProduct
        } = res;
        if (editProduct._id != 'failed') {
          const event: UploadInput = {
            type: 'uploadAll',
            url: 'http://localhost:3001/product/coverImage',
            method: 'POST',
            data: {
              _id: this.productID.toString()
            },
          };
          this.uploadInput.emit(event);
          this.route.navigate(['/products']);
        }
      })
    } else {
      this.apollo.mutate({
        mutation: edtiProductMutation,
        variables: {
          _id: this.productID,
          name: this.name,
          price: this.price,
          category: this.category,
          number: this.number,
          description: this.description
        }
      }).subscribe((data) => {
        this.route.navigate(['/products']);
      });
    }
  }

  ngOnInit() {}

}
