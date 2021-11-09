import { Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrinkService } from "../drink.service";
import { SubproductsService } from "../../subproducts/subproducts.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { MeasurementUnitService } from "../../../libraries/measurement-unit/measurement-unit.service";
import { AllergenService } from '../../../libraries/allergen/allergen.service'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { Composition } from '../../../global-utils/models/composition.model';
import { CompassService } from "../../../global-utils/services/compass.service";
import { Observable, Subject } from "rxjs/Rx";
import { NotificationsService } from 'angular2-notifications';
import { ArticleService } from "../../../providers/articles/article.service";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

enum DrinkCategories { mainProduct, dressing, sauce, addition };	

@Component({
	selector: 'drink-composition',
	templateUrl: './drink-composition.component.html',
})
export class DrinkCompositionComponent {
	@Input() public drink;
	@ViewChild('selectElement') selectElement;
	@Output() passRedirectOn = new EventEmitter();
	public drinkElementOnEdit;
	public drinkElementIndex;
	public drinkElementListSelector: Array<any> = [];
	public drinkElementsListPopulated: Boolean = false;
	public filterText: string = '';
	public drinkElementsList;
	public measurementUnits;
	// public dishMeasUnitShortName;
	public searchBoxLabel: string;
	public conversionTable;
	public elementMeasUnits = [];
	public totalGrossWeight;
	public totalNetWeight;
	public totalElements=0;
	public equivalenceUnitSelected=false;
	public equivalenceQty: any;
	public mainProductExpanded:boolean=true;
	public sauceExpanded:boolean=true;
	public dressingExpanded:boolean=true;
	public additionExpanded:boolean=true;
	public selectedCategoryOptions: number[];
	public categoryOptions: any[] = [];
	public allergens;
	public salesTax;
	public viewMode: boolean=false;
	public id;
	public versionId;
	public activeElement = [];
	public mode;
	public status;
	public clone = require('clone');
	private	elementSubject: Subject<any> = new Subject();
	public previousSearch: string = null;
	public numPages:number;
	public filterLocations;
	public loading:boolean = false;
	public sortField: string;
	public sortOrder: number;
	public activeOrderBy: number = 0;
	public drinkCategories;
	public articleProviders;
	public observerLocation;

	//public composition = new Composition();

	public drinkElement = new Composition();

	constructor(
		public articleService: ArticleService, 
		public router: Router, 
		public drinkService: DrinkService,
		public mUnitsService: MeasurementUnitService, 
		public translate: TranslateService, 
		public allergensService: AllergenService, 
		public appConfig:AppConfig, 
		public route: ActivatedRoute,
		public subproductsService: SubproductsService, 
		public notification: NotificationsService, 
		public compassService: CompassService, 
		public costFilterService: CostFilterService
		) {}

	ngOnInit(){
		this.loading = true;
		this.drinkCategories = [{label: 'Ingrediente', value: 'ingredient'}, {label: 'Subproductos', value: 'subproduct'}];
		this.appConfig.getSalesTax().subscribe((salesTax: any) => {
			this.salesTax=salesTax;
		});

		this.translate.get('searchBox.beginText').subscribe((res: string) => {
			this.searchBoxLabel = res;
			//console.log('translation: '+ res);
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
	
		this.route.data.subscribe((data: {mode: string}) => {
			if(data.mode) this.mode = data.mode;
		});

		this.selectedCategoryOptions=[1,2,4]
		this.categoryOptions.push(
			{ active: true, name: 'recipes.drink.composition.categories.mainProduct', value: 1 },
			{ active: true, name: 'recipes.drink.composition.categories.dressing', value: 2  },
			{ active: true, name: 'recipes.drink.composition.categories.addition', value: 4  }
		);

		this.elementSubject
		.debounceTime(300)
		.subscribe((searchString) => {

			this.selectElement.items = []

			if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
				//console.log('empty string')
				// string was deleted so assign empty array to ng-select items
				// force the ng-select to update and show the new list
				this.selectElement.open()
				this.previousSearch = ''
			
			} else {

				this.previousSearch = searchString;
				if (this.drinkElement.element.kind == 'ingredient') {
					this.drinkService.getIngredientsFilter(searchString, this.drink.location).subscribe(
					(data:any) => {
						this.drinkElementsList = data;
						this.drinkElementsList.length = data.length;
						if(this.drinkElementsList.length == 0){
							let object = [{
	                  id: 1,
	                  text: 'No results'
	                }]

              	this.selectElement.items = object;
	              this.selectElement.open();

						} else {

						let elementData = this.drinkElementsList.map((element, index) => { 
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
				} else if (this.drinkElement.element.kind == 'subproduct') {
					this.drinkService.getSubproductsFilter(searchString, this.drink.location).subscribe(
					(data:any) => {
						this.drinkElementsList = data;
						this.drinkElementsList.length = data.length;
						if(this.drinkElementsList.length == 0){
							let object = [{
	                  id: 1,
	                  text: 'No results'
	                }]

              	this.selectElement.items = object;
	              this.selectElement.open();

						} else {

						let elementData = this.drinkElementsList.map((element, index) => { 
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
		this.getDrinkElements();
		this.getAllergens();
		this.totalElements = this.drink.composition.length;
	}

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }	

	public onChangeCategory(e){
	this.articleProviders = [];
	this.drinkElementsList = [];
	this.selectElement.items = []
	this.activeElement=[];
	this.elementMeasUnits=[];

	if(e.value=='ingredient'){
		this.drinkElement.element.kind = 'ingredient';
	} else if(e.value=='subproduct'){
		this.drinkElement.element.kind = 'subproduct';
	}
}

getArticles(ingredient) {  	//Gets ingredient's provider articles...
		this.articleProviders = [];
    this.articleService.articlesByProvider(ingredient, this.drink.location).subscribe(
      (data: any) => {
	      this.articleProviders = data;        	
        
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    );
  }

	public getDrinkElements() {
/*	Retrieves the list of ingredients and subproducts (in the user's zone) sorted by name
	drinkElement = {
        'type': 'ingredient',
        '_id': doc._id,
        'name': doc.lang.name,
        'cost' : doc.referencePrice,
        'measurementUnit': doc.measurementUnit,
        'equivalenceUnit' : { //if it's an ingredient and has an equivalence unit defined, it will be added to the object.
            'name' : doc.lang.equivalenceUnitName,
            'quantity' : doc.equivalenceQty
        }
      }*/

			//Get conversion table
  		this.mUnitsService.getConversionTable().subscribe(
  			(data: any)=> {
  				this.conversionTable = data;

  				//If dishOnEdit contains elements, update fields:
  				// - measuringUnitShortName, baseUnit, baseUnitShortName such as name, unitCost, baseunit
  				if (this.totalElements>0) this.updateFieldsInit();
					else this.loading = false;

  				},
  				(err) => {
  					this.notification.error('Error', err || 'Error');
  				})
    }

	public updateFieldsInit(){
		//Update each element in subproductOnEdit with updated fields: unitCost, name, etc...

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

	public drinkElementSelected(value){ //called when user selects an ingredient or subproduct
		if (value.text != "No results") {

				this.getArticles(this.drinkElementsList[value.id-1]._id);				
				
				this.drinkElement.element.kind = this.drinkElementsList[value.id-1].type;
				this.drinkElement.element.item = this.drinkElementsList[value.id-1]._id;
				this.drinkElement.name = this.drinkElementsList[value.id-1].name;
				this.drinkElement.allergens = this.drinkElementsList[value.id-1].allergens;
				this.drinkElement.unitCost = this.drinkElementsList[value.id-1].cost;

				//console.log(this.subproductElementsList[index]);
				this.equivalenceUnitSelected=false;

				this.elementMeasUnits=[];
				this.getNewElementMeasUnits(this.drinkElementsList[value.id-1], (doc) => {
					//console.log(doc,'elementsMeasUnits callback in drinkElementSelected')
					this.drinkElement.baseUnit = this.elementMeasUnits[0]._id;
					this.drinkElement.baseUnitShortName = this.elementMeasUnits[0].shortName
					this.drinkElement.measuringUnit = this.elementMeasUnits[0]._id;
					this.drinkElement.measuringUnitShortName = this.elementMeasUnits[0].shortName
				});	

			}		 
		
		//console.log(this.drinkElement,'drinkElementSelected')
	}

  public elementSearchChanged(value) {
    this.elementSubject.next(value);  	
  }

	public drinkElementRemoved(value, add?){ //called when user removes ingredient or subproduct
		this.articleProviders = [];
		this.drinkElement.element.item = null;
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
  				//console.log('baseUnit._id',x.baseUnit._id,'==',element.measurementUnit._id,'element.measurementUnit')
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
			//console.log(this.elementMeasUnits,'elementMeasUnitCB')
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

// both functions will be in saveDrink function with a compare flag for add and edit
	public saveDrinkElement(){

		if(this.status=='new'){

				if (this.drinkElement.measuringUnit == null) {
		  			this.drinkElement.grossWeight=this.drinkElement.quantity*this.drinkElement.equivalenceUnit.quantity;
		  		}
		  		this.drink.composition.push(this.drinkElement);
		  		//console.log(this.drink.composition,'composition of drink')
		  		this.totalElements = this.drink.composition.length;
		 		//Calculate costs
		  		this.calculateCosts();

		  		//Recalculate values
		  		this.calculateTotals();

		  		 //Compute allergens
		  		this.computeAllergens();

		  		//Replace selectedCategoryOptions array with a new one so that the array reference changes and it is detected by the pipe compositionFilter 
		      	let array=[]; 
		      	array=this.selectedCategoryOptions.map(x => { return x; }); 
		      	this.selectedCategoryOptions=array;	
		      	//console.log(this.drinkElement,'drinkElementAdded')
		  		this.cleanAndResetFields();

				} else if (this.status == 'edit') {

					if (this.drinkElement.measuringUnit == null) {
		  			this.drinkElement.grossWeight=this.drinkElement.quantity*this.drinkElement.equivalenceUnit.quantity;
		  		}
		  		//replace object in position dishElementOnEditIndex
		  		this.drink.composition.splice(this.drinkElementIndex,1,this.drinkElement);

		  		//Calculate costs
		  		this.calculateCosts();

			  	//Recalculate values
			  	this.calculateTotals();

			  	//Compute allergens
		  		this.computeAllergens();

			  	//Replace selectedCategoryOptions array with a new one so that the array reference changes and it is detected by the pipe compositionFilter 
		      	let array=[]; 
		      	array=this.selectedCategoryOptions.map(x => { return x; }); 
		      	this.selectedCategoryOptions=array;	

		      	//console.log(this.drinkElement,'drinkElementEdited')
			  	this.cleanAndResetFields();
				}
	}

	public deleteDrinkElement() {
	  	this.drink.composition.splice(this.drinkElementIndex,1);

	  	this.totalElements = this.drink.composition.length;

	  	//Compute allergens
  		this.computeAllergens();

	  	if(this.totalElements>0)
	  	{
	 		//Calculate costs
	 		this.calculateCosts();

	  		//Recalculate values
	  		this.calculateTotals();

	  		//Replace selectedCategoryOptions array with a new one so that the array reference changes and it is detected by the pipe compositionFilter 
      		let array=[]; 
      		array=this.selectedCategoryOptions.map(x => { return x; }); 
      		this.selectedCategoryOptions=array;	

	  		this.cleanAndResetFields();
	  	} else {
	  		this.drink.totalCost=0;
	  		//Replace selectedCategoryOptions array with a new one so that the array reference changes and it is detected by the pipe compositionFilter 
      		let array=[]; 
      		array=this.selectedCategoryOptions.map(x => { return x; }); 
      		this.selectedCategoryOptions=array;	
	  	}
	  }

	public calculateTotals(){
	  	this.totalGrossWeight=0;
	  	this.totalNetWeight=0;
	  	this.drink.totalCost=0;
	  	this.drink.composition.forEach((element) => {
	  		this.totalGrossWeight+=element.grossWeight;
        this.totalNetWeight+=element.netWeight;	  		
	  		this.drink.totalCost+=element.calculatedCost;

	  	})
			this.loading = false;
	  }

	 public calculateCosts(){
  		//Calculate costs of all elements using conversion table
  		this.totalGrossWeight=0;
	  	this.drink.totalCost=0; 	
  		this.drink.composition.forEach((element) => {
  			this.totalGrossWeight+=element.grossWeight;

	  		this.drink.totalCost+=element.calculatedCost;
  			if(element.measuringUnit==null) { //measuring unit is an equivalence unit. Gross weight is already expressed in base unit.

  				element.grossWeight = element.equivalenceUnit.quantity * element.quantity;
  				element.calculatedCost = element.grossWeight * element.unitCost;

  			}
  			else {
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
		  							element.netWeight=element.grossWeight*(1-(element.wastePercentage/100))* conversionQty
		  						}
		  					})
		  				}
		  			})
	  			} else { //Measuring unit is equal to base unit, so there's no need for conversion
	  			element.calculatedCost = element.grossWeight * element.unitCost;
					element.netWeight=(element.grossWeight*(1-(element.wastePercentage/100)));
	  		}
	  	}
	  })
  		this.drink.composition.forEach((element) => {
			element.grossWeightPercent=(element.grossWeight / this.totalGrossWeight)*100 ;
			element.costPercent=element.calculatedCost/(this.drink.totalCost/100);

	  	})
  	}

  	public computeAllergens(){ //merge allergen data from subproduct composition elements
  		let updatedAllergens=[];
  		let aggregateAllergens=[];
  		if (this.totalElements>0) { //check whether there are composition elements
	  		this.drink.composition.forEach((element) => { //go over all subproduct composition elements
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
			  						////console.log('match is true')
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
  		this.drink.allergens=aggregateAllergens;
  		this.drink.allergensInitialized=true; //Flag used as ngIf in allergen-view component in main-edit
  	}

	public cleanAndResetFields(){
		var subProductIndex;
		this.selectElement.items = []
		this.elementMeasUnits=[];
		
		//Force ng2-select selection to reset
		this.activeElement = [{id: -1, text:''}]; //bogus active element
		this.activeElement = [];
    this.equivalenceUnitSelected=false;
    if(this.drinkElement.category == ''){
    	this.drinkElement.category = 'mainProduct';
    }
  	
	}

	public selectElementToEdit(compositionElement, index){
		if (compositionElement.element.item) {
			this.getArticles(compositionElement.element.item);			
		}
		var subElementsIndex;

		//We can't use this.drinkElementOnEdit=compositionElement because it is doing a deep copy. This means that
		//when updating this.drinkElementOnEdit we are actually updating this.dishOnEdit. As a result, when
		//the user updates values in the edit form before pressing 'save', it is already updating dishOnEdit which
		//is not what we want.
		//Instead we use Object.assign which makes a copy but does not do deep linking.

		this.drinkElement = JSON.parse(JSON.stringify(compositionElement));

		////console.log(this.dishElementOnEdit)
		//Save index position for editing later
		//this.drinkElementIndex = this.drink.composition.findIndex(el => el._id === compositionElement._id);
		this.drinkElementIndex = this.drink.composition.indexOf(compositionElement);

		this.activeElement = [];
			let object = { //used for selector
				id: this.drinkElement.element.item,
				text: this.drinkElement.name
			}
		this.activeElement.push(object)
		//console.log(this.activeElement,'activeElement')
		//Get measuring units for selected element
		//reset array
		this.elementMeasUnits=[];
		this.getEditedElementMeasUnits(this.drinkElement, (doc) => {
			//console.log(doc,'elementsMeasUnits callback in SelectElementToEdit')
			this.drinkElement.baseUnit = this.elementMeasUnits[0]._id;
			this.drinkElement.baseUnitShortName = this.elementMeasUnits[0].shortName

			var muIndex;
			//get index for elementMeasUnits array
			this.elementMeasUnits.find((h, i) => {
				if(h._id == this.drinkElement.measuringUnit) {
					//console.log(this.drinkElement.measuringUnit,'drinkElement.measuringUnit is already in elementMeasUnits',h,'elementMeasUnit')
					muIndex = i;
					return true;
				}
			})

			this.drinkElement.measuringUnit = this.elementMeasUnits[muIndex]._id;
			this.drinkElement.measuringUnitShortName = this.elementMeasUnits[muIndex].shortName
		});

		if(this.drinkElement.measuringUnit==null) {
			this.equivalenceUnitSelected=true;
		}
	}

	public selectElementToDelete(compositionElement, index){

		//Save index position for deleting later
		//this.drinkElementIndex = this.drink.composition.findIndex(el => el._id === compositionElement._id);  
		this.drinkElementIndex = this.drink.composition.indexOf(compositionElement);
	}

	public drinkMeasUnitSelected(index, add){

		if(!add) //edit mode
		{
			//console.log(index,'index of element meas unit selected',add,'edited?')
			this.drinkElement.measuringUnit = this.elementMeasUnits[index]._id;
			this.drinkElement.measuringUnitShortName = this.elementMeasUnits[index].shortName;
			if(this.drinkElement.measuringUnit==null){
				this.equivalenceUnitSelected=true;
			//Obtain equivalence quantity stored in dishElementsList
			this.drinkElementsList.find((sp) => {
				if(sp._id == this.drinkElement.element.item) {
					this.drinkElement.equivalenceUnit.quantity=sp.equivalenceUnit.quantity;
					this.drinkElement.equivalenceUnit.name=sp.equivalenceUnit.name;
					return;
				}
			})
			// this.conversionTable.conversions.find((conversion) => { otra manera de encontrar el quantity de las unidades de medida, a partir de l conversions
			// 	if(conversion.convUnit._id == this.drinkElement.measuringUnit) {
			// 		this.drinkElement.equivalenceUnit.quantity=conversion.quantity;
			// 		console.log(this.drinkElement,'drinkElement in drinkMeasUnitSelected with equivalenceUnit quantity')
			// 		return;
			// 	}
			// })
		} else {
			this.equivalenceUnitSelected=false;
		}

	} else { //add mode
		//console.log(index,'index of element meas unit selected',add,'added?')
		this.drinkElement.measuringUnit=this.elementMeasUnits[index]._id;
		this.drinkElement.measuringUnitShortName = this.elementMeasUnits[index].shortName;
		if(this.drinkElement.measuringUnit==null) {
			this.equivalenceUnitSelected=true;
  			//Obtain equivalence quantity stored in dishElementsList
  			this.drinkElementsList.find((sp) => {
  				if(sp._id == this.drinkElement.element.item) {
  					this.drinkElement.equivalenceUnit.quantity=sp.equivalenceUnit.quantity;
						this.drinkElement.equivalenceUnit.name=sp.equivalenceUnit.name;
  					return;
  				}
  			})
  		} else {
  			this.equivalenceUnitSelected=false;
  		}
  	}
	}

	public categorySelected(category, add) {
			//console.log(category,'category',add,'add')
			switch(category) {
				case '0': 
				this.drinkElement.category = 'mainProduct';
				break;
				case '1': 
				this.drinkElement.category = 'dressing';
				break;
				
				case '2': 
				this.drinkElement.category = 'addition';
				break;
			}
	}

    public viewIngredient(composition,tab){
    	 //Pass No delete redirect data to the parent component
    	this.passRedirectOn.emit(true);

    	let mode;
      	let _id=composition.element.item

    	//Save redirect data
    	if(this.viewMode) mode = 'view'; else mode = 'edit';
			this.compassService.saveRedirectData('recipes/drinks',this.id, this.versionId, mode)
			this.router.navigate(['./articles/ingredients/',_id, {tab: 'Ingredient'}]);
   
    }

    public viewSubproductVersion(composition){
    	 //Pass No delete redirect data to the parent component
    	this.passRedirectOn.emit(true);

      let mode;
      let _id=composition.element.item

      this.subproductsService.getActiveVersion(_id).subscribe(
            (data: any)=> {
            let _versionId=data[0].versions._id
            
            //Save redirect data
        	if(this.viewMode) mode = 'view'; else mode = 'edit';
            this.compassService.saveRedirectData('recipes/drinks',this.id, this.versionId, mode)
            this.router.navigate(['./recipes/subproducts/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'subproduct'}]);
            })
    }


  public onCategorySelectChange() {
    let array=[];
    this.categoryOptions.map((option) => { if(option.active) array.push(option.value); });
    this.selectedCategoryOptions=array;
  }

  public getAllergens() {
	this.allergensService.getAllergens(10000,0,'','').subscribe(
	  (data: any) => {
	    this.allergens = data.allergens;
	    this.computeAllergens();
	  })
	}

	public locationArea(){
		this.drink.composition.forEach((comp)=>{
			let result=this.drinkElementsList.some((drinkElement)=>{
				return	drinkElement._id==comp.element.item;
			})
			if (result==false){
				comp.location_unavailable=true;
			}else{
				comp.location_unavailable=false;
			}
		})
	}

	public searchDrinks(filterText){
		this.filterText = filterText;
		this.activeOrderBy++;
	}

	public addClick() {
		this.articleProviders = [];
		this.drinkElement = new Composition();
    this.status='new';
    this.drinkElement.element.kind = 'ingredient';
    this.cleanAndResetFields();
  }

  public viewClick(){
    this.status='view';
  }

  public editClick(){
    this.status='edit';
  }
  public sortColumn() {
	this.sortOrder = undefined;
    this.sortField = undefined;
    this.activeOrderBy++;
  }
}