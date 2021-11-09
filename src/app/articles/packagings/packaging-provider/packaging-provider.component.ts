import { Component, Output, ViewContainerRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ArticleService } from "../../../providers/articles/article.service";
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ActivatedRoute, Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Article } from '../../../global-utils/models/article.model';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
 import { CompassService } from '../../../global-utils/services/compass.service';


@Component({
  selector: 'packaging-provider',
  templateUrl: './packaging-provider.component.html',
  styleUrls: ['./packaging-provider.component.scss']
})
export class PackagingProviderComponent implements OnInit {
  @Output() passRedirectOn = new EventEmitter();
  @ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  searchBoxLabel: string;
  mode;
  id;
  articles;
  article;
  articleCreatedTitle;
  articleCreatedContent;
  articleUpdatedTitle;
  articleUpdatedContent;
  articleDeletedTitle;
  articleDeletedContent;
  redirectUrl;
  filterLocations = [];

  options = {
    position: ["bottom", "left"],
    timeOut: 15000,
    lastOnBottom: true
  }
  public numPages:number;

  constructor(public articleService: ArticleService, public appConfig: AppConfig, public translate: TranslateService, 
  	public route: ActivatedRoute, public notification: NotificationsService, public router : Router, public compassService: CompassService) { 
  	
  	//Get ingredient id
    route.params.subscribe(params => {this.id=params['id'];});

    //Get mode from route path
    route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });
  }

  ngOnInit() {
  	this.getArticles();
  	this.translation();
  }

  public translation(){
    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
      //console.log('translation: '+ res);
    }); 
  }

  getArticles() {  	
    this.articleService.getArticles(
      null, 
      this.id, 
      this.itemsPerPage, 
      this.currentPage - 1,
      this.filterText, 
      this.filterLocations,
      this.sortField,
      this.sortOrder
    ).subscribe(
      (data: any) => {
        this.articles = data.articles;
        this.totalItems = data.totalElements;
        //console.log(this.articles, 'articles')
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    );
  }

  public selectArticleToEdit(article){
    this.article=article;
  }

  viewArticle(id){
    this.passRedirectOn.emit(true);
    this.compassService.saveRedirectData('articles/packagings',this.id, '', 'view');
    this.router.navigate(['./providers/article/', id]);
  }

  viewProvider(article){
    this.passRedirectOn.emit(true);
    this.compassService.saveRedirectData('articles/packagings',this.id, '', 'view');
    this.router.navigate(['./providers/provider/', article.provider._id]);
  }

  public filterListByLocation(){
    this.getArticles();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.filterLocations=[];
    this.locationComponent.resetCheckboxes();
    this.getArticles();
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.articleService.saveCurrentPage(this.currentPage);
    this.getArticles();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.articleService.saveItemsPerPage(item);
    this.getArticles();
  }

  public searchArticles(value: string){
    this.filterText=value;
    this.currentPage=1;
    this.articleService.saveSearchFilter(this.filterText);
    this.getArticles();
  }

  public deleteArticle(){}
}