import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loged: Boolean = false;
  constructor(private router: Router) {
    if(localStorage.getItem('AdminID') != null || localStorage.getItem('AdminID') != undefined){
      this.loged = true;
    }
  }

  logout(){
    localStorage.removeItem('AdminID');
    this.router.navigate(['/']);
  }
  ngOnInit() {
  }

}
