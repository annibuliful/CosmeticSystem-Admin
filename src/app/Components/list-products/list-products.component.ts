import { Subscription } from 'apollo-client';
import { ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { Component, OnInit , OnDestroy } from '@angular/core';

const listProductQuery = gql`
  query list($category:String!){
    listProducts(category: $category){
      name
      image
      price
      _id
      description
      number
    }
  }
`
@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit,OnDestroy{
  sub: ApolloQueryObservable<any>;


  products: any;

  constructor(private apollo: Apollo , private route: ActivatedRoute) {
    route.params.subscribe((params)=>{
      this.listProducts(params.category);
    })
  }

  listProducts(category: string){
  this.sub =  this.apollo.watchQuery({
      query:listProductQuery ,variables:{
        category: category
      },fetchPolicy: "network-only"})
  }

  ngOnDestroy(){
  }

  ngOnInit() {
  }

}
