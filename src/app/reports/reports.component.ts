import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
	public showSideMenu:boolean;
    constructor() { 
    }

    ngOnInit(){
    }

    showSideBarMenu(show:boolean) {
    	this.showSideMenu = show;
    }

}
