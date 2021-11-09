import { Component, OnInit } from '@angular/core';
import { SelentaImportService } from '../selenta-import.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications'
import { Location, LocationStrategy } from '@angular/common'

@Component({
  selector: 'selenta-import-article-detail',
  templateUrl: './selenta-import-article-detail.component.html',
  styleUrls: ['./selenta-import-article-detail.component.css']
})
export class SelentaImportArticleDetailComponent implements OnInit {

	public selentaArticle;
	public loading;
	public MATNR; //MATNR
	public LIFNR;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }

  constructor(
			public selentaImportService: SelentaImportService,
    	public route: ActivatedRoute, 
    	public router: Router,
    	public notification: NotificationsService,
    	public location: Location
  	) { }

  ngOnInit() {
    this.route.params.subscribe(params => {this.MATNR=params['id']; this.LIFNR = params['LIFNR']});
    this.getSelentaSapArticle()
  }

  public goBack(){
  	this.location.back()
  }

  public getSelentaSapArticle() {
    this.selentaImportService.getSelentaSapArticle(this.MATNR, this.LIFNR).subscribe(
      (res:any) => {
        this.selentaArticle = res;
        this.loading = false;
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
    });
  }

}
