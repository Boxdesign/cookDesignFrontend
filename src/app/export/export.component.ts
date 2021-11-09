import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  public showSideMenu:boolean;

  constructor() { }

  ngOnInit() {
  }

  showSideBarMenu(show:boolean) {
	this.showSideMenu = show;
  }

}