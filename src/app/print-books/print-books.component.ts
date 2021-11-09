import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';


@Component({
  selector: 'print-books',
  templateUrl: './print-books.component.html',
  styleUrls: ['./print-books.component.scss']
})
export class PrintBooksComponent implements OnInit {
  public showSideMenu:boolean;

  constructor(public translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('es');
   }

  ngOnInit() {
  }

  showSideBarMenu(show:boolean) {
	this.showSideMenu = show;
  }

}