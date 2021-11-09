import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'selenta-import',
  templateUrl: './selenta-import.component.html',
  styleUrls: ['./selenta-import.component.scss']
})
export class SelentaImportComponent implements OnInit {
  public showSideMenu:boolean;
	public regexp = new RegExp('selenta-import-articles');

  constructor(public _router:Router) { }

  ngOnInit() {
  }

  showSideBarMenu(show:boolean) {
	this.showSideMenu = show;
  }
}