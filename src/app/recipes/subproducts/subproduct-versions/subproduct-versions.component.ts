 import {Input, Output, Component, ViewContainerRef, EventEmitter, ViewChild} from '@angular/core';
 import {AppConfig} from "../../../global-utils/services/appConfig.service";
 import {SubproductsService} from "../subproducts.service";
 import {ActivatedRoute, Router} from '@angular/router';
 import {FamilyService} from "../../../libraries/family/family.service";
 import {TranslateService} from 'ng2-translate/ng2-translate';
 import { NotificationsService } from 'angular2-notifications';
 import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
 import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

 @Component({
 	selector: 'subproduct-versions',
 	templateUrl: './subproduct-versions.template.html',
 })
 export class SubproductVersionsComponent {
 	@ViewChild(LocationFilterComponent)
  	public locationComponent: LocationFilterComponent;
	 	public id;
	 	public totalItems: number;
  	public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  	public itemsPerPage: number = 10; //Default items per page
  	public orderBy: string = '';
  	public filterText: string = '';
  	public searchBoxLabel: string;
  	public subproductVersions;
  	public families;
  	public numPages:number;
  	public filterLocations = [];
	  public observerLocation;
	  public costFilterSet=false;
	  public savedLocations;


	constructor(public route: ActivatedRoute, public costFilterService: CostFilterService, public translate: TranslateService, public subproductsService: SubproductsService,  public router: Router, public familyService: FamilyService, public notification: NotificationsService) {
		route.params.subscribe(params => {this.id=params['id']});

		this.translate.get('searchBox.beginText').subscribe((res: string) => {
			this.searchBoxLabel = res;
		  	////console.log('translation: '+ res);
		});
	}	

	ngOnInit(){
		this.getSuproductVersions();

		this.filterLocations =this.subproductsService.getLocationFilter();


		this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;        
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data);  
        this.currentPage = this.subproductsService.getCurrentPage();
        this.itemsPerPage = this.subproductsService.getItemsPerPage();
        this.filterText = this.subproductsService.getSearchFilter();         
        this.getSuproductVersions();
    })
	}

	public getFamilies() {
		this.familyService.getFamily('recipe', 10000, 0, '','').subscribe(
			(data: any) => {
				this.families = data.families;
			},
			(err) => {
          		this.notification.error('Error', err || 'Error');
        	}) 
	}

	public getSuproductVersions(){
		this.subproductsService.getSubproductVersions(this.id, this.itemsPerPage, this.currentPage-1, this.orderBy, this.filterText, this.filterLocations).subscribe(
			(data: any) => {
				this.subproductVersions=data.versions;
				this.totalItems = data.totalElements;
				console.log(this.subproductVersions, 'subproductVersions')
			});
	}

	public changeToActive(_id,_versionId){
		this.subproductsService.setAsActiveVersion(_id, _versionId).subscribe(
			(data: any) => {
				alert("Versión de subproducto activada");
				this.getSuproductVersions();
			},
			(err) => {
          		this.notification.error('Error', err || 'Error');
        	}) 
	}

	public editSubproductVersion(_id,_versionId){
		this.router.navigate(['./recipes/subproducts/edit', _id, {versionId: _versionId, tab: 'subproduct'}]);
	}

	public deleteSubproductVersion(_id,_versionId){
		this.subproductsService.deleteSubproductVersion(_id, _versionId).subscribe(
			(data: any) => {
				alert("Versión de subproducto eliminada");
				this.getSuproductVersions();
			},
			(err) => {
          		this.notification.error('Error', err || 'Error');
        	}) 
	}

	public viewSubproductVersion(_id, _versionId){
	   this.router.navigate(['./recipes/subproducts/',_id, {versionId: _versionId, tab: 'subproduct'}]);
	}

	public pageHasChanged(data) {
		this.itemsPerPage = data.itemsPerPage;
		this.currentPage = data.page;
		this.getSuproductVersions();
	}

	public updateItemsPerPage(item: number) {
		this.itemsPerPage = item;
		this.currentPage = 1;
		this.getSuproductVersions();
	}

	public searchSubproducts(value: string){
		this.filterText=value;
		this.currentPage=1;
		this.getSuproductVersions();
		this.filterText='';
	}

	public sortColumn(e, column: string) {
		this.filterText = '';
		this.orderBy = e + 'lang.' + column;
	    ////console.log(this.orderBy);
	    this.getSuproductVersions();
	}
}