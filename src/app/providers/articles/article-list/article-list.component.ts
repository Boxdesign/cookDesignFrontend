import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from "../article.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { NotificationsService } from 'angular2-notifications'
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
	@ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public articles;
  public families;
  public filterLocations = [];
  public userLocations;
  public articleDeletedTitle;
  public articleDeletedContent;
  public article;
  public clone = require('clone');
  public savedLocations = [];
  public refresh = new Subject();
  public costFilterSet=false;  
  public numPages:number;
  public loading:boolean = true;
  public updating:boolean = false;

  public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  public observerLocation;
  public savedFilters;

  constructor(
  	public articleService : ArticleService, 
  	public translate: TranslateService, 
  	public router : Router, 
    public notification: NotificationsService, 
    public route: ActivatedRoute, 
    public costFilterService: CostFilterService
  ) {}

  ngOnInit(){
  	this.loading = true;
    this.updating = false;
    this.currentPage = this.articleService.getCurrentPage();
    this.itemsPerPage = this.articleService.getItemsPerPage();
    this.filterText = this.articleService.getSearchFilter();
    this.savedFilters = this.articleService.getSavedFilters();
    ( { sortOrder: this.sortOrder, sortField: this.sortField} = this.savedFilters)

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data); 
        this.getArticles();
    }) 
        
  	this.translation();
    this.getArticles();
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  private translation(){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translate.get('provider.article.notifications.articleDeletedTitle').subscribe((res: string) => {
      this.articleDeletedTitle = res;
    });

    this.translate.get('provider.article.notifications.articleDeletedContent').subscribe((res: string) => {
      this.articleDeletedContent = res;
    });
  }

  public getArticles(){
    this.updating=true;
    this.articleService.getArticles(
      null, 
      null, 
      this.itemsPerPage, 
      this.currentPage-1,
      this.filterText, 
      this.filterLocations,
      this.sortField,
      this.sortOrder
    ).subscribe(
      (data:any) => {
        this.articles = data.articles;
        this.totalItems = data.totalElements;
        this.loading=false;
        this.updating = false;        
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      }
    )
  }

  public filterListByLocation(){
    this.costFilterSet=true;
    this.savedLocations = [];
    this.savedLocations = this.savedLocations.concat(this.filterLocations)
    this.articleService.saveLocationFilter(this.savedLocations)
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
    this.getArticles();
  }

  public cancelSelection() {
    this.refresh.next(this.clone(this.savedLocations));
    this.filterLocations = [];
    this.filterLocations = this.filterLocations.concat(this.savedLocations);
  }

  public editArticle(_id){
    this.router.navigate(['./providers/article/edit', _id]);   
  }

  public viewArticle(_id){
    this.router.navigate(['./providers/article/',_id]);
  }

  public addArticle(_id?){
    this.router.navigate(['./providers/article/new']);
 
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

  public selectArticleToEdit(article){
    this.article=article;
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

  public saveFilters(){
    this.articleService.saveFilters(this.sortField, this.sortOrder);
    this.getArticles();
  }

}

