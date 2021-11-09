import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {
	public showSideMenu:boolean;
    constructor() { 
    }

    ngOnInit(){
    }

    showSideBarMenu(show:boolean) {
    	this.showSideMenu = show;
    }

}
