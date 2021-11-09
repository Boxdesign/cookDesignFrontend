import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from "../products.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
 @ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public allProducts;
  public filterLocations = [];
  public filterFamily = null;
  public userLocations;
  public product;
  public clone = require('clone')
  public savedLocations = [];
  public refresh = new Subject();
  public print = new Subject();  
  public costFilterSet=false;
  public numPages:number;
  public productDeletedTitle;
  public productDeletedContent;
  public loading:boolean = true;
  public updating:boolean = false;
  public notificationOptions = {
     timeOut: 1500,
    position: ["top", "right"]
  }
  public observerLocation;
  public active:boolean = true;
  public filterActive: boolean = false;  
  public printData;  
  public salesTax;
  public savedFilters;

  constructor(
  	public productService : ProductsService, 
  	public translate: TranslateService, 
    public appConfig:AppConfig,
  	public router : Router, 
    public costFilterService: CostFilterService, 
    public notification: NotificationsService
  ) {}

  ngOnInit(){
    this.appConfig.getSalesTax().subscribe((salesTax: any) => {
      this.salesTax=salesTax;
    });
	  this.currentPage = this.productService.getCurrentPage();
	  this.filterLocations =this.productService.getLocationFilter();
	  this.itemsPerPage=this.productService.getItemsPerPage();
	  this.filterText = this.productService.getSearchFilter();
    this.savedFilters = this.productService.getSavedFilters();
    ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)

    this.loading = true;
    this.updating = false;

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data);  
        this.currentPage = this.productService.getCurrentPage();
        this.itemsPerPage = this.productService.getItemsPerPage();
        this.filterText = this.productService.getSearchFilter(); 
        this.savedFilters = this.productService.getSavedFilters();
        ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)        
        this.getProducts();
    }) 

    this.translation();
    this.getProducts();    
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public translation(){
  	
	    this.translate.get('searchBox.beginText').subscribe((res: string) => {
	      this.searchBoxLabel = res;
	    });

	    this.translate.get('recipes.product.notifications.productDeletedTitle').subscribe((res: string) => {
	      this.productDeletedTitle = res;
	    });

	    this.translate.get('recipes.product.notifications.productDeletedContent').subscribe((res: string) => {
	      this.productDeletedContent = res;
	    });
  }

  public getProducts(){
    this.updating=true;
    this.productService.getProducts(
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
        this.allProducts = data.products;
        this.totalItems = data.totalElements;
        this.loading = false;
        this.updating = false;
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })
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
    this.productService.saveLocationFilter(this.savedLocations)
    this.getProducts();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.costFilterSet=false;
    this.savedLocations=[];
    this.refresh.next([]);
    this.filterLocations=[];
    this.getProducts();
  }

  public cancelSelection() {
    this.refresh.next(this.clone(this.savedLocations));
    this.filterLocations = [];
    this.filterLocations = this.filterLocations.concat(this.savedLocations);
  }
  public printProduct(product){
    this.printData = {  
      id: product._id,
      versionId: product.versions._id,
      name: product.versions.lang.name, 
    } 
    this.print.next(this.printData)
  }
  
  public editProduct(_id, _versionId){
    this.router.navigate(['./recipes/products/edit', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'product'}]);
  }

  public viewProduct(_id, _versionId){
    this.router.navigate(['./recipes/products/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'product'}]);
  }

  public versionsProduct(_id){
    this.router.navigate(['./recipes/products/versions',_id]);
  }

  public addProduct(_id?){
    this.router.navigate(['./recipes/products/new']);
  }

  public deleteProduct(_id?, confirm?) {
    this.productService.deleteProduct(this.product._id).subscribe(
      (data) => {
        this.notification.success(this.productDeletedTitle, this.productDeletedContent);
        this.getProducts();
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })
  }

  public selectedElementToDelete(product){
    this.product=product;
  }

  public selectProductToEdit(product){
    this.product=product;
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.productService.saveCurrentPage(this.currentPage);
    this.getProducts();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.productService.saveItemsPerPage(item);
    this.getProducts();
  }

  public searchProducts(value: string){
    this.filterText=value;
    this.productService.saveSearchFilter(this.filterText);
    this.currentPage=1;
    this.getProducts();
  }

  public saveFilters(){
    this.productService.saveFilters(this.sortField, this.sortOrder, this.active, this.filterActive);
    this.getProducts();
  }
}
