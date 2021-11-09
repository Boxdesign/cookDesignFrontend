import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';


@Component({
  selector: 'gastro-offer',
  templateUrl: './gastro.component.html',
  styleUrls: ['./gastro.component.scss']
})
export class GastroComponent implements OnInit {
	public showSideMenu:boolean;
    constructor(public translate: TranslateService) { 
      translate.setDefaultLang('en');
      translate.use('es');
    }

    ngOnInit(){
    }

    showSideBarMenu(show:boolean) {
    	this.showSideMenu = show;
    }

}
