import { Router } from '@angular/router';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';

const loginMutation = gql`
  mutation auth($userName:String! , $password:String!){
    login(userName:$userName,
          password:$password){
      _id
    }
  }
`
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  userName: String = '';
  password: String = '';
  res: String = '';
  constructor(private apollo : Apollo , private router: Router) {
    if(localStorage.getItem('AdminID') != null || localStorage.getItem('AdminID') != undefined){
      this.router.navigate(['/main']);
    }
  }

  login(){
    this.apollo.mutate({
      mutation: loginMutation ,
      variables:{
        userName: this.userName ,
        password: this.password ,
    }}).subscribe(({data , loading})=>{
      let res: any = data;
      let {login} = res;
      if(login._id == 'noUser'){
        this.res = 'ไม่มีชื่อผู้ใช้นี้'
      }else if(login._id == 'passwordNotCorrect'){
        this.res = 'รหัสผ่านผิด'
      }else{
        localStorage.setItem('AdminID' , login._id);
        this.router.navigate(['/main']);
      }
    })

  }
  ngOnInit() {
  }

}
