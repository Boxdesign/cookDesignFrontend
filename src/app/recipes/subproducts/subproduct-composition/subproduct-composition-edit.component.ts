import { Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubproductsService } from "../subproducts.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { MeasurementUnitService } from "../../../libraries/measurement-unit/measurement-unit.service";
import { AllergenService } from '../../../libraries/allergen/allergen.service'
import { CompassService } from "../../../global-utils/services/compass.service";
import { Observable, Subject } from "rxjs/Rx";
import { NotificationsService } from 'angular2-notifications';
import { subproductComposition } from '../../../global-utils/models/subproductComposition.model';
import { ArticleService } from "../../../providers/articles/article.service";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
	selector: 'subproduct-composition-edit',
	templateUrl: './subproduct-composition-edit.template.html',
})
export class SubproductCompositionEditComponent {
	@Input() public subproduct;
	@ViewChild('selectElement') selectElement;
	public subproductElementIndex;
	@Output() passRedirectOn = new EventEmitter();
	public filterText: string = '';
	public subproductElementsList;
	public subproductElementListSelector: Array<any> = [];
	public subproductElementsListPopulated: Boolean = false;
	public measurementUnits;
	// public subproductMeasUnitShortName;
	public searchBoxLabel: string;
	public conversionTable;
	public elementMeasUnits = [];
	public totalGrossWeight;
	public totalNetWeight;
	public totalElements=0;
	public equivalenceUnitSelected=false;
	public equivalenceQty: any;
	public allergens;
	public mode
	public id;
	public versionId;
	public activeElement = [];
	elementSubject: Subject<any> = new Subject();
	public previousSearch: string = null;
	public clone = require('clone');
	public status;
	public numPages:number;
	public filterLocations;
	public subproductElement = new subproductComposition();
	public loading : boolean;
	public subproductCategories;
	public articleProviders;
	public observerLocation;

	constructor(
		public articleService: ArticleService, 
		public router: Router, 
		public subproductService: SubproductsService,
		public mUnitsService: MeasurementUnitService, 
		public translate: TranslateService, 
		public compassService: CompassService, 
		public allergensService: AllergenService, 
		public route: ActivatedRoute, 
		public notification: NotificationsService,
		public costFilterService: CostFilterService
		) {}

	ngOnInit(){
		this.loading = true;
		this.subproductCategories = [{label: 'Ingrediente', value: 'ingredient'}, {label: 'Subproductos', value: 'subproduct'}];

		this.route.data.subscribe((data: { mode:string}) => {
			if(data.mode) this.mode = data.mode;
		});

		this.translate.get('searchBox.beginText').subscribe((res: string) => {
			this.searchBoxLabel = res;
		});

		this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId']});

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
    }) 


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
					if (this.subproductElement.element.kind == 'ingredient') {					
						this.subproductService.getIngredientsFilter(searchString, this.subproduct.location).subscribe(
							(data:any) => {
								this.subproductElementsList = data;
								this.subproductElementsList.length = data.length;
								if(this.subproductElementsList.length == 0){
									let object = [{
										id: 1,
										text: 'No results'
									}]

									this.selectElement.items = object;
									this.selectElement.open();

								} else {

									let elementData = this.subproductElementsList.map((element, index) => { 
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
						
					} else if (this.subproductElement.element.kind == 'subproduct') {
						this.subproductService.getSubproductsFilter(searchString, this.subproduct.location, this.subproduct._id).subscribe(
							(data:any) => {
								this.subproductElementsList = data;
								this.subproductElementsList.length = data.length;
								if(this.subproductElementsList.length == 0){
									let object = [{
										id: 1,
										text: 'No results'
									}]

									this.selectElement.items = object;
									this.selectElement.open();

								} else {

									let elementData = this.subproductElementsList.map((element, index) => { 
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
					//console.log('entrant a funcio ELEMENT SUBJECT a ng ON INIT', this.selectElement)
				}
			});
			//this.getConversionTable();
			//this.getMeasuringUnits();
			this.getSubproductElements();
			this.getAllergens();
			this.totalElements = this.subproduct.composition.length;
	}

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }	

	public getSubproductElements() {
/*	Retrieves the list of ingredients and subproducts (in the user's zone) sorted by name
	subproductElement = {
        'type': 'ingredient',
        '_id': doc._id,
        'allergens' : ''
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

				//If subproduct contains elements, update fields:
				// - measuringUnitShortName, baseUnit, baseUnitShortName such as name, unitCost, baseunit
				if (this.totalElements>0) this.updateFieldsInit();
				else this.loading = false;

			},
			(err) => {
				this.notification.error('Error', err || 'Error');
			})


  //   this.subproductService.getElements('').subscribe(
  //   	(data: any)=> {
  //   		var subProductIndex;
  //   		this.subproductElementsList = data;
  //   		this.locationArea();
		// 	//Remove the subproduct itself from the list
		// 	this.subproductElementsList.find((element, index) => {
		// 		if (element._id == this.subproduct._id) {
		// 			subProductIndex=index;
		// 			return;
		// 		}
		// 	})
		// 	this.subproductElementsList.splice(subProductIndex,1);
		// //Flag elements that are outside of the users zone.


		// //Get conversion table
		// 	this.mUnitsService.getConversionTable().subscribe(
		// 		(data: any)=> {
		// 			this.conversionTable = data;

		// //If subproduct contains elements, update fields:
		// // - measuringUnitShortName, baseUnit, baseUnitShortName such as name, unitCost, baseunit
		//   		if (this.totalElements>0) this.updateFieldsInit();
		// 			else this.loading = false;

		//  	},
		// 	(err) => {
		// 		this.notification.error('Error', err || 'Error');
		// 	})
		// },
		// (err) => {
		// 	this.notification.error('Error', err || 'Error');
		// })
	}

	public updateFieldsInit(){
		//Update each element in subproduct with updated fields: unitCost, name, etc...

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
				this.notification.error('Error', err || 'Error');			})
    	}

    	public onChangeCategory(e){
    		this.articleProviders = [];
    		this.subproductElementsList = [];
    		this.selectElement.items = []
    		this.activeElement=[];
    		this.elementMeasUnits=[];
    		this.subproductElement.element.item = null;
    		if(e.value=='ingredient'){
    			this.subproductElement.element.kind = 'ingredient';
    		} else if(e.value=='subproduct'){
    			this.subproductElement.element.kind = 'subproduct';
    		}
    	}

	getArticles(ingredient) {  	//Gets ingredient's provider articles...
		
		this.articleProviders = [];
		this.articleService.articlesByProvider(ingredient, this.subproduct.location).subscribe(
			(data: any) => {
				this.articleProviders = data;        	

			},
			(err) => {
				this.notification.error('Error', err || 'Server error');
			}
			);
	}

	public subproductElementSelected(value){ //called when user selects an ingredient or subproduct from dropdown

		if (value.text != "No results") {

			this.getArticles(this.subproductElementsList[value.id-1]._id);				

			this.subproductElement.element.kind = this.subproductElementsList[value.id-1].type;
			this.subproductElement.element.item = this.subproductElementsList[value.id-1]._id;
			this.subproductElement.allergens = this.subproductElementsList[value.id-1].allergens;
			//Need this for the table but will have to remove them later before saving
			this.subproductElement.name = this.subproductElementsList[value.id-1].name;
			this.subproductElement.unitCost = this.subproductElementsList[value.id-1].cost;

			//console.log(this.subproductElementsList[index]);
			this.equivalenceUnitSelected=false;

			this.elementMeasUnits=[];
			this.getNewElementMeasUnits(this.subproductElementsList[value.id-1], (doc) => {
				this.subproductElement.baseUnit = this.elementMeasUnits[0]._id;
				this.subproductElement.baseUnitShortName = this.elementMeasUnits[0].shortName
				this.subproductElement.measuringUnit = this.elementMeasUnits[0]._id;
				this.subproductElement.measuringUnitShortName = this.elementMeasUnits[0].shortName
			});
		}			

	}

	public elementSearchChanged(value) {
			this.elementSubject.next(value);  	
    //console.log('elementSearchChanged', value)
  }

  public subproductElementRemoved(value, add?){ //called when user removes ingredient or subproduct
  	this.articleProviders = [];
  	this.subproductElement.element.item = null;
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

		public saveSubproductElement(){

			if(this.status=='new'){

				if (this.subproductElement.measuringUnit == null) {
					this.subproductElement.grossWeight=this.subproductElement.quantity*this.subproductElement.equivalenceUnit.quantity;
				}

				this.subproduct.composition.push(this.subproductElement);
				this.totalElements = this.subproduct.composition.length;

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

		      	if (this.subproductElement.measuringUnit == null) {
		      		this.subproductElement.grossWeight=this.subproductElement.quantity*this.subproductElement.equivalenceUnit.quantity;
		      	}

		  		//replace object in position dishElementOnEditIndex
		  		this.subproduct.composition.splice(this.subproductElementIndex,1,this.subproductElement);

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

	public deleteSubproductElement(compositionElement) {

		this.subproductElementIndex = this.subproduct.composition.indexOf(compositionElement);
		this.subproduct.composition.splice(this.subproductElementIndex,1);

		this.totalElements = this.subproduct.composition.length;

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
	  		this.subproduct.totalCost=0;
	  	}
	  }

	  public calculateTotals(){
	  	this.totalGrossWeight=0;
	  	this.totalNetWeight=0;
	  	this.subproduct.totalCost=0;
	  	this.subproduct.totalOneGrossValue=0;
	  	this.subproduct.totalOneNetValue=0;

	  	this.subproduct.composition.forEach((element) => {
	  		this.subproduct.totalOneGrossValue+=element.grossWeight/this.subproduct.netWeight;
	  		this.subproduct.totalOneNetValue+=element.grossWeight*(1-(element.wastePercentage/100))/this.subproduct.netWeight;
	  		this.totalGrossWeight+=element.grossWeight;
	  		this.totalNetWeight+=element.netWeight;
	  		this.subproduct.totalCost+=element.calculatedCost;
	  	})

	  	this.subproduct.totalGrossWeight=this.totalGrossWeight;
	  	this.loading = false;
	  }

	  public calculateCosts(){
  		//Calculate costs of all elements using conversion table

  		this.subproduct.composition.forEach((element) => {
  			if(element.measuringUnit==null) { //measuring unit is an equivalence unit. Gross weight is already expressed in base unit.

  				element.grossWeight = element.equivalenceUnit.quantity * element.quantity;
  				element.calculatedCost = element.grossWeight * element.unitCost;
  				element.netWeight = element.grossWeight*(1-(element.wastePercentage/100));

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
		  					x.conversions.find((c) => {
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
	  			element.netWeight = element.grossWeight*(1-(element.wastePercentage/100));
	  		}
	  	}
	  })

  	}

  	public computeAllergens(){ //merge allergen data from subproduct composition elements
  		let updatedAllergens=[];
  		let aggregateAllergens=[];
  		if (this.totalElements>0) { //check whether there are composition elements
	  		this.subproduct.composition.forEach((element) => { //go over all subproduct composition elements
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
	  	this.subproduct.allergens=aggregateAllergens;
  		this.subproduct.allergensInitialized=true; //Flag used as ngIf in allergen-view component in main-edit
  	}

  	public cleanAndResetFields(){
  		var subProductIndex;
  		this.selectElement.items = []
		//Force ng2-select selection to reset
		this.activeElement = [{id: -1, text:''}]; //bogus active element
		this.activeElement = [];
		this.elementMeasUnits=[];
		this.equivalenceUnitSelected=false;

	}

	public selectElementToEdit(compositionElement){
		
		if (compositionElement.element.item) {
			this.getArticles(compositionElement.element.item);			
		}
		var subElementsIndex;

		//We can't use this.subproductElement=compositionElement because it is doing a deep copy. This means that
		//when updating this.subproductElement we are actually updating this.subproduct. As a result, when
		//the user updates values in the edit form before pressing 'save', it is already updating subproduct which
		//is not what we want.
		//Instead we use Object.assign which makes a copy but does not do deep linking.
		this.subproductElement = this.clone(compositionElement);
		//Save index position for editing later
		//this.subproductElementIndex = this.subproduct.composition.findIndex(el => el._id === compositionElement._id);
		this.subproductElementIndex = this.subproduct.composition.indexOf(compositionElement);
		//Get index value for subproductElementsList array
		// this.subproductElementsList.find((sp, i)=>{
			this.activeElement = [];
			let object = {
				id: this.subproductElement.element.item,
				text: this.subproductElement.name
			}
			this.activeElement.push(object)

  		//Get measuring units for selected element
  		//reset array
  		this.elementMeasUnits=[];
  		//console.log(this.subproductElementsList,'element like INPUT of getElementMeasUnits',subElementsIndex,'subElementsIndex')
  		this.getEditedElementMeasUnits(this.subproductElement, (doc) => {
  			//this.subproductElement.baseUnit = this.elementMeasUnits[0]._id;
  			//this.subproductElement.baseUnitShortName = this.elementMeasUnits[0].shortName

  			var muIndex;
				//get index for elementMeasUnits array
				this.elementMeasUnits.find((h, i) => {
					if(h._id == this.subproductElement.measuringUnit) {
						muIndex = i;
						return true;
					}
				})

				this.subproductElement.measuringUnit = this.elementMeasUnits[muIndex]._id;
				this.subproductElement.measuringUnitShortName = this.elementMeasUnits[muIndex].shortName
			});

  		if(this.subproductElement.measuringUnit==null) {
  			this.equivalenceUnitSelected=true;
	  		}
	  	}

	public subproductMeasUnitSelected(index, add){

  		if(!add) //edit mode
  		{
  			this.subproductElement.measuringUnit = this.elementMeasUnits[index]._id;
  			this.subproductElement.measuringUnitShortName = this.elementMeasUnits[index].shortName;
  			if(this.subproductElement.measuringUnit==null){
  				this.equivalenceUnitSelected=true;
					//Obtain equivalence quantity stored in subproductElementsList
					this.subproductElementsList.find((sp) => {
						if(sp._id == this.subproductElement.element.item) {
							this.subproductElement.equivalenceUnit.quantity=sp.equivalenceUnit.quantity;
							this.subproductElement.equivalenceUnit.name=sp.equivalenceUnit.name;
							return;
						}
					})
			} else {
				this.equivalenceUnitSelected=false;
			}

		} else { //add mode
			this.subproductElement.measuringUnit=this.elementMeasUnits[index]._id;
			this.subproductElement.measuringUnitShortName = this.elementMeasUnits[index].shortName;
			if(this.subproductElement.measuringUnit==null) {
				this.equivalenceUnitSelected=true;
	  			//Obtain equivalence quantity stored in subproductElementsList
	  			this.subproductElementsList.find((sp) => {
	  				if(sp._id == this.subproductElement.element.item) {
	  					this.subproductElement.equivalenceUnit.quantity=sp.equivalenceUnit.quantity;
	  					this.subproductElement.equivalenceUnit.name=sp.equivalenceUnit.name;
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
    	if(this.mode) mode = 'view'; else mode = 'edit';
    	this.compassService.saveRedirectData('recipes/subproducts',this.id, this.versionId, mode)
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
    			if(this.mode) mode = 'view'; else mode = 'edit';
    			this.compassService.saveRedirectData('recipes/subproducts',this.id, this.versionId, mode)
			   	this.router.navigate(['./recipes/subproducts/']);// change route to detect chenges on the same path
			   	let timeout = setTimeout(() => {  
			   		this.router.navigate(['./recipes/subproducts/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'subproduct'}]);
			   	}, 50);
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
    	this.subproduct.composition.forEach((comp)=>{
    		let result=this.subproductElementsList.some((subElement)=>{
    			return	subElement._id==comp.element.item;
    		})
    		if (result==false){
    			comp.location_unavailable=true;
    		}else{
    			comp.location_unavailable=false;
    		}
    	})
    }

    public searchSubproducts(filterText){
    	this.filterText = filterText;
    }

    public addClick() {
    	this.articleProviders = [];
    	this.subproductElement = new subproductComposition();
    	this.subproductElement.element.kind = 'ingredient';
    	this.status='new';
    	this.cleanAndResetFields();
    }

    public viewClick(){
    	this.status='view';
    }

    public editClick(){
    	this.status='edit';
    }
  }
