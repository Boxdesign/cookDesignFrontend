import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrinkService } from "../drink.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { NotificationsService } from 'angular2-notifications'
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { AppConfig } from "../../../global-utils/services/appConfig.service";

@Component({
	selector: 'drink-list',
  	templateUrl: './drink-list.component.html',
})
export class DrinkListComponent {
  @ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public allDrinks;
  public families;
  public filterLocations = [];
  public filterFamily = null;
  public userLocations;
  public drink;
  public drinkDeletedTitle;
  public drinkDeletedContent;
  public options = {
    timeOut: 1500,
    position: ["top", "right"]
  }
  public clone = require('clone')
  public savedLocations = [];
  public refresh = new Subject();
  public print = new Subject();    
  public costFilterSet=false;
  public numPages:number;
  public loading:boolean = true;
  public updating:boolean = false;
  public observerLocation;
  public active:boolean = true;
  public filterActive: boolean = false; 
  public printData;  
  public savedFilters;  
  public salesTax;

  constructor(
  	public drinkService : DrinkService, 
  	public translate: TranslateService, 
  	public router : Router, 
    public notification: NotificationsService, 
    public appConfig:AppConfig,
    public costFilterService: CostFilterService
   ) {

    // this.translate.get('searchBox.beginText').subscribe((res: string) => {
    //   this.searchBoxLabel = res;
    //   ////console.log('translation: '+ res);
    // });
   }

  ngOnInit(){
    this.appConfig.getSalesTax().subscribe((salesTax: any) => {
      this.salesTax=salesTax;
    });
    this.loading = true;
    this.updating = false;

    this.currentPage = this.drinkService.getCurrentPage();
    this.itemsPerPage=this.drinkService.getItemsPerPage();
    this.filterLocations =this.drinkService.getLocationFilter();
    this.filterText = this.drinkService.getSearchFilter();
    this.savedFilters = this.drinkService.getSavedFilters();
    ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;        
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data);   
        this.currentPage = this.drinkService.getCurrentPage();
        this.itemsPerPage = this.drinkService.getItemsPerPage();
        this.filterText = this.drinkService.getSearchFilter();
        this.savedFilters = this.drinkService.getSavedFilters();
        ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)         
        this.getDrinks();
    }) 

  	this.translation();
    this.getDrinks();
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

   public translation(){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translate.get('recipes.drink.notifications.drinkDeletedTitle').subscribe((res: string) => {
      this.drinkDeletedTitle = res;
    });

    this.translate.get('recipes.drink.notifications.drinkDeletedContent').subscribe((res: string) => {
      this.drinkDeletedContent = res;
    });
  }

  public getDrinks(){
    this.updating=true;
    this.drinkService.getDrinks(
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
        this.allDrinks = data.drinks;
        this.totalItems = data.totalElements;
        this.loading = false;
        this.updating = false;
      },
      (err) => {
        alert(err);
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
    this.drinkService.saveLocationFilter(this.savedLocations)
    this.getDrinks();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.costFilterSet=false;
    this.savedLocations=[];
    this.refresh.next([]);
    this.filterLocations=[];
    this.getDrinks();
  }

  public cancelSelection() {
    this.refresh.next(this.savedLocations);
    this.filterLocations = [];
    this.filterLocations = this.filterLocations.concat(this.savedLocations);
  }
  public printDrink(drink){
    this.printData = {  
      id: drink._id,
      versionId: drink.versions._id,
      name: drink.versions.lang.name, 
    } 
    this.print.next(this.printData)
  }

  public editDrink(_id, _versionId){
    this.router.navigate(['./recipes/drinks/edit', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'drink'}]);
  }

  public viewDrink(_id, _versionId){
    this.router.navigate(['./recipes/drinks/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'drink'}]);
  }

  public versionsDrink(_id){
    this.router.navigate(['./recipes/drinks/versions',_id]);
  }

  public addDrink(_id?){
    this.router.navigate(['./recipes/drinks/new']);
  }

  public deleteDrink(_id, confirm) {
    this.drinkService.deleteDrink(_id).subscribe(
      (data) => {
        this.notification.success(this.drinkDeletedTitle, this.drinkDeletedContent);
        this.getDrinks();      	
      },
      (err) => {
      	this.notification.error('Error', err || 'Error');
      })
  }

  public selectDrinkToEdit(drink){
    this.drink=drink;
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.drinkService.saveCurrentPage(this.currentPage);
    this.getDrinks();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.drinkService.saveItemsPerPage(item);
    this.getDrinks();
  }

  public searchDrinks(value: string){
    this.filterText=value;
    this.drinkService.saveSearchFilter(this.filterText);
    this.currentPage=1;
    this.getDrinks();
  }

  public saveFilters(){
    this.drinkService.saveFilters(this.sortField, this.sortOrder, this.active, this.filterActive);
    this.getDrinks();
  }

}