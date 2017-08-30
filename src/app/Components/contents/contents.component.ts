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
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.css']
})
export class ContentsComponent implements OnInit {

  contents: any;
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
      this.contents = listCategorys;
    })
  }
  ngOnInit() {
  }

}
