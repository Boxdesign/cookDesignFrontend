import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DishService } from "../dish.service";
import { SubproductsService } from "../../subproducts/subproducts.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { MeasurementUnitService } from "../../../libraries/measurement-unit/measurement-unit.service";
import { CompassService } from "../../../global-utils/services/compass.service";
import { AllergenService } from '../../../libraries/allergen/allergen.service'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { Composition } from '../../../global-utils/models/composition.model';
import { Observable, Subject } from "rxjs/Rx";
import { NotificationsService } from 'angular2-notifications';
import { ArticleService } from "../../../providers/articles/article.service";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

enum DishCategories { mainProduct, dressing, sauce, addition };	

@Component({
	selector: 'dish-composition-edit',
	templateUrl: './dish-composition-edit.template.html',
})
export class DishCompositionEditComponent {
	@Input() public dish;
	@ViewChild('selectElement') selectElement;	
	public dishElementIndex;
	@Output() passRedirectOn = new EventEmitter();
	public dishElementListSelector: Array<any> = [];
	public dishElementsListPopulated: Boolean = false; 
	public filterText: string = '';
	public dishElementsList;
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
  public categories: any[] = [];
	public allergens;
	public salesTax;
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
	public dishElement = new Composition();
	public sortField: string;
	public sortOrder: number;
	public activeOrderBy: number = 0;
	public dishCategories;
	public articleProviders;
	public observerLocation;

	constructor(
		public articleService: ArticleService, 
		public router: Router, 
		public dishService: DishService,
		public mUnitsService: MeasurementUnitService, 
		public translate: TranslateService, 
		public allergensService: AllergenService, 
		public appConfig:AppConfig, 
		public route: ActivatedRoute,
		public compassService: CompassService, 
		public subproductsService: SubproductsService, 
		public notification: NotificationsService,
		public costFilterService: CostFilterService
	) {}

	ngOnInit(){
		this.loading = true;
		this.dishCategories = [{label: 'Ingrediente', value: 'ingredient'}, {label: 'Subproductos', value: 'subproduct'}];

  	this.appConfig.getSalesTax().subscribe((salesTax: any) => {
  		this.salesTax=salesTax;
  	});

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
    	this.searchBoxLabel = res;
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

  	this.route.data.subscribe((data: {mode:string}) => {
      if(data.mode) this.mode = data.mode;
    });

  	this.selectedCategoryOptions=[1,2,3,4]
  	this.categoryOptions.push(
      { active: true, name: 'recipes.dish.composition.categories.mainProduct', value: 1 },
      { active: true, name: 'recipes.dish.composition.categories.dressing', value: 2 },
      { active: true, name: 'recipes.dish.composition.categories.sauce', value: 3 },
      { active: true, name: 'recipes.dish.composition.categories.addition', value: 4 }
    );
  	
  	this.categories.push(
  		{value:1, category: 'mainProduct', translate: 'recipes.dish.composition.categories.mainProduct'},
  		{value:2, category: 'dressing', translate: 'recipes.dish.composition.categories.dressing'},
  		{value:3, category: 'sauce', translate: 'recipes.dish.composition.categories.sauce'},
  		{value:4, category: 'addition', translate: 'recipes.dish.composition.categories.addition'}
  	);

  	this.elementSubject
		.debounceTime(300)
		.subscribe((searchString) => {

			//console.log(searchString, 'searchString')
			this.selectElement.items = []

			if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
				//console.log('empty string')
				// string was deleted so assign empty array to ng-select items
				// force the ng-select to update and show the new list
				this.selectElement.open()
				this.previousSearch = ''
			
			} else {

				this.previousSearch = searchString;
				if (this.dishElement.element.kind == 'ingredient') {
					this.dishService.getIngredientsFilter(searchString, this.dish.location).subscribe(
						(data:any) => {
							//console.log(data,'data')
							this.dishElementsList = data;
							this.dishElementsList.length = data.length;
							if(this.dishElementsList.length == 0){
								let object = [{
		                  id: 1,
		                  text: 'No results'
		                }]

	              	this.selectElement.items = object;
		              this.selectElement.open();

							} else {

								let elementData = this.dishElementsList.map((element, index) => { 
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
				} else if (this.dishElement.element.kind == 'subproduct') {
					this.dishService.getSubproductsFilter(searchString, this.dish.location).subscribe(
						(data:any) => {
							//console.log(data,'data')
							this.dishElementsList = data;
							this.dishElementsList.length = data.length;
							if(this.dishElementsList.length == 0){
								let object = [{
		                  id: 1,
		                  text: 'No results'
		                }]

	              	this.selectElement.items = object;
		              this.selectElement.open();

							} else {

								let elementData = this.dishElementsList.map((element, index) => { 
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
		this.getDishElements();
		this.getAllergens();
		this.totalElements = this.dish.composition.length;
	}

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }	

	public onChangeCategory(e){
		this.articleProviders = [];
		this.dishElementsList = [];
		this.selectElement.items = []
		this.activeElement=[];
		this.elementMeasUnits=[];

		if(e.value=='ingredient'){
			this.dishElement.element.kind = 'ingredient';
		} else if(e.value=='subproduct'){
			this.dishElement.element.kind = 'subproduct';
		}
	}

	getArticles(ingredient) {  	//Gets ingredient's provider articles...
			this.articleProviders = [];
	    this.articleService.articlesByProvider(ingredient, this.dish.location).subscribe(
	      (data: any) => {
		      this.articleProviders = data;        	
	      },
	      (err) => {
	        this.notification.error('Error', err || 'Server error');
	      }
	    );
	  }


	public getDishElements() {
/*	Retrieves the list of ingredients and subproducts (in the user's zone) sorted by name
	dishElement = {
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


	public dishElementSelected(value){ //called when user selects an ingredient or subproduct
		
		if (value.text != "No results") {
			
			this.getArticles(this.dishElementsList[value.id-1]._id);				
			
			this.dishElement.element.kind = this.dishElementsList[value.id-1].type;
			this.dishElement.element.item = this.dishElementsList[value.id-1]._id;
			this.dishElement.allergens = this.dishElementsList[value.id-1].allergens;
			//Need this for the table but will have to remove them later before saving
			this.dishElement.name = this.dishElementsList[value.id-1].name;
			this.dishElement.unitCost = this.dishElementsList[value.id-1].cost;
			//console.log(this.subproductElementsList[index]);
			this.equivalenceUnitSelected=false;
			//console.log(this.dishElementsList[index]);
			this.elementMeasUnits=[];
			this.getNewElementMeasUnits(this.dishElementsList[value.id-1], (doc) => {

					this.dishElement.baseUnit = this.elementMeasUnits[0]._id;
					this.dishElement.baseUnitShortName = this.elementMeasUnits[0].shortName
					this.dishElement.measuringUnit = this.elementMeasUnits[0]._id;
					this.dishElement.measuringUnitShortName = this.elementMeasUnits[0].shortName
			
			});			
		}		 
		
	 //console.log(this.dishElement,'drinkElementSelected')
	}

	public elementSearchChanged(value) {
    this.elementSubject.next(value);  	
  }

	public dishElementRemoved(value){ //called when user removes ingredient or subproduct
		this.dishElement.element.item = null;
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

	public saveDishElement(){

		if(this.status=='new'){

				if (this.dishElement.measuringUnit == null) {
		  			this.dishElement.grossWeight=this.dishElement.quantity*this.dishElement.equivalenceUnit.quantity;
		  		}

		  		this.dish.composition.push(this.dishElement);
		  		this.totalElements = this.dish.composition.length;

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
		      	//console.log(this.dishElement,'dishElementAdded')
		  		this.cleanAndResetFields();

				} else if (this.status == 'edit') {

					if (this.dishElement.measuringUnit == null) {
		  			this.dishElement.grossWeight=this.dishElement.quantity*this.dishElement.equivalenceUnit.quantity;
		  		}

		  		//replace object in position dishElementOnEditIndex
		  		this.dish.composition.splice(this.dishElementIndex,1,this.dishElement);

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
		      	//console.log(this.dishElement,'dishElementEdited')
			  	this.cleanAndResetFields();
				}
	}


	public deleteDishElement() {
	  	this.dish.composition.splice(this.dishElementIndex,1);

	  	this.totalElements = this.dish.composition.length;

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

	  		this.dish.totalCost=0;
	  		//Replace selectedCategoryOptions array with a new one so that the array reference changes and it is detected by the pipe compositionFilter 
      		let array=[]; 
      		array=this.selectedCategoryOptions.map(x => { return x; }); 
      		this.selectedCategoryOptions=array;	

	  	}
	  }

	public calculateTotals(){
	  	this.totalGrossWeight=0;
	  	this.totalNetWeight=0;
	  	this.dish.totalCost=0;
	  	this.dish.composition.forEach((element) => {
	  		this.totalGrossWeight+=element.grossWeight;
        this.totalNetWeight+=element.netWeight;		
	  		this.dish.totalCost+=element.calculatedCost;
	  	})
			this.loading = false;
	  }
	
	public calculateCosts(){
  		//Calculate costs of all elements using conversion table
  		this.totalGrossWeight=0;
	  	this.dish.totalCost=0; 	
  		this.dish.composition.forEach((element) => {
		  	this.totalGrossWeight+=element.grossWeight;
	  		this.dish.totalCost+=element.calculatedCost;
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
  		this.dish.composition.forEach((element) => {
			element.grossWeightPercent=(element.grossWeight / this.totalGrossWeight)*100 ;
			element.costPercent=element.calculatedCost/(this.dish.totalCost/100);

	  	})
  	}

  	public computeAllergens(){ //merge allergen data from subproduct composition elements
  		let updatedAllergens=[];
  		let aggregateAllergens=[];
  		if (this.totalElements>0) { //check whether there are composition elements
	  		this.dish.composition.forEach((element) => { //go over all subproduct composition elements
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
	  	//console.log(aggregateAllergens, 'aggregateAllergens')
  		this.dish.allergens=aggregateAllergens;
  		this.dish.allergensInitialized=true; //Flag used as ngIf in allergen-view component in main-edit
  	}

	public cleanAndResetFields(){

		var subProductIndex;
		this.selectElement.items = []
		//Force ng2-select selection to reset
		this.elementMeasUnits=[];
		this.activeElement = [{id: -1, text:''}]; //bogus active element
		this.activeElement = [];
		this.equivalenceUnitSelected=false;
		if(this.dishElement.category == ''){
			this.dishElement.category = 'mainProduct';
		}
	}

	public selectElementToEdit(compositionElement, index){		
		if (compositionElement.element.item) {
			this.getArticles(compositionElement.element.item);			
		}
		var subElementsIndex;
		//console.log(compositionElement,'compositionElementDISH')
  		//We can't use this.dishElementOnEdit=compositionElement because it is doing a deep copy. This means that
  		//when updating this.dishElementOnEdit we are actually updating this.dishOnEdit. As a result, when
  		//the user updates values in the edit form before pressing 'save', it is already updating dishOnEdit which
  		//is not what we want.
  		//Instead we use Object.assign which makes a copy but does not do deep linking.
		this.dishElement = this.clone(compositionElement);

  		////console.log(this.dishElementOnEdit)
  		//Save index position for editing later

  	//this.dishElementIndex = this.dish.composition.findIndex(el => el._id === compositionElement._id); 
		this.dishElementIndex = this.dish.composition.indexOf(compositionElement);

  	this.activeElement = [];
  		let object = { //used for selector
  			id: this.dishElement.element.item,
  			text: this.dishElement.name
  	}
  	this.activeElement.push(object)

  		//Get measuring units for selected element
  		//reset array
  		this.elementMeasUnits=[];

  	this.getEditedElementMeasUnits(this.dishElement, (doc) => {

  			this.dishElement.baseUnit = this.elementMeasUnits[0]._id;
  			this.dishElement.baseUnitShortName = this.elementMeasUnits[0].shortName

  			var muIndex;
				//get index for elementMeasUnits array
				this.elementMeasUnits.find((h, i) => {
					if(h._id == this.dishElement.measuringUnit) {
						muIndex = i;
						return true;
					}
				})

				this.dishElement.measuringUnit = this.elementMeasUnits[muIndex]._id;
				this.dishElement.measuringUnitShortName = this.elementMeasUnits[muIndex].shortName

		});

		if(this.dishElement.measuringUnit==null) {
			this.equivalenceUnitSelected=true;
	  	}
  	}

  	public selectElementToDelete(compositionElement, index){

  		//Save index position for deleting later
  		//this.dishElementIndex = this.dish.composition.findIndex(el => el._id === compositionElement._id); 
  		this.dishElementIndex = this.dish.composition.indexOf(compositionElement);
  	}

  	public dishMeasUnitSelected(index, add){

  		if(!add) //edit mode
  		{
  			this.dishElement.measuringUnit = this.elementMeasUnits[index]._id;
  			this.dishElement.measuringUnitShortName = this.elementMeasUnits[index].shortName;
  			if(this.dishElement.measuringUnit==null){
  				this.equivalenceUnitSelected=true;
				//Obtain equivalence quantity stored in dishElementsList
				this.dishElementsList.find((sp) => {
					if(sp._id == this.dishElement.element.item) {
						this.dishElement.equivalenceUnit.quantity=sp.equivalenceUnit.quantity;
						this.dishElement.equivalenceUnit.name=sp.equivalenceUnit.name;
						return;
					}
				})
			} else {
				this.equivalenceUnitSelected=false;
			}

		} else { //add mode
			this.dishElement.measuringUnit=this.elementMeasUnits[index]._id;
			this.dishElement.measuringUnitShortName = this.elementMeasUnits[index].shortName;
			if(this.dishElement.measuringUnit==null) {
				this.equivalenceUnitSelected=true;
	  			//Obtain equivalence quantity stored in dishElementsList
	  			this.dishElementsList.find((sp) => {
	  				if(sp._id == this.dishElement.element.item) {
	  					this.dishElement.equivalenceUnit.quantity=sp.equivalenceUnit.quantity;
							this.dishElement.equivalenceUnit.name=sp.equivalenceUnit.name;
	  					return;
	  				}
	  			})
	  		} else {
	  			this.equivalenceUnitSelected=false;
	  		}
	  	}
	}

	public categorySelected(category) {
		
		switch(category) {
				case '0': 
				this.dishElement.category = 'mainProduct';
				break;
				case '1': 
				this.dishElement.category = 'dressing';
				break;
				case '2': 
				this.dishElement.category = 'sauce';
				break;
				case '3': 
				this.dishElement.category = 'addition';
				break;
			}

	}

    public viewIngredient(composition,tab){
    	 //Pass No delete redirect data to the parent component
    	this.passRedirectOn.emit(true);

    	let mode;
      	let _id=composition.element.item

    	//Save redirect data
    	if(this.mode == 'view') mode = 'view'; else mode = 'edit';
		
		this.compassService.saveRedirectData('recipes/dishes',this.id, this.versionId, mode)
		this.router.navigate(['./articles/ingredients/',_id, {tab: 'Ingredient'}]);
   
    }

    public viewSubproductVersion(composition){
    	 //Pass No delete redirect data to the parent component
    	this.passRedirectOn.emit(true);
    	
      let mode;
      let _id=composition.element.item

      this.subproductsService.getActiveVersion(_id).subscribe(
            (data: any)=> {
            //console.log(data[0], 'active version')
            let _versionId=data[0].versions._id
            
            //Save redirect data
        	if(this.mode == 'view') mode = 'view'; else mode = 'edit';
            this.compassService.saveRedirectData('recipes/dishes',this.id, this.versionId, mode)
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
		this.dish.composition.forEach((comp)=>{
			let result=this.dishElementsList.some((dishElement)=>{
				return	dishElement._id==comp.element.item;
			})
			if (result==false){
				comp.location_unavailable=true;
			}else{
				comp.location_unavailable=false;
			}
		})
	}
	public searchDishes(filterText){
		this.filterText = filterText;	
		this.activeOrderBy++;	
	}

	public addClick() {
		this.articleProviders = [];
		this.dishElement = new Composition();
    this.status='new';
    this.dishElement.element.kind = 'ingredient';
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
