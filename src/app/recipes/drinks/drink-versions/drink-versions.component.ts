import {Input, Output, Component, ViewContainerRef, EventEmitter, ViewChild} from '@angular/core';
 import {AppConfig} from "../../../global-utils/services/appConfig.service";
 import {DrinkService} from "../drink.service";
 import {ActivatedRoute, Router} from '@angular/router';
 import {FamilyService} from "../../../libraries/family/family.service";
 import {TranslateService} from 'ng2-translate/ng2-translate';
 import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
 import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

 @Component({
 	selector: 'drink-versions',
 	templateUrl: './drink-versions.component.html',
 })
 export class DrinkVersionsComponent {
 	@ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
 	public id;
 	public totalItems: number;
	public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
	public itemsPerPage: number = 10; //Default items per page
	public orderBy: string = '';
	public filterText: string = '';
	public searchBoxLabel: string;
	public drinkVersions;
	public families;
	public numPages:number;
	public filterLocations = [];
  public observerLocation;
  public costFilterSet=false;
  public savedLocations;

	constructor(public route: ActivatedRoute, public costFilterService: CostFilterService, public translate: TranslateService, public drinkService: DrinkService,  public router: Router, public familyService: FamilyService) {
		route.params.subscribe(params => {this.id=params['id']});

		this.translate.get('searchBox.beginText').subscribe((res: string) => {
			this.searchBoxLabel = res;
		  	////console.log('translation: '+ res);
		});
	}	

	ngOnInit(){
		this.getDrinkVersions();
		this.filterLocations =this.drinkService.getLocationFilter();


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
        this.getDrinkVersions();
    })
	}

	public getFamilies() {
		this.familyService.getFamily('recipe', 10000, 0, '','').subscribe(
			(data: any) => {
				this.families = data.families;
				//console.log(this.families)
			},
			(err) => {
				alert("Server Error");
			})
	}

	public getDrinkVersions(){
		this.drinkService.getDrinkVersions(this.id, this.itemsPerPage, this.currentPage-1, this.orderBy, this.filterText, this.filterLocations).subscribe(
			(data: any) => {
				this.drinkVersions=data.versions;
				this.totalItems = data.totalElements;
				//console.log(this.drinkVersions);
			});
	}

	public changeToActive(_id,_versionId){
		this.drinkService.setAsActiveVersion(_id, _versionId).subscribe(
			(data: any) => {
				alert("Versión de bebida activada");
				this.getDrinkVersions();
			},
			(err) => {
					alert("Error activando versión de bebida");
		});
	}

	public editDrinkVersion(_id,_versionId){
		this.router.navigate(['./recipes/drinks/edit', _id, {versionId: _versionId, tab: 'drink'}]);
	}

	public deleteDrinkVersion(_id,_versionId){
		this.drinkService.deleteDrinkVersion(_id, _versionId).subscribe(
			(data: any) => {
				alert("Versión de bebida eliminada");
				this.getDrinkVersions();
			},
			(err) => {
					alert("Error eliminando versión de bebida");
		});
	}

	public viewDrinkVersion(_id, _versionId){
	   this.router.navigate(['./recipes/drinks/',_id, {versionId: _versionId, tab: 'drink'}]);
	}

	public pageHasChanged(data) {
		this.itemsPerPage = data.itemsPerPage;
		this.currentPage = data.page;
		this.getDrinkVersions();
	}

	public updateItemsPerPage(item: number) {
		this.itemsPerPage = item;
		this.currentPage = 1;
		this.getDrinkVersions();
	}

	public searchDrinks(value: string){
		this.filterText=value;
		this.currentPage=1;
		this.getDrinkVersions();
		this.filterText='';
	}

	public sortColumn(e, column: string) {
		this.filterText = '';
		this.orderBy = e + 'lang.' + column;
	    ////console.log(this.orderBy);
	    this.getDrinkVersions();
	}
}
