import { Component, ViewContainerRef, EventEmitter, OnInit, ViewChild, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ArticleService } from "../../articles/article.service";
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { CompassService } from "../../../global-utils/services/compass.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ActivatedRoute, Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Article } from '../../../global-utils/models/article.model';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";


@Component({
  selector: 'provider-articles',
  templateUrl: './provider-articles.component.html',
  styleUrls: ['./provider-articles.component.scss']
})
export class ProviderArticlesComponent implements OnInit {
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
    position: ["top", "right"],
    timeOut: 15000,
    lastOnBottom: true
  }
  public numPages:number;

  constructor(
  	public articleService: ArticleService, 
  	public compassService: CompassService, 
  	public appConfig: AppConfig, 
  	public translate: TranslateService, 
  	public route: ActivatedRoute, 
  	public notification: NotificationsService, 
  	public router : Router
  ) {}

  ngOnInit() {
  	//Get provider id
    this.route.params.subscribe(params => {this.id=params['id'];});

    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });
    this.currentPage = this.articleService.getCurrentPage();
    this.itemsPerPage = this.articleService.getItemsPerPage();
    this.filterText = this.articleService.getSearchFilter(); 
    this.translation();
  	this.getArticles();
  }

  public translation(){
  	//Get translations
  	this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

  	this.translate.get('provider.article.notifications.articleCreatedTitle').subscribe((res: string) => {
      this.articleCreatedTitle = res;
    });

  	this.translate.get('provider.article.notifications.articleCreatedContent').subscribe((res: string) => {
      this.articleCreatedContent = res;
    });

  	this.translate.get('provider.article.notifications.articleUpdatedTitle').subscribe((res: string) => {
      this.articleUpdatedTitle = res;
    });

  	this.translate.get('provider.article.notifications.articleUpdatedContent').subscribe((res: string) => {
      this.articleUpdatedContent = res;
    });

  	this.translate.get('provider.article.notifications.articleDeletedTitle').subscribe((res: string) => {
      this.articleDeletedTitle = res;
    });

  	this.translate.get('provider.article.notifications.articleDeletedContent').subscribe((res: string) => {
      this.articleDeletedContent = res;
    });
  }

  getArticles() {  
    //console.log('id:',this.id);    
    this.articleService.getArticles(
      this.id, 
      null, 
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
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    );
  }

  public deleteArticle() {
    this.articleService.deleteArticle(this.article._id).subscribe(
      (data) => {
        //this.notification.success(this.articleDeletedTitle, this.articleDeletedContent);
        this.getArticles();      	
      },
      (err) => {
      	this.notification.error('Error', err || 'Error');
      })
  }

  public selectArticleToEdit(article){
    this.article=article;
  }

  addArticle(){
    this.compassService.saveRedirectData('providers/provider',this.id, null, this.mode)
    this.router.navigate(['./providers/article/new']);
  }

  editArticle(id){
    this.compassService.saveRedirectData('providers/provider',this.id, null, this.mode)
    this.router.navigate(['./providers/article/edit', id]);
  }

  public compareDataSheet(hasDataSheet) {
    if(this.article.hasDataSheet != hasDataSheet) {
      this.articleService.changeHasDataSheet(this.id, hasDataSheet).subscribe(
        (err) => {
            this.notification.error('Error', err || 'Error');
        })

    }
  }

  viewArticle(id){
    this.compassService.saveRedirectData('providers/provider',this.id, null, this.mode)
    this.router.navigate(['./providers/article/', id]);
  }


  saveArticle(){
  	if (this.mode == 'new') {

      this.articleService.addArticle(this.article).subscribe(
        (data) => {        
          this.notification.success(this.articleCreatedTitle, this.articleCreatedContent);
        },
        (err) => {
            this.notification.error('Error', err || 'Error');
        })

    } else if (this.mode == 'edit') {

      this.articleService.editArticle(this.article).subscribe(
        (data) => {        
          this.notification.success(this.articleUpdatedTitle, this.articleUpdatedContent);
        },
        (err) => {
            this.notification.error('Error', err || 'Error');
        })
    }
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

}
