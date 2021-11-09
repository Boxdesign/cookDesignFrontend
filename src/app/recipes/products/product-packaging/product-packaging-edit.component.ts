import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { PackagingsService } from '../../../articles/packagings/packagings.service'
import { ActivatedRoute,Router } from '@angular/router';
import { CompassService } from "../../../global-utils/services/compass.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'product-packaging-edit',
  templateUrl: './product-packaging-edit.component.html',
  styleUrls: ['./product-packaging-edit.component.scss']
})
export class ProductPackagingEditComponent implements OnInit {
	@Input() public product;
	@Output() passRedirectOn = new EventEmitter();

	public productPackagingOnEdit;
	public productPackagingOnEditIndex;
	public filterText: string = '';
	public measurementUnits;
	// public subproductMeasUnitShortName;
	public searchBoxLabel: string;
	public totalPackagings=0;
	public allPackagings;
	public totalFormatCost;
	public mode
	public filterLocations = [];
	public id;
	public versionId;	
	public observerLocation;
	public productPackaging = {
		packaging: null,
		numItems: 0,
		unitCost: 0,
		totalCost: 0,
		costPercentage: 0,
		name: '',
		measuringUnitShortName: ''
	}

  constructor(
  	public packagingsService: PackagingsService,
  	public compassService: CompassService,
  	public router: Router, 
  	public translate: TranslateService, 
  	public route: ActivatedRoute,
		public costFilterService: CostFilterService
  ) { 

	    this.translate.get('searchBox.beginText').subscribe((res: string) => {
	    	this.searchBoxLabel = res;
	  	    ////console.log('translation: '+ res);
	  	});
	  	route.data.subscribe((data: {mode:string}) => {
        if(data.mode) this.mode = data.mode;
      });
  }

  ngOnInit() {

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.getPackagings();
    }) 

		this.totalPackagings = this.product.packaging.length;
		this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId'];});

		////console.log(this.productOnEdit.packaging.length,'packaging')
		if (this.totalPackagings>0) {  	  		
	  		//Calculate costs
			  this.calculateCosts();

			  //Recalculate values
			  this.calculateTotals();
	  	}

 		this.getPackagings();
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public getPackagings(){
    this.packagingsService.getPackagings(100000, 0, '','',1, this.product.location, true).subscribe(
      (data:any) => {
        this.allPackagings = data.packagings;
        ////console.log(this.allPackagings,'alledit')
        //Set initial value for add
        if(this.allPackagings.length>0) {
	        this.productPackaging.packaging=this.allPackagings[0]._id;
	        this.productPackaging.unitCost = this.allPackagings[0].referencePrice;
	        this.productPackaging.name = this.allPackagings[0].lang.name;
	        this.productPackaging.measuringUnitShortName = this.allPackagings[0].measurementUnit.lang[0].shortName;
	     }
      },
      (error) => {
        alert('Server Error');
      })
  }

  public addPackaging() {
  	  this.product.packaging.push(this.productPackaging);
  	  this.totalPackagings = this.product.packaging.length;

  	  //Calculate costs
	  this.calculateCosts();

	  //Recalculate totals
	  this.calculateTotals();

     this.cleanAndResetFields();
  }

  public calculateCosts(){
   	this.product.packaging.forEach( (productPackage) => {
   		productPackage.totalCost = productPackage.unitCost * productPackage.numItems;
   	})
   }

   public calculateTotals(){
   	this.product.packagingCost = 0;
   	this.product.packaging.forEach( (productPackage) => {
   		this.product.packagingCost+=productPackage.totalCost;
   	})
   }

  public editPackaging() {
  		//replace object in position productPackagingsOnEditIndex
  		this.product.packaging.splice(this.productPackagingOnEditIndex,1,this.productPackagingOnEdit);

  		//Calculate costs
	 	this.calculateCosts();

	  	//Recalculate values
	  	this.calculateTotals();
  }

  public deletePackaging(index) {
  		this.product.packaging.splice(index,1);
  		this.totalPackagings = this.product.packaging.length;

  		if(this.totalPackagings>0)
	  	{
	 		//Calculate costs
	 		this.calculateCosts();

	  		//Recalculate values
	  		this.calculateTotals();
	  	} else {
	  		//Array of packagings is empty, set packaging cost to null
	  		this.product.packagingCost = 0;
	  	}
  }

  public selectProductPackagingToEdit(packaging, index) {
  		this.productPackagingOnEdit = Object.assign({}, packaging);
  		this.productPackagingOnEditIndex = index;
  }

  public packagingSelected(index, add) {

	  	if(add) {
	  		this.productPackaging.packaging = this.allPackagings[index]._id;
	  		this.productPackaging.unitCost = this.allPackagings[index].referencePrice;
	  		this.productPackaging.name = this.allPackagings[index].lang.name;
	  		this.productPackaging.measuringUnitShortName = this.allPackagings[index].measurementUnit.lang[0].shortName;

	  	} else {
	  		this.productPackagingOnEdit.packaging = this.allPackagings[index]._id;
	  		this.productPackagingOnEdit.unitCost = this.allPackagings[index].referencePrice;
	  		this.productPackagingOnEdit.name = this.allPackagings[index].lang.name;
	  		this.productPackagingOnEdit.measuringUnitShortName = this.allPackagings[index].measurementUnit.lang[0].shortName;
	  	}
  }

   public cleanAndResetFields(){
   	this.productPackaging = {
			packaging: this.allPackagings[0]._id,
			numItems: 0,
			unitCost: this.allPackagings[0].referencePrice,
			totalCost: 0,
			costPercentage: 0,
			name: this.allPackagings[0].lang.name,
			measuringUnitShortName: this.allPackagings[0].measurementUnit.lang[0].shortName	
		}
   }

   // public viewPackaging(index){
   //  	this.router.navigate(['./articles/packagings/',this.allPackagings[index]._id ]);
   // }


   public viewPackaging(packaging,tab){
    	 //Pass No delete redirect data to the parent component
    	this.passRedirectOn.emit(true);

    	let mode;
    	//Save redirect data
    	if(this.mode == 'view') mode = 'view'; else mode = 'edit';
		
		this.compassService.saveRedirectData('recipes/products',this.id, this.versionId, mode)
		this.router.navigate(['./articles/packagings/',packaging.packaging]);
   
    }

   public searchProducts(event){}
}
