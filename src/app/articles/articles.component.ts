import { Component, OnInit} from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'articles',
  templateUrl: './articles.template.html',
  styleUrls: [ './articles.component.scss']
})
export class ArticlesComponent implements OnInit {
	public showSideMenu:boolean;
    constructor(translate: TranslateService) { 
      translate.setDefaultLang('en');
      translate.use('es');
    }

    ngOnInit(){
    }

    showSideBarMenu(show:boolean) {
    	this.showSideMenu = show;
    }
}
