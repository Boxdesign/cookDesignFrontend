import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubproductsService } from "../subproducts.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { NotificationsService } from 'angular2-notifications'
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";

@Component({
  templateUrl: './subproducts-list.template.html',
  styleUrls: ['./subproducts-list.component.css']
})
export class SubproductsListComponent {
  @ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public allSubproducts;
  public filterLocations = [];
  public filterFamily = null;
  public userLocations;
  public subproduct;
  public subproductDeletedTitle;
  public subproductDeletedContent;
  public subOnEdit: any;
  public costLocation;
  public clone = require('clone');
  public savedLocations = [];
  public refresh = new Subject();
  public print = new Subject();  
  public costFilterSet=false;
  public text = 'some text';
  public numPages:number;
  public loading:boolean = true;
  public updating:boolean = false;
  public observerLocation;
  public active:boolean = true;
  public filterActive: boolean = false;

  public notificationOptions = {
     timeOut: 1500,
    position: ["top", "right"]
  }
  public printData;  
  public savedFilters;  

  constructor(
  	public subproductService : SubproductsService, 
  	public translate: TranslateService, 
  	public router : Router, 
    public notification: NotificationsService, 
    public costFilterService: CostFilterService
  ){}

  ngOnInit(){
    this.loading = true;
    this.updating = false;

    this.currentPage = this.subproductService.getCurrentPage();
    this.itemsPerPage=this.subproductService.getItemsPerPage();
    this.filterText = this.subproductService.getSearchFilter();
    this.filterLocations =this.subproductService.getLocationFilter();
    this.savedFilters = this.subproductService.getSavedFilters();
    ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data);        
        this.currentPage = this.subproductService.getCurrentPage();
        this.itemsPerPage = this.subproductService.getItemsPerPage();
        this.filterText = this.subproductService.getSearchFilter();  
        this.savedFilters = this.subproductService.getSavedFilters();
        ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)       
        this.getSubproducts();
    })    

    this.translation();
    this.getSubproducts();    
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public translation(){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

     this.translate.get('recipes.subproduct.notifications.subproductDeletedTitle').subscribe((res: string) => {
      this.subproductDeletedTitle = res;
    });

     this.translate.get('recipes.subproduct.notifications.subproductDeletedContent').subscribe((res: string) => {
      this.subproductDeletedContent = res;
    });
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


  public getSubproducts(){
    this.updating=true;
    this.subproductService.getSubproducts(
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
        this.allSubproducts = data.subproducts;
        this.totalItems = data.totalElements;
        this.loading = false;
        this.updating = false;
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
        this.loading = false;
        this.updating = false;        
      });
  }

  public filterListByLocation(){
    this.costFilterSet=true;
    this.savedLocations = [];
    this.savedLocations = this.savedLocations.concat(this.filterLocations)
    this.subproductService.saveLocationFilter(this.savedLocations)
    this.getSubproducts();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.costFilterSet=false;
    this.savedLocations=[];
    this.refresh.next([]);
    this.filterLocations=[];
    this.getSubproducts();
  }

  public cancelSelection() {
    this.refresh.next(this.clone(this.savedLocations));
    this.filterLocations = [];
    this.filterLocations = this.filterLocations.concat(this.savedLocations);
  }

  public printSubproduct(subproduct){
    this.printData = {  
      id: subproduct._id,
      versionId: subproduct.versions._id,
      name: subproduct.versions.lang.name, 
    } 
    this.print.next(this.printData)
  }
  public editSubproduct(_id, _versionId){
    this.router.navigate(['./recipes/subproducts/edit', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'subproduct'}]);
  }

  public viewSubproduct(_id, _versionId){
    this.router.navigate(['./recipes/subproducts/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'subproduct'}]);
  }

  public versionsSubproduct(_id){
    this.router.navigate(['./recipes/subproducts/versions',_id]);
  }

  public addSubproduct(_id?){
    this.router.navigate(['./recipes/subproducts/new']);
  }
  public selectedElementToEdit(subproduct){
    this.subOnEdit=subproduct;
  }

  public deleteSubproduct(_id?, confirm?) {
    this.subproductService.deleteSubproduct(this.subOnEdit._id).subscribe(
      (data) => {
        this.notification.success(this.subproductDeletedTitle, this.subproductDeletedContent);
        this.getSubproducts();
      },
      (err) => {
          this.notification.error('Error', err || 'Error');
        })
  }

  public selectSubproductToEdit(subproduct){
    //console.log(subproduct, 'subproduct')
    this.subproduct=subproduct;
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.subproductService.saveCurrentPage(this.currentPage);
    this.getSubproducts();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.subproductService.saveItemsPerPage(item);
    this.getSubproducts();
  }

  public searchSubproducts(value: string){
    this.filterText=value;
    this.subproductService.saveSearchFilter(this.filterText);
    this.currentPage=1;
    this.getSubproducts();
 }

 public saveFilters(){
    this.subproductService.saveFilters(this.sortField, this.sortOrder, this.active, this.filterActive);
    this.getSubproducts();
  }

}

