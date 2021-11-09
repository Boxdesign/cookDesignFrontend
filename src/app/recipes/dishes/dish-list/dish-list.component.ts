
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DishService } from "../dish.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { FamilyService } from "../../../libraries/family/family.service";
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { NotificationsService } from 'angular2-notifications';
import { AppConfig } from "../../../global-utils/services/appConfig.service";

@Component({
  templateUrl: './dish-list.template.html',
})
export class DishListComponent {
  @ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public allDishes;
  public families;
  public filterLocations = [];
  public filterFamily = null;
  public userLocations;
  public dish;
  public clone = require('clone')
  public savedLocations;
  public costFilterSet=false;
  public refresh = new Subject();
  public print = new Subject();  
  public numPages:number;
  public dishDeletedTitle;
  public dishDeletedContent;
  public loading:boolean = false;
  public updating:boolean = false;
  public notificationOptions = {
     timeOut: 1500,
    position: ["top", "right"]
  }
  public observerLocation;
  public active:boolean = true;
  public filterActive: boolean = false;  
  public printData;  
  public savedFilters;
  public salesTax;

  constructor(
  	public dishService : DishService, 
  	public translate: TranslateService, 
    public appConfig:AppConfig,
  	public router : Router, 
    public familyService: FamilyService, 
    public costFilterService: CostFilterService, 
    public notification: NotificationsService
   ) {}

  ngOnInit(){
    this.appConfig.getSalesTax().subscribe((salesTax: any) => {
      this.salesTax=salesTax;
    });
    this.loading = true;
    this.updating = false;

    this.currentPage = this.dishService.getCurrentPage();
    this.itemsPerPage=this.dishService.getItemsPerPage();
    this.filterLocations =this.dishService.getLocationFilter();
    this.filterText = this.dishService.getSearchFilter();
    this.savedFilters = this.dishService.getSavedFilters();
    ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translate.get('recipes.dish.notifications.dishDeletedTitle').subscribe((res: string) => {
      this.dishDeletedTitle = res;
    });

    this.translate.get('recipes.dish.notifications.dishDeletedContent').subscribe((res: string) => {
      this.dishDeletedContent = res;
    });

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;        
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data);  
        this.currentPage = this.dishService.getCurrentPage();
        this.itemsPerPage = this.dishService.getItemsPerPage();
        this.filterText = this.dishService.getSearchFilter();         
        this.savedFilters = this.dishService.getSavedFilters();
        ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)         
        this.getDishes();
    }) 

    /*this.getFamilies();*/
    this.getDishes();
  }

ngOnDestroy() {
    this.observerLocation.unsubscribe()
}

  public getDishes(){
    this.updating=true;
    this.dishService.getDishes(
      this.itemsPerPage, 
      this.currentPage-1, 
      this.filterText,
      this.sortField,
      this.sortOrder,
      this.filterLocations, 
      this.filterFamily,
      this.active
    ).subscribe(
      (data:any) => {
        this.allDishes = data.dishes;
        this.totalItems = data.totalElements;
        this.loading=false;
        this.updating=false;
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
    this.dishService.saveLocationFilter(this.savedLocations)
    this.getDishes();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.costFilterSet=false;
    this.savedLocations=[];
    this.refresh.next([]);
    this.filterLocations=[];
    this.getDishes();
  }

  public cancelSelection() {
    this.refresh.next(this.savedLocations);
    this.filterLocations = [];
    this.filterLocations = this.filterLocations.concat(this.savedLocations);
  } 
  public printDish(dish){
    this.printData = {  
      id: dish._id,
      versionId: dish.versions._id,
      name: dish.versions.lang.name, 
    } 
    this.print.next(this.printData)
  }

  public editDish(_id, _versionId){
    this.router.navigate(['./recipes/dishes/edit', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'dish'}]);
  }

  public viewDish(_id, _versionId){
    this.router.navigate(['./recipes/dishes/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'dish'}]);
  }

  public versionsDish(_id){
    this.router.navigate(['./recipes/dishes/versions',_id]);
  }

  public addDish(_id?){
    this.router.navigate(['./recipes/dishes/new']);
  }

  public deleteDish(_id?, confirm?) {

    this.dishService.deleteDish(this.dish._id).subscribe(
      (data) => {
        this.notification.success(this.dishDeletedTitle,this.dishDeletedContent)
        this.getDishes();
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })

  }

  public selectedElementToDelete(dish){

    this.dish = dish

  }

  public selectDishToEdit(dish){

    this.dish=dish;

  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.dishService.saveCurrentPage(this.currentPage);
    this.getDishes();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.dishService.saveItemsPerPage(item);
    this.getDishes();
  }

  public searchDishes(value: string){
    this.filterText=value;
    this.dishService.saveSearchFilter(this.filterText);
    this.currentPage=1;
    this.getDishes();
  }

  public saveFilters(){
    this.dishService.saveFilters(this.sortField, this.sortOrder, this.active, this.filterActive);
    this.getDishes();
  }
 
}
