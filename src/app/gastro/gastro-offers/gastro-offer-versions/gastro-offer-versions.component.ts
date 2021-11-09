import {Input, Output, Component, ViewContainerRef, EventEmitter, ViewChild} from '@angular/core';
 import {AppConfig} from "../../../global-utils/services/appConfig.service";
 import {GastroOfferService} from "../gastro-offer.service";
 import {ActivatedRoute, Router} from '@angular/router';
 import {FamilyService} from "../../../libraries/family/family.service";
 import {TranslateService} from 'ng2-translate/ng2-translate';
 import { NotificationsService } from 'angular2-notifications'
 import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
 import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

 @Component({
 	selector: 'gastro-offer-versions',
 	templateUrl: './gastro-offer-versions.component.html',
 })
 export class GastroOfferVersionsComponent {
 	@ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
 	public id;
 	public totalItems: number;
	public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
	public itemsPerPage: number = 10; //Default items per page
	public orderBy: string = '';
	public filterText: string = '';
	public searchBoxLabel: string;
	public menuVersions;
	public families;
	public menuType;
	public numPages:number;
	public filterLocations = [];
  public observerLocation;
  public costFilterSet=false;
  public savedLocations;
	public setAsActiveVersionTitle: string;
	public setAsActiveVersionContent: string;
	public deleteVersionTitle: string;
	public deleteVersionContent: string;
	public notificationOptions = {
       timeOut: 1500,
      position: ["top", "right"]
    }

	constructor(public route: ActivatedRoute, public costFilterService: CostFilterService, public translate: TranslateService, public gastroOfferService: GastroOfferService,  public router: Router, public familyService: FamilyService, public notification: NotificationsService) {
		route.params.subscribe(params => {this.id=params['id']});

		route.data.subscribe((data: {menuType: String}) => {
      this.menuType = data.menuType;
    });
		this.translate.get('searchBox.beginText').subscribe((res: string) => {
			this.searchBoxLabel = res;
		  	//console.log('translation: '+ res);
		});

		this.translate.get('gastro.menu.notifications.setAsActiveVersionTitle').subscribe((res: string) => {
      this.setAsActiveVersionTitle = res;
    });

    this.translate.get('gastro.menu.notifications.setAsActiveVersionContent').subscribe((res: string) => {
      this.setAsActiveVersionContent = res;
    });

    this.translate.get('gastro.menu.notifications.deleteVersionTitle').subscribe((res: string) => {
      this.deleteVersionTitle = res;
    });

    this.translate.get('gastro.menu.notifications.deleteVersionContent').subscribe((res: string) => {
      this.deleteVersionContent = res;
    });
	}	

	ngOnInit(){
		this.getMenuVersions();

		this.filterLocations =this.gastroOfferService.getLocationFilter(this.menuType);


		this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;        
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data);  
        this.currentPage = this.gastroOfferService.getCurrentPage(this.menuType);
        this.itemsPerPage = this.gastroOfferService.getItemsPerPage(this.menuType);
        this.filterText = this.gastroOfferService.getSearchFilter(this.menuType);         
        this.getMenuVersions();
    })
	}

	public getFamilies() {
		this.familyService.getFamily('gastro', 10000, 0, '','').subscribe(
			(data: any) => {
				this.families = data.families;
			},
			(err) => {
				this.notification.error('Error', err || 'Server error');
			})
	}

	public getMenuVersions(){
		this.gastroOfferService.getMenuVersions(this.id, this.itemsPerPage, this.currentPage-1, this.orderBy, this.filterText, this.filterLocations).subscribe(
			(data: any) => {
				this.menuVersions=data.versions;
				this.totalItems = data.totalElements;
			});
	}

	public changeToActive(_id,_versionId){
		this.gastroOfferService.setAsActiveVersion(_id, _versionId, this.menuType).subscribe(
			(data: any) => {
				this.notification.success(this.setAsActiveVersionTitle,this.setAsActiveVersionContent);
				this.getMenuVersions();
			},
			(err) => {
					this.notification.error('Error', err || 'Server error');
		});
	}

	public editMenuVersion(_id,_versionId){
		switch (this.menuType) {
			case 'menu':
				this.router.navigate(['./gastro-offering/menus/edit',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);// code...
				break;
			case 'dailyMenuCarte':
				this.router.navigate(['./gastro-offering/daily-menu-carte/edit',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'dailyMenuCarte'}]);// code...
				break;
			case 'buffet':
				this.router.navigate(['./gastro-offering/buffets/edit',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'buffet'}]);// code...
				break;
			case 'carte':
				this.router.navigate(['./gastro-offering/cartes/edit',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'carte'}]);// code...
				break;
			case 'fixedPriceCarte':
				this.router.navigate(['./gastro-offering/fixed-price-cartes/edit',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'fixedPriceCarte'}]);// code...
				break;
			case 'catalog':
				this.router.navigate(['./gastro-offering/catalogs/edit',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'catalog'}]);// code...
				break;
			
		}
	}

	public deleteMenuVersion(_id,_versionId){
		this.gastroOfferService.deleteMenuVersion(_id, _versionId).subscribe(
			(data: any) => {
				this.notification.success(this.deleteVersionTitle,this.deleteVersionContent);
				this.getMenuVersions();
			},
			(err) => {
					this.notification.error('Error', err || 'Server error');
		});
	}

	public viewMenuVersion(_id, _versionId){
		switch (this.menuType) {
			case 'menu':
				this.router.navigate(['./gastro-offering/menus',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);// code...
				break;
			case 'dailyMenuCarte':
				this.router.navigate(['./gastro-offering/daily-menu-cartes',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'dailyMenuCarte'}]);// code...
				break;
			case 'buffet':
				this.router.navigate(['./gastro-offering/buffets',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'buffet'}]);// code...
				break;
			case 'carte':
				this.router.navigate(['./gastro-offering/cartes',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'carte'}]);// code...
				break;
			case 'fixedPriceCarte':
				this.router.navigate(['./gastro-offering/fixed-price-cartes',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'fixedPriceCarte'}]);// code...
				break;
			case 'catalog':
				this.router.navigate(['./gastro-offering/catalogs',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'catalog'}]);// code...
				break;
			
		}
	   
	}

	public pageHasChanged(data) {
		this.itemsPerPage = data.itemsPerPage;
		this.currentPage = data.page;
		this.getMenuVersions();
	}

	public updateItemsPerPage(item: number) {
		this.itemsPerPage = item;
		this.currentPage = 1;
		this.getMenuVersions();
	}

	public searchMenus(value: string){
		this.filterText=value;
		this.currentPage=1;
		this.getMenuVersions();
		this.filterText='';
	}

	public sortColumn(e, column: string) {
		this.filterText = '';
		this.orderBy = e + 'lang.' + column;
	  //console.log(this.orderBy);
	  this.getMenuVersions();
	}
}