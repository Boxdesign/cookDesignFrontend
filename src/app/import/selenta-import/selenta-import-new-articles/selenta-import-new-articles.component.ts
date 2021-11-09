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
  selector: 'selenta-import-new-articles',
  templateUrl: './selenta-import-new-articles.component.html',
  styleUrls: ['./selenta-import-new-articles.component.scss']
})
export class SelentaImportNewArticlesComponent implements OnInit {
  
  @ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public refresh = new Subject();
  public clone = require('clone');
  private filterLocations = [];
  public totalArticles: number = 0;
  public articlesCurrentPage: number = 1; //articlesCurrentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public articlesPerPage: number = 5; //Default items per page
  public articlesFilterText: string = '';
  public articlesSortField:string='';
  public articlesSortOrder:number=1;
  public searchBoxLabel: string;
  public articles;
  public article;
  public articleDeletedTitle;
  public articleDeletedContent;
  public articlesLinkedTitle;
  public articlesLinkedContent;
  public articlesNumPages:number;
  public costFilterSet:boolean=false; 
  public savedLocations = [];
  public selentaNewArticles:any[] =[]; 
  public selentaArticlesCurrentPage: number = 1;
  public selentaArticlesPerPage: number = 5;
  public selentaArticlesFilterText: string ='';
  public selentaArticleSelected;
  public selentaArticlesSortField:string='';
  public selentaArticlesSortOrder:number=1;
  public articleSelected;
  public selentaTotalArticles:number = 0;
  public selentaArticlesNumPages:number;
  public loading:boolean = true;
  private loadingCounter:number = 0;
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
    this.articlesCurrentPage = this.articleService.getCurrentPage();
    this.articlesFilterText = this.articleService.getSearchFilter();
    this.translation();
    this.getSelentaLocations();
    this.getSelentaSapNewArticles();
  }

  /*Get Hotel Sofia locations*/
  private getSelentaLocations(){
    this.locationService.getAllLocations().subscribe(
      (data: any)=> {
        this.filterLocations = [];
        this.savedLocations = [];
        for (var location of data[0].companies) {
          if(location.referenceNumber === 'D600') {
            /*Add locations*/
            for (var bussines of location.businessUnits) {
              this.filterLocations.push(bussines._id);
              this.savedLocations.push(bussines._id);
            }
              this.filterLocations.push(location._id);
              this.savedLocations.push(location._id);
          }
        }
        this.getArticles();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getArticles(){
    this.articleService.getArticles(
      null, 
      null, 
      this.articlesPerPage, 
      this.articlesCurrentPage-1,
      this.articlesFilterText, 
      this.filterLocations,
      this.articlesSortField,
      this.articlesSortOrder,
      true
    ).subscribe(
      (data:any) => {
        this.articles = data.articles;
        this.totalArticles = data.totalElements;
        this.loadingFinish();
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      }
    )
  }

  public getSelentaSapNewArticles() {
    this.selentaImportService.getSelentaSapNewArticles(
      this.selentaArticlesPerPage,
      this.selentaArticlesCurrentPage-1,
      this.selentaArticlesFilterText,
      this.selentaArticlesSortField,
      this.selentaArticlesSortOrder
    ).subscribe(
      (res:any) => {
        this.selentaArticleSelected = null;
        this.selentaNewArticles = res.articles;
        this.selentaTotalArticles = res.totalElements;
        this.loadingFinish();
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      });
  }

  private loadingFinish() {
    this.loadingCounter++
    if(this.loadingCounter === 2) this.loading = false;
  }

  private translation(){
    this.translateService.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translateService.get('provider.article.notifications.articleDeletedTitle').subscribe((res: string) => {
      this.articleDeletedTitle = res;
    });

    this.translateService.get('provider.article.notifications.articleDeletedContent').subscribe((res: string) => {
      this.articleDeletedContent = res;
    });

    this.translateService.get('selenta-import.articlesLinkedTitle').subscribe((res: string) => {
      this.articlesLinkedTitle = res;
    });

    this.translateService.get('selenta-import.articlesLinkedContent').subscribe((res: string) => {
      this.articlesLinkedContent = res;
    });
  }

  public linkArticles() {
    var externalReference = this.selentaArticleSelected.article.MATNR;
    if(this.selentaArticleSelected.article.MATNR.length>9) externalReference = externalReference.substring(externalReference.length-9,externalReference.length);
    this.articleSelected.externalReference = externalReference;
    //console.log(this.articleSelected, this.selentaArticleSelected, this.selentaArticleSelected.article.MATNR.substring(9,18));
    this.articleService.editArticle(this.articleSelected).subscribe(
    (res) => {
      this.selentaImportService.deleteSelentaSapArticle(this.selentaArticleSelected._id, this.selentaArticleSelected.article.PROVIDER.LIFNR).subscribe(
      (res) => {
        this.notification.success(this.articlesLinkedTitle, this.articlesLinkedContent);
        //console.log(res);
        this.getArticles();
        this.getSelentaSapNewArticles();
      },(err) => {
        this.notification.error('Error', err || 'Error');
      });
    },(err) => {
      this.notification.error('Error', err || 'Error');
    });
  }

  /*---------------------------------New Selenta articles table functions--------------------------------------*/

  public selectSelentaArticle(article) {
    this.selentaArticleSelected = article;
  }
  public filterSelentaArticles(text:string) {
    this.selentaArticlesFilterText=text;
    this.selentaArticlesCurrentPage=1;
    this.getSelentaSapNewArticles();
  }

  public updateSelentaArticlesPerPage(item: number) {
    this.selentaArticlesPerPage = item;
    this.selentaArticlesCurrentPage = 1;
    this.getSelentaSapNewArticles();
  }

  public selentaPageHasChanged(data) {
    this.selentaArticlesPerPage = data.itemsPerPage;
    this.selentaArticlesCurrentPage = data.page;
    this.getSelentaSapNewArticles();
  }


  /*---------------------------------Providers articles table functions----------------------------------------*/

  public searchArticles(value: string){
    this.articlesFilterText=value;
    this.articleService.saveSearchFilter(this.articlesFilterText);
    this.articlesCurrentPage=1;
    this.getArticles();
  }

  public updateItemsPerPage(item: number) {
    this.articlesPerPage = item;
    this.articleService.saveItemsPerPage(item);
    this.articlesCurrentPage = 1;
    this.getArticles();
  }

  public filterListByLocation(){
    this.costFilterSet=true;
    this.savedLocations = [];
    this.savedLocations = this.savedLocations.concat(this.filterLocations)
    this.articleService.saveLocationFilter(this.savedLocations);
    this.getArticles();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.costFilterSet=false;
    this.savedLocations=[];
    this.refresh.next([]);
    this.filterLocations=[];
    this.getSelentaLocations();
  }

  public cancelSelection() {
    this.refresh.next(this.clone(this.savedLocations));
    this.filterLocations = [];
    this.filterLocations = this.filterLocations.concat(this.savedLocations);
  }

  public viewArticle(_id){
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-new-articles','','','');
    this.router.navigate(['./providers/article/',_id]);
  }

  public editArticle(_id){
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-new-articles','','','');
    this.router.navigate(['./providers/article/edit', _id]);   
  }

  public selectArticleToEdit(article){
    this.article=article;
  }

  public deleteArticle() {
    this.articleService.deleteArticle(this.article._id).subscribe(
      (data) => {
        this.notification.success(this.articleDeletedTitle, this.articleDeletedContent);
        this.getArticles();        
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })
  }

  public addArticle(_id?){
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-new-articles','','','');
    this.router.navigate(['./providers/article/new']);
  }

  public pageHasChanged(data) {
    this.articlesPerPage = data.itemsPerPage;
    this.articlesCurrentPage = data.page;
    this.articleService.saveCurrentPage(this.articlesCurrentPage);
    this.getArticles();
  }

}
