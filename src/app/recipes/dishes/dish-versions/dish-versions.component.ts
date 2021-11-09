 import {Input, Output, Component, ViewContainerRef, EventEmitter, ViewChild} from '@angular/core';
 import {AppConfig} from "../../../global-utils/services/appConfig.service";
 import {DishService} from "../dish.service";
 import {ActivatedRoute, Router} from '@angular/router';
 import {FamilyService} from "../../../libraries/family/family.service";
 import {TranslateService} from 'ng2-translate/ng2-translate';
 import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
 import { CostFilterService } from "../../../global-utils/services/cost-filter.service";



 @Component({
 	selector: 'dish-versions',
 	templateUrl: './dish-versions.template.html',
 })
 export class DishVersionsComponent {
 	@ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
 	public id;
 	public totalItems: number;
	public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
	public itemsPerPage: number = 10; //Default items per page
	public orderBy: string = '';
	public filterText: string = '';
	public searchBoxLabel: string;
	public dishVersions;
	public families;
	public numPages:number;
  public filterLocations = [];
  public observerLocation;
  public costFilterSet=false;
  public savedLocations;


	constructor(public route: ActivatedRoute, public costFilterService: CostFilterService, public translate: TranslateService, public dishService: DishService,  public router: Router, public familyService: FamilyService) {
		route.params.subscribe(params => {this.id=params['id']});

		this.translate.get('searchBox.beginText').subscribe((res: string) => {
			this.searchBoxLabel = res;
		  	////console.log('translation: '+ res);
		});
	}	

	ngOnInit(){
		this.getDishVersions();
		this.filterLocations =this.dishService.getLocationFilter();


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
        this.getDishVersions();
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

	public getDishVersions(){
		this.dishService.getDishVersions(this.id, this.itemsPerPage, this.currentPage-1, this.orderBy, this.filterText, this.filterLocations).subscribe(
			(data: any) => {
				this.dishVersions=data.versions;
				this.totalItems = data.totalElements;
				console.log(this.dishVersions, 'dishVersions');
			});
	}

	public changeToActive(_id,_versionId){
		this.dishService.setAsActiveVersion(_id, _versionId).subscribe(
			(data: any) => {
				alert("Versión de plato activada");
				this.getDishVersions();
			},
			(err) => {
					alert("Error activando versión de plato");
		});
	}

	public editDishVersion(_id,_versionId){
		this.router.navigate(['./recipes/dishes/edit', _id, {versionId: _versionId, tab: 'dish'}]);
	}

	public deleteDishVersion(_id,_versionId){
		this.dishService.deleteDishVersion(_id, _versionId).subscribe(
			(data: any) => {
				alert("Versión de plato eliminada");
				this.getDishVersions();
			},
			(err) => {
					alert("Error eliminando versión de plato");
		});
	}

	public viewDishVersion(_id, _versionId){
	   this.router.navigate(['./recipes/dishes/',_id, {versionId: _versionId, tab: 'dish'}]);
	}

	public pageHasChanged(data) {
		this.itemsPerPage = data.itemsPerPage;
		this.currentPage = data.page;
		this.getDishVersions();
	}

	public updateItemsPerPage(item: number) {
		this.itemsPerPage = item;
		this.currentPage = 1;
		this.getDishVersions();
	}

	public searchDishes(value: string){
		this.filterText=value;
		this.currentPage=1;
		this.getDishVersions();
		this.filterText='';
	}

	public sortColumn(e, column: string) {
		this.filterText = '';
		this.orderBy = e + 'lang.' + column;
	    ////console.log(this.orderBy);
	    this.getDishVersions();
	}
}



