import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from "../../../global-utils/services/compass.service";
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { ArticleService } from "../../../providers/articles/article.service";
import { SelentaImportService } from '../selenta-import.service';
import { LocationService } from "../../../global-utils/services/location.service";
import { Observable, Subject } from "rxjs/Rx";
import * as FileSaver from "file-saver";

@Component({
  selector: 'selenta-import-articles',
  templateUrl: './selenta-import-articles.component.html',
  styleUrls: ['./selenta-import-articles.component.scss']
})
export class SelentaImportArticlesComponent implements OnInit {
  
  public searchBoxLabel: string;
  public selentaArticles:any[] =[]; 
  public selentaArticleSelected;
  public selentaArticlesCurrentPage: number = 1;
  public selentaArticlesPerPage: number = 5;
  public selentaArticlesFilterText: string ='';
  public selentaTotalArticles:number = 0;
  public selentaArticlesNumPages:number;
  public selentaArticlesSortField:string='';
  public selentaArticlesSortOrder:number=1;
  public loading:boolean = true;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }

  constructor(
    public notification: NotificationsService,
    public translateService: TranslateService,
    public articleService: ArticleService,
    public router : Router,
    public compassService: CompassService,
    public locationService: LocationService,
    public selentaImportService: SelentaImportService
    ){}

  ngOnInit() {
    this.selentaArticlesFilterText = this.selentaImportService.getSapArticlesSearchFilter();
    this.getSelentaSapArticles();
    this.translation();
  }

  private translation(){
    this.translateService.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });
  }

  public viewSelentaArticle(sapArticle){
  	let MATNR = sapArticle.article.MATNR;
  	let LIFNR = sapArticle.article.PROVIDER.LIFNR;
    this.router.navigate(['/import/selenta-import/selenta-import-articles/', MATNR, {LIFNR: LIFNR}]);
  }

  public selectSelentaArticle(article) {
  	this.selentaArticleSelected = JSON.parse(JSON.stringify(article))
  }

  public getSelentaSapArticles() {
    this.selentaImportService.getSelentaSapArticles(
      this.selentaArticlesPerPage,
      this.selentaArticlesCurrentPage-1,
      this.selentaArticlesFilterText,
      this.selentaArticlesSortField,
      this.selentaArticlesSortOrder
    ).subscribe(
      (res:any) => {
        this.selentaArticles = res.articles;
        this.selentaTotalArticles = res.totalElements;
        this.loading = false;
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      });
  }

  public navigateTo(_id:string) {
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-articles','','','');
    this.router.navigate(['./providers/article/',_id]);
  }

  /*---------------------------------Selenta articles table functions--------------------------------------*/

  public filterSelentaArticles(text:string) {
    this.selentaArticlesFilterText=text;
    this.selentaArticlesCurrentPage=1;
    this.selentaImportService.saveSapArticlesSearchFilter(text)
    this.getSelentaSapArticles();
  }

  public updateSelentaArticlesPerPage(item: number) {
    this.selentaArticlesPerPage = item;
    this.selentaArticlesCurrentPage = 1;
    this.getSelentaSapArticles();
  }

  public selentaPageHasChanged(data) {
    this.selentaArticlesPerPage = data.itemsPerPage;
    this.selentaArticlesCurrentPage = data.page;
    this.getSelentaSapArticles();
  }


}
