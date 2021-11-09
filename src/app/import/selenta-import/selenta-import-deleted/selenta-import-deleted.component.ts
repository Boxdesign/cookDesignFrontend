import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from "../../../global-utils/services/compass.service";
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { ProviderService } from "../../../providers/providers/provider.service";
import { ArticleService } from "../../../providers/articles/article.service";
import { SelentaImportService } from '../selenta-import.service';
import { LocationService } from "../../../global-utils/services/location.service";
import { Observable, Subject } from "rxjs/Rx";
import * as FileSaver from "file-saver";

@Component({
  selector: 'selenta-import-deleted',
  templateUrl: './selenta-import-deleted.component.html',
  styleUrls: ['./selenta-import-deleted.component.scss']
})
export class SelentaImportDeletedComponent implements OnInit {
  
  @ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public refresh = new Subject();
  public clone = require('clone');
  private filterLocations = [];
  public totalProviders: number = 0;
  public providersCurrentPage: number = 1;
  public providersPerPage: number = 5;
  public providersFilterText: string = '';
  public providersSortField:string='';
  public providersSortOrder:number=1;
  public searchBoxLabel: string;
  public providers;
  public provider;
  public providerDeletedTitle;
  public providerDeletedContent;
  public providersLinkedTitle;
  public providersLinkedContent;
  public providersNumPages:number;
  public costFilterSet:boolean=false; 
  public savedLocations = [];
  public providerSelected;
  public totalArticles: number = 0;
  public articlesCurrentPage: number = 1;
  public articlesPerPage: number = 5;
  public articlesFilterText: string = '';
  public articles;
  public article;
  public articleDeletedTitle;
  public articleDeletedContent;
  public articlesLinkedTitle;
  public articlesLinkedContent;
  public articlesNumPages:number;
  public articleSelected;
  public articlesSortField:string='';
  public articlesSortOrder:number=1;
  public loading:boolean = true;
  private loadingCounter:number;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }

  constructor(
    public notification: NotificationsService,
    public translateService: TranslateService,
    public providerService: ProviderService,
    public articleService: ArticleService,
    public router : Router,
    public compassService: CompassService,
    public locationService: LocationService,
    public selentaImportService: SelentaImportService
    ){}

  ngOnInit() {
    this.providersCurrentPage = this.providerService.getCurrentPage();
    this.providersFilterText = this.providerService.getSearchFilter();
    this.articlesCurrentPage = this.articleService.getCurrentPage();
    this.articlesFilterText = this.articleService.getSearchFilter();
    this.loadingCounter = 0;
    this.translation();
    this.getSelentaLocations();
  }

  /*Get Hotel Sofia locations*/
  private getSelentaLocations(){
    this.locationService.getAllLocations().subscribe(
      (data: any)=> {
        this.filterLocations = [];
        this.savedLocations = [];
        for (var location of data[0].companies) {
          if(location.name === 'Hotel Sofia, S.L') {
            /*Add locations*/
            for (var bussines of location.businessUnits) {
              this.filterLocations.push(bussines._id);
              this.savedLocations.push(bussines._id);
            }
              this.filterLocations.push(location._id);
              this.savedLocations.push(location._id);
          }
        }
        this.getSelentaSapDeletedArticles();
        this.getSelentaSapDeletedProviders();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getSelentaSapDeletedArticles() {
    this.selentaImportService.getSelentaDeletedArticles(
      this.articlesPerPage,
      this.articlesCurrentPage-1,
      this.articlesFilterText,
      this.filterLocations,
      this.articlesSortField,
      this.articlesSortOrder
    ).subscribe(
    (res:any) => {
      //console.log(res);
      this.articleSelected = null;
      this.totalArticles = res.totalElements;
      this.articles = [];
      for(var article of res.deletedArticles) {
        this.articles.push(article.article._id);
      }
      this.loadingFinish();
    },
    (err) => {
      this.notification.error('Error', err || 'Error');
    });
  }

  public getSelentaSapDeletedProviders() {
    this.selentaImportService.getSelentaDeletedProviders(
      this.providersPerPage,
      this.providersCurrentPage-1,
      this.providersFilterText,
      this.filterLocations,
      this.providersSortField,
      this.providersSortOrder
    ).subscribe(
      (res:any) => {
        this.providerSelected = null;
        this.totalProviders = res.totalElements;
        this.providers = [];
        for(var provider of res.deletedProviders) {
          this.providers.push(provider.provider._id);
        }
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

    this.translateService.get('provider.provider.notifications.providerDeletedTitle').subscribe((res: string) => {
      this.providerDeletedTitle = res;
    });

    this.translateService.get('provider.provider.notifications.providerDeletedContent').subscribe((res: string) => {
      this.providerDeletedContent = res;
    });

    this.translateService.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translateService.get('provider.article.notifications.articleDeletedTitle').subscribe((res: string) => {
      this.articleDeletedTitle = res;
    });

    this.translateService.get('provider.article.notifications.articleDeletedContent').subscribe((res: string) => {
      this.articleDeletedContent = res;
    });
  }

  /*---------------------------------Providers table functions----------------------------------------*/

  public searchProviders(value: string){
    this.providersFilterText=value;
    this.providerService.saveSearchFilter(this.providersFilterText);
    this.providersCurrentPage=1;
    this.getSelentaSapDeletedProviders();
  }

  public updateProvidersPerPage(item: number) {
    this.providersPerPage = item;
    this.providerService.saveItemsPerPage(item);
    this.providersCurrentPage = 1;
    this.getSelentaSapDeletedProviders();
  }

  public viewProvider(_id){
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-deleted','','','');
    this.router.navigate(['./providers/provider/',_id]);
  }

  public editProvider(_id){
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-deleted','','','');
    this.router.navigate(['./providers/provider/edit', _id]);   
  }

  public selectProviderToEdit(provider){
    this.provider=provider;
  }

  public deleteProvider() {
    this.providerService.deleteProvider(this.provider._id).subscribe(
      (data) => {
        this.notification.success(this.providerDeletedTitle, this.providerDeletedContent);
        this.getSelentaSapDeletedProviders();
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })
  }

  public providerPageHasChanged(data) {
    this.providersPerPage = data.itemsPerPage;
    this.providersCurrentPage = data.page;
    this.providerService.saveCurrentPage(this.providersCurrentPage);
    this.getSelentaSapDeletedProviders();
  }

  /*---------------------------------Articles table functions----------------------------------------*/

  public searchArticles(value: string){
    this.articlesFilterText=value;
    this.articleService.saveSearchFilter(this.articlesFilterText);
    this.articlesCurrentPage=1;
    this.getSelentaSapDeletedArticles();
  }

  public updateArticlesPerPage(item: number) {
    this.articlesPerPage = item;
    this.articleService.saveItemsPerPage(item);
    this.articlesCurrentPage = 1;
    this.getSelentaSapDeletedArticles();
  }

  public viewArticle(_id){
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-deleted','','','');
    this.router.navigate(['./providers/article/',_id]);
  }

  public editArticle(_id){
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-deleted','','','');
    this.router.navigate(['./providers/article/edit', _id]);   
  }

  public selectArticleToEdit(article){
    this.article=article;
  }

  public deleteArticle() {
    this.articleService.deleteArticle(this.article._id).subscribe(
      (data) => {
        this.notification.success(this.articleDeletedTitle, this.articleDeletedContent);
        this.getSelentaSapDeletedArticles();        
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })
  }

  public articlePageHasChanged(data) {
    this.articlesPerPage = data.itemsPerPage;
    this.articlesCurrentPage = data.page;
    this.articleService.saveCurrentPage(this.articlesCurrentPage);
    this.getSelentaSapDeletedArticles();
  }

  /*---------------------------------Locations filter functions----------------------------------------*/  

  public filterListByLocation(){
    this.costFilterSet=true;
    this.savedLocations = [];
    this.savedLocations = this.savedLocations.concat(this.filterLocations)
    this.providerService.saveLocationFilter(this.savedLocations);
    this.articleService.saveLocationFilter(this.savedLocations);
    this.getSelentaSapDeletedArticles();
    this.getSelentaSapDeletedProviders();
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

}
