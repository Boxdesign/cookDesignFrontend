import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GastroOfferService } from "../gastro-offer.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { FamilyService } from "../../../libraries/family/family.service";
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { NotificationsService } from 'angular2-notifications'
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { AppConfig } from "../../../global-utils/services/appConfig.service";

@Component({
  selector: 'gastro-offer-list',
  templateUrl: './gastro-offer-list.component.html',
  styleUrls: ['./gastro-offer-list.component.scss']
})
export class GastroOfferListComponent implements OnInit {
  @ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public allMenus;
  public families;
  public filterLocations = [];
  public filterType = null;
  public filterSeason = null;
  public userLocations;
  public menuOnEdit;
  public menuDeletedTitle;
  public menuDeletedContent;
  public menuType;
  public dailyMenuCarteDeletedTitle;
  public dailyMenuCarteDeletedContent;
  public buffetDeletedTitle;
  public buffetDeletedContent;
  public carteDeletedTitle;
  public carteDeletedContent;
  public fixedPriceCarteDeletedTitle;
  public fixedPriceCarteDeletedContent;
  public catalogDeletedTitle;
  public catalogDeletedContent;
  public clone = require('clone');
  public savedLocations = [];
  public refresh = new Subject();
  public print = new Subject();
  public costFilterSet=false;
  public numPages:number;
  public loading:boolean = true;
  public updating:boolean = false;
  public salesTax: number;
  public printData;


  public savedFilters;
  public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  public observerLocation;
  public active:boolean = true;
  public filterActive: boolean = false;  

  constructor(
  	public menuService : GastroOfferService, 
  	public translate: TranslateService, 
  	public router : Router, 
    public familyService: FamilyService, 
    public notification: NotificationsService, 
    public route: ActivatedRoute,
    public costFilterService: CostFilterService, 
    private appConfig: AppConfig
   ) {}

  ngOnInit(){

    this.appConfig.getSalesTax().subscribe((salesTax: any) => {
      this.salesTax=salesTax;
    });

    this.loading = true;
    this.updating = false;

    //Get type of menu from route path
    this.route.data.subscribe((data: {menuType: String}) => {
      this.menuType = data.menuType;
    });

    this.itemsPerPage = this.menuService.getItemsPerPage(this.menuType);
    this.filterLocations =this.menuService.getLocationFilter(this.menuType);
    this.currentPage = this.menuService.getCurrentPage(this.menuType);
    this.filterText = this.menuService.getSearchFilter(this.menuType);         
    this.savedFilters = this.menuService.getSavedFilters(this.menuType);
    ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)    

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        //console.log(data, 'data')
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data); 
        this.itemsPerPage = this.menuService.getItemsPerPage(this.menuType);
        this.currentPage = this.menuService.getCurrentPage(this.menuType);
        this.filterText = this.menuService.getSearchFilter(this.menuType);         
        this.savedFilters = this.menuService.getSavedFilters(this.menuType);  
        ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)

        this.getMenus();
    })

  	this.translation();
    this.getMenus();
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public translation(){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translate.get('gastro.menu.notifications.menuDeletedTitle').subscribe((res: string) => {
      this.menuDeletedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.menuDeletedContent').subscribe((res: string) => {
      this.menuDeletedContent = res;
    });

    this.translate.get('gastro.menu.notifications.dailyMenuCarteDeletedTitle').subscribe((res: string) => {
      this.dailyMenuCarteDeletedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.dailyMenuCarteDeletedContent').subscribe((res: string) => {
      this.dailyMenuCarteDeletedContent = res;
    });

    this.translate.get('gastro.menu.notifications.buffetDeletedTitle').subscribe((res: string) => {
      this.buffetDeletedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.buffetDeletedContent').subscribe((res: string) => {
      this.buffetDeletedContent = res;
    });

    this.translate.get('gastro.menu.notifications.carteDeletedTitle').subscribe((res: string) => {
      this.carteDeletedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.carteDeletedContent').subscribe((res: string) => {
      this.carteDeletedContent = res;
    });

    this.translate.get('gastro.menu.notifications.fixedPriceCarteDeletedTitle').subscribe((res: string) => {
      this.fixedPriceCarteDeletedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.fixedPriceCarteDeletedContent').subscribe((res: string) => {
      this.fixedPriceCarteDeletedContent = res;
    });

    this.translate.get('gastro.menu.notifications.catalogDeletedTitle').subscribe((res: string) => {
      this.catalogDeletedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.catalogDeletedContent').subscribe((res: string) => {
      this.catalogDeletedContent = res;
    });
  }

  public getMenus(){
    this.updating=true;
    this.menuService.getMenus(
      this.itemsPerPage, 
      this.currentPage-1,
      this.filterText,
      this.sortField,
      this.sortOrder,
      this.filterLocations, 
      this.filterType, 
      this.filterSeason, 
      this.menuType,
      this.active
    ).subscribe(
      (data:any) => {
        this.allMenus = data.gastroOffers;
        this.totalItems = data.totalElements;
        //console.log(this.allMenus);
        this.loading = false;
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
    this.menuService.saveLocationFilter(this.savedLocations, this.menuType)
    this.getMenus();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.costFilterSet=false;
    this.savedLocations=[];
    this.refresh.next([]);
    this.filterLocations=[];
    this.getMenus();
  }

  public cancelSelection() {
    this.refresh.next(this.clone(this.savedLocations));
    this.filterLocations = [];
    this.filterLocations = this.filterLocations.concat(this.savedLocations);
  }

  public editMenu(_id, _versionId){
    switch (this.menuType) {
      case 'menu':
        this.router.navigate(['./gastro-offering/menus/edit', _id, {versionId: _versionId, tab: 'menu'}]);
        break;
      case 'dailyMenuCarte':
        this.router.navigate(['./gastro-offering/daily-menu-cartes/edit', _id, {versionId: _versionId, tab: 'menu'}]);
        break;
      case 'buffet':
        this.router.navigate(['./gastro-offering/buffets/edit', _id, {versionId: _versionId, tab: 'menu'}]);
        break;        
      case 'carte':
        this.router.navigate(['./gastro-offering/cartes/edit', _id, {versionId: _versionId, tab: 'menu'}]);
        break;  
      case 'fixedPriceCarte':
        this.router.navigate(['./gastro-offering/fixed-price-cartes/edit', _id, {versionId: _versionId, tab: 'menu'}]);
        break;
      case 'catalog':
        this.router.navigate(['./gastro-offering/catalogs/edit', _id, {versionId: _versionId, tab: 'menu'}]);
        break;
      
      default:
        // code...
        break;
    }    
  }
 public printMenu(menu, menuType){
    this.printData = {  
      id: menu._id,
      versionId: menu.versions._id,
      name: menu.versions.lang.name, 
      menuType: menuType
    } 
    this.print.next(this.printData)
  }

  public viewMenu(_id, _versionId){
    switch (this.menuType) {
      case 'menu':
        this.router.navigate(['./gastro-offering/menus/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
        break;
      case 'dailyMenuCarte':
        this.router.navigate(['./gastro-offering/daily-menu-cartes/', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
        break;
      case 'buffet':
        this.router.navigate(['./gastro-offering/buffets/', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
        break;
      case 'carte':
        this.router.navigate(['./gastro-offering/cartes/', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
        break;
      case 'fixedPriceCarte':
        this.router.navigate(['./gastro-offering/fixed-price-cartes/', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
        break;
      case 'catalog':
        this.router.navigate(['./gastro-offering/catalogs/', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
        break;
      
      default:
        // code...
        break;
    }
  }

  public versionsMenu(_id){
    switch (this.menuType) {
      case 'menu':
        this.router.navigate(['./gastro-offering/menus/versions',_id]);
        break;
      case 'dailyMenuCarte':
        this.router.navigate(['./gastro-offering/daily-menu-cartes/versions', _id]);
        break; 
      case 'buffet':
        this.router.navigate(['./gastro-offering/buffets/versions', _id]);
        break;
      case 'carte':
        this.router.navigate(['./gastro-offering/cartes/versions', _id]);
        break;
      case 'fixedPriceCarte':
        this.router.navigate(['./gastro-offering/fixed-price-cartes/versions', _id]);
        break;
      case 'catalog':
        this.router.navigate(['./gastro-offering/catalogs/versions', _id]);
        break;
      
      default:
        // code...
        break;
    }
    
  }

  public addMenu(_id?){
    switch (this.menuType) {
      case 'menu':
        this.router.navigate(['./gastro-offering/menus/new']);
        break;
      case 'dailyMenuCarte':
        this.router.navigate(['./gastro-offering/daily-menu-cartes/new']);
        break;
      case 'buffet':
        this.router.navigate(['./gastro-offering/buffets/new']);
        break;
      case 'carte':
        this.router.navigate(['./gastro-offering/cartes/new']);
        break;
      case 'fixedPriceCarte':
        this.router.navigate(['./gastro-offering/fixed-price-cartes/new']);
        break;
      case 'catalog':
        this.router.navigate(['./gastro-offering/catalogs/new']);
        break;
      
      default:
        // code...
        break;
    }    
  }

  public deleteMenu() {
    this.menuService.deleteMenu(this.menuOnEdit._id).subscribe(
      (data) => {
        switch (this.menuType) {
          case 'menu':
            this.notification.success(this.menuDeletedTitle, this.menuDeletedContent);
            break;
          case 'dailyMenuCarte':
            this.notification.success(this.dailyMenuCarteDeletedTitle, this.dailyMenuCarteDeletedContent);
            break;
          case 'buffet':
            this.notification.success(this.buffetDeletedTitle, this.buffetDeletedContent);
            break;
          case 'carte':
            this.notification.success(this.carteDeletedTitle, this.carteDeletedContent);
            break;
          case 'fixedPriceCarte':
            this.notification.success(this.fixedPriceCarteDeletedTitle, this.fixedPriceCarteDeletedContent);
            break;
          case 'catalog':
            this.notification.success(this.catalogDeletedTitle, this.catalogDeletedContent);
            break;
          
          default:
            // code...
            break;
        }
        this.getMenus();      	
      },
      (err) => {
      	this.notification.error('Error', err || 'Error');
      })
  }

  public selectMenuToEdit(menu){
    this.menuOnEdit=menu;
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.menuService.saveCurrentPage(this.currentPage, this.menuType);
    this.getMenus();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.menuService.saveItemsPerPage(item ,this.menuType);
    this.getMenus();
  }

  public searchMenus(value: string){
    this.filterText=value;
    this.menuService.saveSearchFilter(this.filterText, this.menuType);
    this.currentPage=1;
    this.getMenus();
  }
public saveFilters(){
  this.menuService.saveFilters(this.sortField, this.sortOrder, this.menuType, this.active, this.filterActive);
  this.getMenus();
  }
}