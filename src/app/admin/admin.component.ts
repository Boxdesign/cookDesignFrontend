import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public showSideMenu:boolean;

  constructor() { }

  ngOnInit() {
  }

  showSideBarMenu(show:boolean) {
	this.showSideMenu = show;
  }

}
