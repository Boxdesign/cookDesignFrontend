import { Component, EventEmitter, Input, Output, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from "../products.service";
import { SubproductsService } from "../../subproducts/subproducts.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { MeasurementUnitService } from "../../../libraries/measurement-unit/measurement-unit.service";
import { AllergenService } from '../../../libraries/allergen/allergen.service'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { CompassService } from "../../../global-utils/services/compass.service";
import { Observable, Subject } from "rxjs/Rx";
import { NotificationsService } from 'angular2-notifications';
import { subproductComposition } from '../../../global-utils/models/subproductComposition.model';
import { ArticleService } from "../../../providers/articles/article.service";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'product-composition-edit',
  templateUrl: './product-composition-edit.component.html',
  styleUrls: ['./product-composition-edit.component.scss']
})
export class ProductCompositionEditComponent implements OnInit {
	@Input() public product;
	@ViewChild('selectElement') selectElement;	
	public productElementIndex;
	@Output() passRedirectOn = new EventEmitter();
	public productElementListSelector: Array<any> = [];
	public productElementsListPopulated: Boolean = false;
	public filterText: string = '';
	public productElementsList;
	public measurementUnits;
	// public productMeasUnitShortName;
	public searchBoxLabel: string;
	public conversionTable;
	public elementMeasUnits = [];
	public totalGrossWeight;
	public totalNetWeight;
	public totalElements=0;
	public equivalenceUnitSelected=false;
	public equivalenceQty: any;
	public allergens;
	public salesTax;
	public id;
	public versionId;	
	public activeElement = [];
	public numPages:number;
	public filterLocations;

	elementSubject: Subject<any> = new Subject();
 	public previousSearch: string = null;
 	public clone = require('clone');
 	public status;
 	public mode;

	public productElement = new subproductComposition();
	public loading : boolean = false;
	public productCategories;
	public articleProviders;
	public observerLocation;

	constructor(
		public articleService: ArticleService, 
		public router: Router, 
		public productService: ProductsService,
		public mUnitsService: MeasurementUnitService, 
		public translate: TranslateService, 
		public allergensService: AllergenService, 
		public appConfig:AppConfig,
		public compassService: CompassService,
		public subproductService: SubproductsService,
		public route: ActivatedRoute, 
		public notification: NotificationsService,
		public costFilterService: CostFilterService
	) { }

	ngOnInit(){
		this.loading = true;
		this.productCategories = [{label: 'Ingrediente', value: 'ingredient'}, {label: 'Subproductos', value: 'subproduct'}];

    this.appConfig.getSalesTax().subscribe((salesTax: any) => {
      this.salesTax=salesTax;
    });

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
    	this.searchBoxLabel = res;
  	});

  	this.route.data.subscribe((data: {mode:string}) => {
      if(data.mode) this.mode = data.mode;
    });

  	this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId'];});

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
    }) 

		// if(!this.filterLocations)  { 
		// 	this.filterLocations = [];
		// } else {
		// 	if(this.filterLocations&&this.filterLocations.length) this.filterLocations = JSON.parse(this.filterLocations)
		// }
	
  	this.elementSubject
		.debounceTime(300)
		.subscribe((searchString) => {

			this.selectElement.items = []

			if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
				// string was deleted so assign empty array to ng-select items
				// force the ng-select to update and show the new list
				this.selectElement.open()
				this.previousSearch = ''
			
			} else {
				this.previousSearch = searchString;
				if (this.productElement.element.kind == 'ingredient') {
					this.productService.getIngredientsFilter(searchString, this.product.location).subscribe(
					(data:any) => {
						//console.log(data,'data')
						this.productElementsList = data;
						this.productElementsList.length = data.length;
						if(this.productElementsList.length == 0){
							let object = [{
	                  id: 1,
	                  text: 'No results'
	                }]

              	this.selectElement.items = object;
	              this.selectElement.open();

						} else {

							let elementData = this.productElementsList.map((element, index) => { 
								let object = {
									id: index+1,
									text: element.name
								}
								return object;
							});

							this.selectElement.items = elementData;
							this.selectElement.open();
					}
					},
					(err) => {
						this.notification.error('Error', err || 'Error');
					});
				}else if (this.productElement.element.kind == 'subproduct') {

					this.productService.getSubproductsFilter(searchString, this.product.location).subscribe(
					(data:any) => {
						console.log(data,'data')
						this.productElementsList = data;
						this.productElementsList.length = data.length;
						if(this.productElementsList.length == 0){
							let object = [{
	                  id: 1,
	                  text: 'No results'
	                }]

              	this.selectElement.items = object;
	              this.selectElement.open();

						} else {

							let elementData = this.productElementsList.map((element, index) => { 
								let object = {
									id: index+1,
									text: element.name
								}
								return object;
							});

							this.selectElement.items = elementData;
							this.selectElement.open();
					}
					},
					(err) => {
						this.notification.error('Error', err || 'Error');
					});
				}
			}
		});
    
		//this.getConversionTable();
		//this.getMeasuringUnits();
		this.getProductElements();
		this.getAllergens();
		this.totalElements = this.product.composition.length;
	}

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }	

	getArticles(ingredient) {  	//Gets ingredient's provider articles...
		this.articleProviders = [];
    this.articleService.articlesByProvider(ingredient, this.product.location).subscribe(
      (data: any) => {
	      this.articleProviders = data;        	
        
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    );
  }


	public onChangeCategory(e){
	this.articleProviders = [];
	this.productElementsList = [];
	this.selectElement.items = []
	this.activeElement=[];
	this.elementMeasUnits=[];

	if(e.value=='ingredient'){
		this.productElement.element.kind = 'ingredient';
	} else if(e.value=='subproduct'){
		this.productElement.element.kind = 'subproduct';
	}
}


	public getProductElements() {

			//Get conversion table
			this.mUnitsService.getConversionTable().subscribe(
				(data: any)=> {
					this.conversionTable = data;

				//If productOnEdit contains elements, update fields:
				// - measuringUnitShortName, baseUnit, baseUnitShortName such as name, unitCost, baseunit
				if (this.totalElements>0) this.updateFieldsInit();
				else this.loading = false;
			},
			(err) => {
				this.notification.error('Error', err || 'Error');
			})
	}

	public updateFieldsInit(){
		//Update each element in productOnEdit with updated fields: unitCost, name, etc...


		//Calculate costs
		this.calculateCosts();

  		//Recalculate values
  		this.calculateTotals();
  	}

	public getConversionTable(){
	/*{[
    "baseUnit" : id base unit,
    "conversions" : [{
        "convUnit" : id conversion unit,
        "quantity" : conversion_amount
    		}}
    		]}*/
    		this.mUnitsService.getConversionTable().subscribe(
    			(data: any)=> {
    				this.conversionTable = data;
				//console.log('conversionTable')
				//console.log(this.conversionTable)
			},
			(err) => {
				this.notification.error('Error', err || 'Error');
			})
    	}


	public productElementSelected(value){ //called when user selects an ingredient or product

			if (value.text != "No results") {

				this.getArticles(this.productElementsList[value.id-1]._id);				
				
				this.productElement.element.kind = this.productElementsList[value.id-1].type;
				this.productElement.element.item = this.productElementsList[value.id-1]._id;
				this.productElement.allergens = this.productElementsList[value.id-1].allergens;
				//Need this for the table but will have to remove them later before saving
				this.productElement.name = this.productElementsList[value.id-1].name;
				this.productElement.unitCost = this.productElementsList[value.id-1].cost;

				//console.log(this.productElementsList[index]);
				this.equivalenceUnitSelected=false;

				this.elementMeasUnits=[];
				this.getNewElementMeasUnits(this.productElementsList[value.id-1], (doc) => {
				
					this.productElement.baseUnit = this.elementMeasUnits[0]._id;
					this.productElement.baseUnitShortName = this.elementMeasUnits[0].shortName
					this.productElement.measuringUnit = this.elementMeasUnits[0]._id;
					this.productElement.measuringUnitShortName = this.elementMeasUnits[0].shortName
				
				});
			}					
	}

	public elementSearchChanged(value) {
    this.elementSubject.next(value);
    this.articleProviders = [];  	
  }

  public productElementRemoved(value){ //called when user removes ingredient or subproduct
		this.productElement.element.item = null;
		this.articleProviders = [];
		this.elementMeasUnits=[];
		
	}

	public getNewElementMeasUnits(newElement,cb){
	/*Based on the element's (ingredient or dish) base measuring unit, retrieves all the measuring unit conversions and it it exists adds
	the equivalence unit conversion (just in the case of ingredients)
	newElementObj = {[
		"name" : '',
		"equivalenceUnit"; {},
		"measurementUnit": {},
		"type"='',
		"cost": 0,
		"_id": id
	]}*/
		this.elementMeasUnits=[];

		//Get the element's measuring unit, conversions and equivalence unit. Put it all in the array elementMeasUnits.
		this.conversionTable.find((x) => {
			if(x.baseUnit._id == newElement.measurementUnit._id) {
				let baseUnitObj = {
					"name" : x.baseUnit.lang[0].name,
					"shortName" : x.baseUnit.lang[0].shortName,
					"_id" : x.baseUnit._id
				}
				this.elementMeasUnits.push(baseUnitObj);
				x.conversions.find((c) => {
					let convObj = {
						"name" : c.convUnit.lang[0].name,
						"shortName" : c.convUnit.lang[0].shortName,
						"_id" : c.convUnit._id
					}
					this.elementMeasUnits.push(convObj);
				})
			}
		})

	

		//If the ingredient has an equivalence unit, add it to the list of measuring units
		if(newElement.type=='ingredient'&&newElement.equivalenceUnit){
			let equivObj = {
				"name" : newElement.equivalenceUnit.name,
				"shortName" : this.elementMeasUnits[0].shortName, //baseunit short name
				"_id" : null
			}
			this.elementMeasUnits.push(equivObj);
		}

		cb(this.elementMeasUnits)

	}

	public getEditedElementMeasUnits(compositionElement,cb){
		/*Based on the element's (ingredient or dish) base measuring unit, retrieves all the measuring unit conversions and it it exists adds
	the equivalence unit conversion (just in the case of ingredients)
	compositionElement = new Composition()	use two function because when add newElement, we catch measurementUnit of drinkElementsList obj and when edit, we use composition Model to edit compositionElement
	*/
		this.elementMeasUnits=[];
		//console.log(this.conversionTable,'conversionTable')
			//console.log(element.measuringUnit,'MEASURING UNIT')
			//Get the element's measuring unit, conversions and equivalence unit. Put it all in the array elementMeasUnits.
  		this.conversionTable.find((x) => {
  			if(x.baseUnit._id == compositionElement.baseUnit) {
  				//console.log('baseUnit._id',x.baseUnit._id,'==',element.measuringUnit,'element.measuringUnit')
  				let baseUnitObj = {
  					"name" : x.baseUnit.lang[0].name,
  					"shortName" : x.baseUnit.lang[0].shortName,
  					"_id" : x.baseUnit._id
  				}
  				this.elementMeasUnits.push(baseUnitObj);
  				x.conversions.find((c) => {

  					let convObj = {
  						"name" : c.convUnit.lang[0].name,
  						"shortName" : c.convUnit.lang[0].shortName,
  						"_id" : c.convUnit._id
  					}
  					this.elementMeasUnits.push(convObj);
  				})

  			} 
  		})

		//If the ingredient has an equivalence unit, add it to the list of measuring units
		if(compositionElement.element.kind=='ingredient'&&compositionElement.equivalenceUnit.quantity){
			let equivObj = {
				"name" : compositionElement.equivalenceUnit.name,
				"shortName" : "", //baseunit short name
				"_id" : null
			}
			this.elementMeasUnits.push(equivObj);
		}
			//console.log(this.elementMeasUnits,'elementMeasUnitCB')
  		cb(this.elementMeasUnits)
	}

	public saveProductElement(){

		if(this.status=='new'){

				if (this.productElement.measuringUnit == null) {
		  			this.productElement.grossWeight=this.productElement.quantity*this.productElement.equivalenceUnit.quantity;
		  		}

		  		this.product.composition.push(this.productElement);
		  		this.totalElements = this.product.composition.length;

		 		//Calculate costs
		  		this.calculateCosts();

		  		//Recalculate values
		  		this.calculateTotals();

		  		 //Compute allergens
		  		this.computeAllergens();

		  		//Replace selectedCategoryOptions array with a new one so that the array reference changes and it is detected by the pipe compositionFilter 
		      	// let array=[]; 
		      	// array=this.selectedCategoryOptions.map(x => { return x; }); 
		      	// this.selectedCategoryOptions=array;	

		  		this.cleanAndResetFields();
		  		
		} else if (this.status == 'edit') {

					if (this.productElement.measuringUnit == null) {
		  			this.productElement.grossWeight=this.productElement.quantity*this.productElement.equivalenceUnit.quantity;
		  		}

		  		//replace object in position productElementOnEditIndex
		  		this.product.composition.splice(this.productElementIndex,1,this.productElement);

		  		//Calculate costs
		  		this.calculateCosts();

			  	//Recalculate values
			  	this.calculateTotals();

			  	//Compute allergens
		  		this.computeAllergens();

			  	//Replace selectedCategoryOptions array with a new one so that the array reference changes and it is detected by the pipe compositionFilter 
		      	// let array=[]; 
		      	// array=this.selectedCategoryOptions.map(x => { return x; }); 
		      	// this.selectedCategoryOptions=array;	

			  	this.cleanAndResetFields();
		}
	}

	public selectElementToDelete(compositionElement, index){

		//Save index position for deleting later
		//this.productElementIndex = this.product.composition.findIndex(el => el._id === compositionElement._id); 
		this.productElementIndex = this.product.composition.indexOf(compositionElement);
	}

	public deleteProductElement(index) {
	  	this.product.composition.splice(this.productElementIndex,1);

	  	this.totalElements = this.product.composition.length;

	  	//Compute allergens
  		this.computeAllergens();

	  	if(this.totalElements>0)
	  	{
	 		//Calculate costs
	 		this.calculateCosts();

	  		//Recalculate values
	  		this.calculateTotals();

	  		this.cleanAndResetFields();
	  	} else {
	  		this.product.compositionCost=0;
	  	}
	  }

	public calculateTotals(){
	  	this.totalGrossWeight=0;
	  	this.totalNetWeight=0;
	  	this.product.compositionCost=0;
	  	this.product.composition.forEach((element) => {
	  		this.totalGrossWeight+=element.grossWeight;
        this.totalNetWeight+=element.netWeight;
	  		this.product.compositionCost+=element.calculatedCost;
	  	})
	  	this.product.totalGrossWeight=this.totalGrossWeight;
  		this.loading = false;
	}


	 public calculateCosts(){
  		//Calculate costs of all elements using conversion table
  		this.product.composition.forEach((element) => {
  			if(element.measuringUnit==null) { //measuring unit is an equivalence unit. Gross weight is already expressed in base unit.

  				element.grossWeight = element.equivalenceUnit.quantity * element.quantity;
  				element.calculatedCost = element.grossWeight * element.unitCost;
  				element.netWeight = element.grossWeight*(1-(element.wastePercentage/100));

  			} else {
		  			if(element.measuringUnit != element.baseUnit) { //measuring unit is different than base unit, so we need conversion factor
		  				//Find conversion quantity in convertion table. Start by finding base unit...
		  				//console.log('conversion table')
			  			//console.log(this.conversionTable)
			  			this.conversionTable.forEach((x) => {
			  				if(x.baseUnit._id == element.baseUnit) {
			  					//Now find the conversion quantity in conversions object
			  					//console.log('conversions array')
			  					//console.log(x.conversions)
			  					x.conversions.forEach((c) => {
			  						if(c.convUnit._id == element.measuringUnit) {
			  							let conversionQty = c.quantity;
			  							element.calculatedCost = element.grossWeight * conversionQty * element.unitCost;
			  							element.netWeight = element.grossWeight*(1-(element.wastePercentage/100)) * conversionQty;
			  						}
			  					})
			  				}
			  			})
		  			} else { //Measuring unit is equal to base unit, so there's no need for conversion
		  			element.calculatedCost = element.grossWeight * element.unitCost;
		  			element.netWeight = element.grossWeight*(1-(element.wastePercentage/100));
		  		}
	  		}
	  })


  	}

  	public computeAllergens(){ //merge allergen data from subproduct composition elements
  		let updatedAllergens=[];
  		let aggregateAllergens=[];
  		if (this.totalElements>0) { //check whether there are composition elements
	  		this.product.composition.forEach((element) => { //go over all subproduct composition elements
	  			if(element.allergens&&element.allergens.length>0) { //check whether there are allergens in the element
		  			element.allergens.forEach((elementAllergenObj) => {  //go over allergens of each element
		  				//element.allergens object =
		  				//{
		  				//	allergen: ObjectId,
		  				//  level: number
		  				//}
		  				if (updatedAllergens.length>0) { //If the updated allergen list is empty, just add the allergen otherwise check whether it exist and its level
			  				let match: boolean= false;
			  				updatedAllergens.forEach((allergenObj) => {
			  					if (elementAllergenObj.allergen == allergenObj.allergen) {
			  						//console.log('match is true')
			  						match=true;
			  						if(elementAllergenObj.level > allergenObj.level) {
			  							//Level is higher therefore update level
			  							allergenObj.level = elementAllergenObj.level;
			  						}
			  					}
			  				})
			  				if (!match) {
			  					let allObj={
				  					allergen: elementAllergenObj.allergen,
				  					level: elementAllergenObj.level
			  					}		
			  					updatedAllergens.push(allObj); //allergen is not in the list of allergens, add it.	
			  				}						
			  			} else {
			  				let allObj={
			  					allergen: elementAllergenObj.allergen,
			  					level: elementAllergenObj.level
			  				} 
			  				updatedAllergens.push(allObj)
			  			}
		  			})
		  		}
	  		})
	  	}
	  	//Update allergen objects in updatedAllergens array so that it includes image, etc.
	  	updatedAllergens.forEach((updatedAllergen, index)=>{
	  		let level=updatedAllergen.level;
	  		this.allergens.forEach((allergen)=>{
	  			if(allergen._id==updatedAllergen.allergen) {
	  				allergen.level=level;
	  				aggregateAllergens.push(allergen)
	  			}
	  		})
	  	})
  		this.product.allergens=aggregateAllergens;
  		this.product.allergensInitialized=true; //Flag used as ngIf in allergen-view component in main-edit
  	}

	public cleanAndResetFields(){
		var ProductIndex;
		this.selectElement.items = []
		//Force ng2-select selection to reset
		this.activeElement = [{id: -1, text:''}]; //bogus active element
		this.activeElement = [];
    this.elementMeasUnits=[];
		this.equivalenceUnitSelected=false;
	}

	public selectElementToEdit(compositionElement, index){

		if (compositionElement.element.item) {
			this.getArticles(compositionElement.element.item);			
		}
		var subElementsIndex;

  		//We can't use this.productElementOnEdit=compositionElement because it is doing a deep copy. This means that
  		//when updating this.productElementOnEdit we are actually updating this.productOnEdit. As a result, when
  		//the user updates values in the edit form before pressing 'save', it is already updating productOnEdit which
  		//is not what we want.
  		//Instead we use Object.assign which makes a copy but does not do deep linking.
  		this.productElement = this.clone(compositionElement);

  		//console.log(this.productElementOnEdit)
  		//Save index position for editing later
  		//this.productElementIndex = this.product.composition.findIndex(el => el._id === compositionElement._id);
  		
  		this.productElementIndex = this.product.composition.indexOf(compositionElement);
  		//Get value for activeElement of productsElementsList
  		
  		this.activeElement = [];
  			let object = {
  				id: this.productElement.element.item,
  				text: this.productElement.name
  			}
  			this.activeElement.push(object)

  		//Get measuring units for selected element
  		//reset array
  		this.elementMeasUnits=[];

  		this.getEditedElementMeasUnits(this.productElement, (doc) => {

  			// this.productElement.baseUnit = this.elementMeasUnits[0]._id;
  			// this.productElement.baseUnitShortName = this.elementMeasUnits[0].shortName

  			var muIndex;
				//get index for elementMeasUnits array
				this.elementMeasUnits.find((h, i) => {
					if(h._id == this.productElement.measuringUnit) {
						muIndex = i;
						return true;
					}
				})

				this.productElement.measuringUnit = this.elementMeasUnits[muIndex]._id;
				this.productElement.measuringUnitShortName = this.elementMeasUnits[muIndex].shortName
		});

		if(this.productElement.measuringUnit==null) {
			this.equivalenceUnitSelected=true;
	  	}
  	}

  	public productMeasUnitSelected(index, add){

  		if(!add) //edit mode
  		{
  			this.productElement.measuringUnit = this.elementMeasUnits[index]._id;
  			this.productElement.measuringUnitShortName = this.elementMeasUnits[index].shortName;
  			if(this.productElement.measuringUnit==null){
  				this.equivalenceUnitSelected=true;
				//Obtain equivalence quantity stored in productElementsList
				this.productElementsList.find((sp) => {
					if(sp._id == this.productElement.element.item) {
						//console.log(sp)
						this.productElement.equivalenceUnit.quantity=sp.equivalenceUnit.quantity;
						this.productElement.equivalenceUnit.name=sp.equivalenceUnit.name;
						return;
					}
				})
			} else {
				this.equivalenceUnitSelected=false;
			}

		} else { //add mode
			this.productElement.measuringUnit=this.elementMeasUnits[index]._id;
			this.productElement.measuringUnitShortName = this.elementMeasUnits[index].shortName;
			if(this.productElement.measuringUnit==null) {
				this.equivalenceUnitSelected=true;
	  			//Obtain equivalence quantity stored in productElementsList
	  			this.productElementsList.find((sp) => {
	  				if(sp._id == this.productElement.element.item) {
	  					this.productElement.equivalenceUnit.quantity=sp.equivalenceUnit.quantity;
							this.productElement.equivalenceUnit.name=sp.equivalenceUnit.name;
	  					return;
	  				}
	  			})
	  		} else {
	  			this.equivalenceUnitSelected=false;
	  		}
	  	}
	  }

    public viewIngredient(composition,tab){
    	 //Pass No delete redirect data to the parent component
    	this.passRedirectOn.emit(true);

    	let mode;
      let _id=composition.element.item


    	//Save redirect data
    	if(this.mode == 'view') mode = 'view'; else mode = 'edit';
		
		this.compassService.saveRedirectData('recipes/products',this.id, this.versionId, mode)
		this.router.navigate(['./articles/ingredients/',_id, {tab: 'Ingredient'}]);
   
    }

    public viewSubproductVersion(composition){

    	 //Pass No delete redirect data to the parent component
    	this.passRedirectOn.emit(true);

      let mode;
      let _id=composition.element.item

      this.subproductService.getActiveVersion(_id).subscribe(
            (data: any)=> {

            let _versionId=data[0].versions._id
            
            //Save redirect data
        	if(this.mode == 'view') mode = 'view'; else mode = 'edit';

            this.compassService.saveRedirectData('recipes/products',this.id, this.versionId, mode)
            this.router.navigate(['./recipes/subproducts/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'subproduct'}]);

            })
    }

    public getAllergens() {
		this.allergensService.getAllergens(10000,0,'','').subscribe(
		  (data: any) => {
		    this.allergens = data.allergens;
		    this.computeAllergens();
		  })
  	}
	public locationArea(){
		this.product.composition.forEach((comp)=>{
			let result=this.productElementsList.some((prodElement)=>{
				//console.log(prodElement,'sub')
				return	prodElement._id==comp.element.item;
			})
			//console.log(result,'result')
			//console.log(comp,'comp')
			if (result==false){
				comp.location_unavailable=true;
				//console.log(comp.location_unavailable,'locationUN')
			}else{
				comp.location_unavailable=false;
			}
		})
	}
	
	public searchProducts(filterText){
		this.filterText = filterText;
	}

	public addClick() {
		this.productElement = new subproductComposition();
    this.status='new';
    this.productElement.element.kind = 'ingredient';
    this.cleanAndResetFields();
    this.articleProviders = [];
  }

  public viewClick(){
    this.status='view';
  }

  public editClick(){
    this.status='edit';
  }

}
