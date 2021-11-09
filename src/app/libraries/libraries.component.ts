import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: [
  	'./libraries.component.scss']
})
export class LibrariesComponent implements OnInit {
	public showSideMenu:boolean;
    constructor() { 
    }

    ngOnInit(){
    }

    showSideBarMenu(show:boolean) {
    	this.showSideMenu = show;
    }
}
