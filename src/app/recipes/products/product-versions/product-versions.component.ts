import {Input, Output, Component, ViewContainerRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {AppConfig} from "../../../global-utils/services/appConfig.service";
import {ProductsService} from "../products.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FamilyService} from "../../../libraries/family/family.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'product-versions',
  templateUrl: './product-versions.component.html',
  styleUrls: ['./product-versions.component.scss']
})
export class ProductVersionsComponent implements OnInit {
		@ViewChild(LocationFilterComponent)
  	public locationComponent: LocationFilterComponent;
  	public id;
 		public totalItems: number;
  	public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  	public itemsPerPage: number = 10; //Default items per page
  	public orderBy: string = '';
  	public filterText: string = '';
  	public searchBoxLabel: string;
  	public productVersions;
  	public families;
  	public numPages:number;
  	public filterLocations = [];
	  public observerLocation;
	  public costFilterSet=false;
	  public savedLocations;

	constructor(public route: ActivatedRoute, public costFilterService: CostFilterService, public translate: TranslateService, public productsService: ProductsService,  public router: Router, public familyService: FamilyService) {
		route.params.subscribe(params => {this.id=params['id']});
		this.translate.get('searchBox.beginText').subscribe((res: string) => {
			this.searchBoxLabel = res;
		  	////console.log('translation: '+ res);
		});
	}	

	ngOnInit(){
		this.getProductVersions();

		this.filterLocations =this.productsService.getLocationFilter();


		this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;        
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data);  
        this.currentPage = this.productsService.getCurrentPage();
        this.itemsPerPage = this.productsService.getItemsPerPage();
        this.filterText = this.productsService.getSearchFilter();         
        this.getProductVersions();
    })
	}

	public getFamilies() {
		this.familyService.getFamily('recipe', 10000, 0, '','').subscribe(
			(data: any) => {
				this.families = data.families;
			},
			(err) => {
				alert("Server Error");
			})
	}

	public getProductVersions(){
		this.productsService.getProductVersions(this.id, this.itemsPerPage, this.currentPage-1, this.orderBy, this.filterText, this.filterLocations).subscribe(
			(data: any) => {
				this.productVersions=data.versions;
				this.totalItems = data.totalElements;
				//console.log(this.productVersions); 
			});
	}

	public changeToActive(_id,_versionId){
		this.productsService.setAsActiveVersion(_id, _versionId).subscribe(
			(data: any) => {
				alert("Versión de producto activada");
				this.getProductVersions();
			},
			(err) => {
					alert("Error activando versión de producto");
		});
	}

	public editProductVersion(_id,_versionId){
		this.router.navigate(['./recipes/products/edit', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'product'}]);
	}

	public deleteProductVersion(_id,_versionId){
		this.productsService.deleteProductVersion(_id, _versionId).subscribe(
			(data: any) => {
				alert("Versión de producto eliminada");
				this.getProductVersions();
			},
			(err) => {
					alert("Error eliminando versión de producto");
		});
	}

	public viewProductVersion(_id, _versionId){
	   this.router.navigate(['./recipes/products/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'product'}]);
	}

	public pageHasChanged(data) {
		this.itemsPerPage = data.itemsPerPage;
		this.currentPage = data.page;
		this.getProductVersions();
	}

	public updateItemsPerPage(item: number) {
		this.itemsPerPage = item;
		this.currentPage = 1;
		this.getProductVersions();
	}

	public searchProducts(value: string){
		this.filterText=value;
		this.currentPage=1;
		this.getProductVersions();
		this.filterText='';
	}

	public sortColumn(e, column: string) {
		this.filterText = '';
		this.orderBy = e + 'lang.' + column;
	    ////console.log(this.orderBy);
	    this.getProductVersions();
	}

}
