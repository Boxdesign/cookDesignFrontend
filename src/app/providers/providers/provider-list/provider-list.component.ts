import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderService } from "../provider.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { NotificationsService } from 'angular2-notifications'
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit {
@ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public allProviders;
  public families;
  public filterLocations = [];
  public userLocations;
  public providerDeletedTitle;
  public providerDeletedContent;
  public provider;
  public clone = require('clone');
  public savedLocations = [];
  public refresh = new Subject();
  public costFilterSet=false;
  public numPages:number;
  public active:boolean = true;
  public filterActive: boolean = false;  
  public loading:boolean = true;
  public updating:boolean = false;
  public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  public observerLocation;
  public savedFilters;

  constructor(
  	public providerService : ProviderService, 
  	public translate: TranslateService, 
  	public router : Router, 
    public notification: NotificationsService, 
    public route: ActivatedRoute, 
    public costFilterService: CostFilterService
  ) {}

  ngOnInit(){

  	this.loading = true;
    this.updating = false;
    this.itemsPerPage = this.providerService.getItemsPerPage();
    this.currentPage = this.providerService.getCurrentPage();
    this.filterText = this.providerService.getSearchFilter();
    this.filterLocations =this.providerService.getLocationFilter();
    this.savedFilters = this.providerService.getSavedFilters();
    ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data);        
        this.currentPage = this.providerService.getCurrentPage();
        this.itemsPerPage = this.providerService.getItemsPerPage();
        this.filterText = this.providerService.getSearchFilter(); 
        this.savedFilters = this.providerService.getSavedFilters();
        ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)        
        this.getProviders();
    }) 

  	this.translation();
    this.getProviders();
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public translation(){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translate.get('provider.notifications.providerDeletedTitle').subscribe((res: string) => {
      this.providerDeletedTitle = res;
    });

    this.translate.get('provider.notifications.providerDeletedContent').subscribe((res: string) => {
      this.providerDeletedContent = res;
    });
  }

  public getProviders(){
    this.updating=true;
    this.providerService.getProviders(
      this.itemsPerPage, 
      this.currentPage-1,
      this.filterText, 
      this.filterLocations,
      this.sortField,
      this.sortOrder,
      null,
      this.active
    ).subscribe(
      (data:any) => {
        this.allProviders = data.providers;
        this.totalItems = data.totalElements;
        this.loading=false;
        this.updating = false;
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      }
    )
  }

  public toggleActiveState(){

  	if(this.filterActive) {
  		if(this.active) {
  			this.active = false;
  		}
  		else 
  		{ 
  			this.filterActive = false;
  			this.active=null;
  		}
  	}
  	else
  	{
  		this.filterActive = true; 
  		this.active=true;
  	}
  	this.saveFilters();
  }  

  public filterListByLocation(){
    this.costFilterSet=true;
    this.savedLocations = [];
    this.savedLocations = this.savedLocations.concat(this.filterLocations)
    this.providerService.saveLocationFilter(this.savedLocations)
    this.getProviders();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.costFilterSet=false;
    this.savedLocations=[];
    this.refresh.next([]);
    this.filterLocations=[];
    this.getProviders();
  }

  public cancelSelection() {
    // console.log('cancelling')
    // console.log(this.savedLocations, 'saved locs')
    this.refresh.next(this.clone(this.savedLocations));
    this.filterLocations = [];
    this.filterLocations = this.filterLocations.concat(this.savedLocations);
  }

  public editProvider(_id){
    this.router.navigate(['./providers/provider/edit', _id]);   
  }

  public viewProvider(_id){
    this.router.navigate(['./providers/provider/',_id]);
  }

  public addProvider(_id?){
    this.router.navigate(['./providers/provider/new']);
 
  }

  public deleteProvider() {
    this.providerService.deleteProvider(this.provider._id).subscribe(
      (data) => {
        this.notification.success(this.providerDeletedTitle, this.providerDeletedContent);
        this.getProviders();      	
      },
      (err) => {
      	this.notification.error('Error', err || 'Error');
      })
  }

  public selectProviderToEdit(provider){
    this.provider=provider;
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.providerService.saveCurrentPage(this.currentPage);
    this.getProviders();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.providerService.saveItemsPerPage(item);
    this.getProviders();
  }

  public searchProviders(value: string){
    this.filterText=value;
    this.currentPage=1;
    this.providerService.saveSearchFilter(this.filterText);
    this.getProviders();
  }
  
  public saveFilters(){
    this.providerService.saveFilters(this.sortField, this.sortOrder, this.active, this.filterActive);
    this.getProviders();
  }
 

}
