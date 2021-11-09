import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from "../../../global-utils/services/compass.service";
import { SelentaImportService } from '../selenta-import.service';
import { Observable, Subject } from "rxjs/Rx";

@Component({
  selector: 'selenta-import-activity-log',
  templateUrl: './selenta-import-activity-log.component.html',
  styleUrls: ['./selenta-import-activity-log.component.scss']
})
export class SelentaImportActivityLogComponent implements OnInit {
  
  public loading:boolean = true;
  public updatedArticles:any[]=[];
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }
  public searchBoxLabel;
  public selentaArticlesFilterText;

  constructor(
    public notification: NotificationsService,
    public translateService: TranslateService,
    public router : Router,
    public compassService: CompassService,
    public selentaImportService: SelentaImportService
    ){}

  ngOnInit() {
    this.selentaArticlesFilterText = this.selentaImportService.getUpdateLogSearchFilter();
  	this.translation();
    this.getSelentaUpdatedArticles();
  }

  private translation(){
    this.translateService.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });
  }  

  public goToArticle(updatedArticle){

  	let MATNR = updatedArticle.article.MATNR;
  	let LIFNR = updatedArticle.provider? updatedArticle.provider.LIFNR : '';

    this.router.navigate(['/import/selenta-import/selenta-import-articles/', MATNR , {LIFNR: LIFNR}]);
  }

  private getSelentaUpdatedArticles () {
    this.selentaImportService.getSelentaUpdatedArticles(this.selentaArticlesFilterText).subscribe(
    (res)=>{
      this.updatedArticles = [];
      this.updatedArticles = res;
      this.loading = false;
    },(err)=>{
        this.notification.error('Error', err || 'Server error');
    });
  }

  public navigateTo(_id:string) {
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-activity-log','','','');
    this.router.navigate(['./providers/article/',_id]);
  }

  public filterSelentaArticles(text:string) {
    this.selentaArticlesFilterText=text;
    this.selentaImportService.saveUpdateLogSearchFilter(text)
    this.getSelentaUpdatedArticles();
  }  

}
