import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Component, OnInit } from '@angular/core';

const listContentsQuery = gql`
  query list($category:String!){
    listContents(category: $category){
      detail
      _id
      coverImage
      category
      topic
    }
  }
`
@Component({
  selector: 'app-list-articles',
  templateUrl: './list-articles.component.html',
  styleUrls: ['./list-articles.component.css']
})
export class ListArticlesComponent implements OnInit {

  articles: any;
  constructor(private apollo: Apollo , private route: ActivatedRoute) {
    route.params.subscribe((params)=>{
      this.listArticles(params.category);
    })
  }

  listArticles(category: string){
    this.apollo.watchQuery({query: listContentsQuery ,
      variables:{
        category: category
      },
    fetchPolicy:"network-only"}).subscribe(({data , loading})=>{
      let res: any = data;
      let {listContents} = res;
      this.articles = listContents;
    })
  }

  ngOnInit() {
  }

}
