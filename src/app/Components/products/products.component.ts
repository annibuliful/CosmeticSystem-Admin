import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';


const listCategoryQuery = gql`
  query list{
    listCategorys{
      name
      image
    }
  }
`;
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  categorys: any;
  loading: boolean = true;

  constructor(private apollo:Apollo) {
    this.listCategory();
   }

  listCategory(){
    this.apollo.watchQuery(
      {query: listCategoryQuery}
    ).subscribe(({data , loading})=>{
      let res: any = data;
      let {listCategorys} = res;
      this.categorys = listCategorys;
    })
  }
  ngOnInit() {
  }

}
