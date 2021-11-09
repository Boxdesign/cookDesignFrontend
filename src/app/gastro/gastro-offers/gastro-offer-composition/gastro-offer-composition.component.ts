import { Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GastroOfferService } from "../gastro-offer.service";
import { DishService } from "../../../recipes/dishes/dish.service";
import { DrinkService } from "../../../recipes/drinks/drink.service";
import { ProductsService } from "../../../recipes/products/products.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications';
import { FamilyService } from "../../../libraries/family/family.service";
import { CompassService } from "../../../global-utils/services/compass.service";
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { GastroElement } from '../../../global-utils/models/gastro-element.model'
import { IngredientsService } from "../../../articles/ingredients/ingredients.service";
import { Subject } from "rxjs/Rx";
import { PackagingsService } from '../../../articles/packagings/packagings.service'
import { Observable } from 'rxjs/Observable';
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'gastro-offer-composition',
  templateUrl: './gastro-offer-composition.component.html',
  styleUrls: ['./gastro-offer-composition.component.scss']
})
export class GastroOfferCompositionComponent implements OnInit {
	@Input() public menu;
	@ViewChild('selectDish') selectDish;
  @ViewChild('selectDrink') selectDrink;
  @ViewChild('selectProduct') selectProduct;
	public gastroElementIndex;
	public filterText: string = '';
	public dishesList;
	public drinksList
	public productsList;
	// public menuMeasUnitShortName;
	public searchBoxLabel: string;
	public elementMeasUnits = [];
	public totalElements=0;
	public families;
	public subfamilies;
	public dishPricingRates;
	public drinkPricingRates;
	public productPricingRates;
  public selectedCategoryOptions: number[];
  public categoryOptions: any[] = [];
	public familiesPopulated = false;
	public calculMethod='calculByPrice';
	public salesTax;
	public numFamilies;
	public menuType;
	public viewMode: boolean=false;
	public id;
	public versionId;
	public gastroElementCategories;
	dishSubject: Subject<any> = new Subject();
  drinkSubject: Subject<any> = new Subject();
  productSubject: Subject<any> = new Subject();
  public _dishSearch: string = null;
  public _drinkSearch: string = null;
  public _productSearch: string = null;
  activeDish;
  activeDrink;
  activeProduct;
  public status;
  public gastroElementBeforeEdit;
	public gastroElement;
	public clone = require('clone');
  public filterOnlyDish
  public filterOnlyDrink
  public observerLocation;
  public filterLocations = [];

	constructor(
		public router: Router, 
		public menuService: GastroOfferService, 
		public translate: TranslateService,
		public dishService: DishService, 
		public notification: NotificationsService, 
		public familyService: FamilyService,
		public appConfig:AppConfig, 
		public route: ActivatedRoute, 
		public productService: ProductsService,
		public compassService: CompassService, 
		public drinkService: DrinkService,
    public costFilterService: CostFilterService
	) 
	{
	}

	ngOnInit(){
		//this.gastroElement=new GastroElement();
  	this.appConfig.getSalesTax().subscribe((salesTax: any) => {
  		this.salesTax=salesTax;
  	});

		this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId'];});

		//Get type of menu from route path
	  this.route.data.subscribe((data: {menuType: String, viewMode:boolean}) => {
      this.menuType = data.menuType;
      if(data.viewMode) this.viewMode = data.viewMode;
    });

	  this.gastroElementCategories = [{label: 'Platos', value: 'dish'}, {label: 'Bebidas', value: 'drink'}];

    if (this.menuType == 'catalog') this.selectedCategoryOptions=[3];
    else this.selectedCategoryOptions=[1,2]

    this.categoryOptions.push(
      { active: true, name: 'recipes.composition.dish', value: 1 },
      { active: true, name: 'recipes.composition.drink', value: 2  },
    );

    //if(this.menuType == 'catalog') this.setProductNetWeight();
		this.translation();

		this.totalElements = this.menu.composition.length;

		this.dishSubject
      .debounceTime(300)
      .subscribe((searchString) => {

        if (searchString === this._dishSearch) {

            // string was deleted so assign empty array to ng-select items
            this.selectDish.items = []
            // force the ng-select to update and show the new list
            this.selectDish.open()
            this._dishSearch = ''

        } else {

          this._dishSearch = searchString;
          
          this.dishService.getDishes(50, 0, searchString, '', 1, this.menu.location, null, true, true, true).subscribe(
            (data:any) => {
              this.dishesList = data.dishes.filter((dish)=> {
                return dish.active == true;
              })
              this.dishesList.length = data.totalElements
              if(this.dishesList.length == 0){
	                let object = [{
	                  id: 1,
	                  text: 'No results'
	                }]

              	this.selectDish.items = object;
	              this.selectDish.open();
	              //console.log(this.selectDish,'itemsS')
              } else {
	              //this.ingredientSelector = [];
	              let ingData = this.dishesList.map((dish, index) =>{ 
	              	//console.log(dish,'dishINIT')
	                let object = {
	                  id: dish,
	                  text: dish.versions.lang.name
	                }
	                return object;
	              })
	              this.selectDish.items = ingData;
	              this.selectDish.open();
	              //console.log(this.selectDish,'itemsS')
              }
            },
            (err) => {
              this.notification.error('Error', err || 'Error');
            });
        }
      });

    this.drinkSubject
      .debounceTime(300)
      .subscribe((searchString) => {

        if (searchString === this._drinkSearch) {

            // string was deleted so assign empty array to ng-select items
            this.selectDrink.items = []
            // force the ng-select to update and show the new list
            this.selectDrink.open()
            this._drinkSearch = ''

        } else {

            this._drinkSearch = searchString;
            this.drinkService.getDrinks(50, 0, searchString,'',1,this.menu.location, null, true, true, true).subscribe(
              (data:any) => {
                this.drinksList = data.drinks.filter((drink)=> {
                  return drink.active == true;
                })
                this.drinksList.length = data.totalElements
                if(this.drinksList.length == 0){
                  let object = [{
                    id: 1,
                    text: 'No results'
                  }]
                this.selectDrink.items = object;
                this.selectDrink.open();
              } else {

              	let drinkData = this.drinksList.map((drink, index) =>{ 
                  let object = {
                    id: drink,
                    text: drink.versions.lang.name
                  }
                  return object;
                })
                this.selectDrink.items = drinkData;
                this.selectDrink.open();
              }
              },
              (err) => {
                this.notification.error('Error', err || 'Error');
              })
        }
      });

    this.productSubject
      .debounceTime(300)
      .subscribe((searchString) => {
        if (searchString === this._productSearch) {
            // string was deleted so assign empty array to ng-select items
            this.selectProduct.items = []
            // force the ng-select to update and show the new list
            this.selectProduct.open()
            this._productSearch = ''
        } else {
            this._productSearch = searchString;
            this.productService.getProducts(50, 0, searchString, '',1, this.menu.location, null, true, true).subscribe(
              (data:any) => {
                this.productsList = data.products.filter((product)=> {
                  return product.active == true;
                })
                this.productsList.length = data.totalElements
                //this.packagingSelector = [];
                let productData = this.productsList.map((product, index) =>{ 
                  let object = {
                    id: product,
                    text: product.versions.lang.name
                  }
                  return object;
                })
                this.selectProduct.items = productData;
                this.selectProduct.open();
              },
              (err) => {
                this.notification.error('Error', err || 'Error');
              })
        }
      }); 

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
      	console.log('filter location: ', data)
      	this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
    		this.getFamilies();  
    })           
	}

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

	public setProductNetWeight(){
		this.menu.composition.forEach((compElement) => {
				let netWeight;
				if (compElement.element.item.versions[0].netWeight) netWeight = compElement.element.item.versions[0].netWeight;
				else netWeight = 0;
				compElement.netWeight = netWeight;
		})
	}

	public getGastroOffer() {
    this.menuService.getMenu(this.id, this.versionId).subscribe(
      (data) => {
        this.menu = data;
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      });
  }

  public dishSelected(value, add){
  	this.gastroElement.element.kind='dish';
  	this.gastroElement.element.item = value.id;
  	this.gastroElement.cost = value.id.versions.costPerServing;
  	this.gastroElement.name = value.id.versions.lang.name;

  	//Get dish pricing rates
  	if(this.menuType=='carte' || this.menuType=='fixedPriceCarte') {
  		this.dishService.getPricingRates(this.gastroElement.element.item._id).subscribe(
  			(data: any)=> {
  				this.dishPricingRates=data;
  				if(data.length>0) {
  					this.gastroElement.price = data[0].price;
  					if(data[0]._id) this.gastroElement.pricingRate = data[0]._id;
  					else this.gastroElement.pricingRate=null;
  				} else {
  					this.gastroElement.price=0;
  					this.gastroElement.pricingRate=null;
  				}
  			},
  			(err) => {
  				this.notification.error('Error', err || 'Server error');
  			})
  	}
  }

  public drinkSelected(value){
  	this.gastroElement.element.kind='drink';
  	this.gastroElement.element.item = value.id;
  	this.gastroElement.cost = value.id.versions.costPerServing;
  	this.gastroElement.name = value.id.versions.lang.name;

  	//Get drink pricing rates
  	if(this.menuType=='carte' || this.menuType=='fixedPriceCarte') {
  		this.drinkService.getPricingRates(this.gastroElement.element.item._id).subscribe(
  			(data: any)=> {
  				this.drinkPricingRates=data;
  				if(data.length>0) {
  					this.gastroElement.price = data[0].price;
  					if(data[0]._id) this.gastroElement.pricingRate = data[0]._id;
  					else this.gastroElement.pricingRate=null;
  				} else {
  					this.gastroElement.price=0;
  					this.gastroElement.pricingRate=null;
  				}
  			},
  			(err) => {
  				this.notification.error('Error', err || 'Server error');
  			})
  	}
  }

  public productSelected(value){ //called when user selects a product

  	this.gastroElement.element.kind='product';
  	this.gastroElement.element.item = value.id;
  	this.gastroElement.cost = value.id.versions.unitCost;
  	this.gastroElement.name = value.id.versions.lang.name;
  	if(value.id.versions.netWeight) this.gastroElement.netWeight = value.id.versions.netWeight; else this.gastroElement.netWeight=0;

  	//Get product pricing rates
  	this.productService.getPricingRates(this.gastroElement.element.item._id).subscribe(
  		(data: any)=> {
  			this.productPricingRates=data;
  			if(data.length>0) {
  				this.gastroElement.price = data[0].price;
  				if(data[0]._id) this.gastroElement.pricingRate = data[0]._id;
  				else this.gastroElement.pricingRate = null;
  			} else {
  				this.gastroElement.price=0;
  				this.gastroElement.pricingRate = null;
  			}
  		},
  		(err) => {
  			this.notification.error('Error', err || 'Server error');
  		})
  }

	public elementRemoved(value, add){ //called when user removes dish, drink or product
		this.gastroElement.element.item = null;
	}

  dishSearchChanged(value) {
    this.dishSubject.next(value);
  }

  drinkSearchChanged(value) {
    this.drinkSubject.next(value);  	
  }

  productSearchChanged(value) {
    this.productSubject.next(value);  	
  }

	public populateFamilies() {
		this.menu.composition.forEach((element) => {
			element.family.forEach((fam)=>{
				if (fam._id == element.family) element.family=fam;
			})
		})
		this.familiesPopulated=true;
	}

	public populateSubfamilies(){
		this.menu.composition.forEach((element) => {
			element.family.subfamilies.forEach((subfam)=>{
				if (subfam._id == element.subfamily) element.subfamily=subfam;
			})
		})
		//this.subfamiliesPopulated=true;
	}

	public translation(){
		this.translate.get('searchBox.beginText').subscribe((res: string) => {
	    	this.searchBoxLabel = res;
	  	});
	}

	public getFamilies() {
    	//Get all subfamilies available for the ingredient's family
	    this.familyService.getFamily('gastroOffering', 10000, 0, '','','','',this.filterLocations).subscribe(
	      (data: any) => {
	        this.families = data.families;
	        console.log('Retrieved ' + this.families.length + ' families')

	        //Populate families and subfamilies composition list
      		this.menu.composition.forEach((element) => {
						this.families.forEach((fam, index)=>{
							if (fam._id == element.family){
								element.familyIndex=index;
								element.family=fam;
								this.families[index].subfamilies.forEach((subfam)=>{
									if (subfam._id == element.subfamily) element.subfamily=subfam;
								})
							} 
						})
					})
				  this.familiesPopulated=true;

				  //Set id of dishes with subfamily null
				  this.setSubfamilyId();

				  this.refresh();
	    });
  }

	public dishPricingRateSelected(index){ //called when user selects a dish
	
			this.gastroElement.price = this.dishPricingRates[index].price;
			if (this.dishPricingRates[index]._id) this.gastroElement.pricingRate = this.dishPricingRates[index]._id;
			else this.gastroElement.pricingRate=null;
	
	}

	public drinkPricingRateSelected(index){ //called when user selects a drink
		
			this.gastroElement.price = this.drinkPricingRates[index].price;
			if (this.drinkPricingRates[index]._id) this.gastroElement.pricingRate = this.drinkPricingRates[index]._id;
			else this.gastroElement.pricingRate=null;
		
	}

	public productPricingRateSelected(index){ //called when user selects a product
		
			this.gastroElement.price = this.productPricingRates[index].price;
			if (this.productPricingRates[index]._id) this.gastroElement.pricingRate = this.productPricingRates[index]._id;
			else this.gastroElement.pricingRate=null;
		
	}

	public familySelected(index) {

    this.gastroElement.family = JSON.parse(JSON.stringify(this.families[index]));
		this.subfamilies = this.families[index].subfamilies;
    this.gastroElement.familyIndex = index;
    this.gastroElement.subfamily =  {
	    	_id: -(parseInt(index)+1), //negative 'bogus' id that will change for each family to group dishes without subfamily
	    	lang : {
	    		name : 'none'
	    	}
	   }
	}

	public subFamilySelected(index){
	  	if(index<0) { //no subfamily selected
	  		this.gastroElement.subfamily._id = -(this.gastroElement.familyIndex+1); //Set a bogus subfamily id, that will be similar for all dishes in this family that do not have a subfamily assigned.
	  		this.gastroElement.subfamily.lang.name = 'none';
	  	} else {
      	this.gastroElement.subfamily = this.clone(this.subfamilies[index]);
      }
	}


	public saveElement(){

    //console.log(this.status,'status')

		if(this.status=='new'){

			if(this.totalElements>0) {

				let familyStartIndex=-1;
				//Get index of first family match
				this.menu.composition.some((element, index)=>{
					if (element.family._id == this.gastroElement.family._id) {
            //console.log(element,'element')
						familyStartIndex=index;
						return true; 
          }

				})
				//console.log('familyStartIndex: ' + familyStartIndex)
				if(familyStartIndex<0){ //no matches, add to end of list
					this.menu.composition.push(this.gastroElement);
				} 
				else 
				{ //there's a match, find subfamily
					let familyEndIndex, subfamilyEndIndex;
					
					let subfamilyMatch= false;
					
					for(var i=familyStartIndex; i<this.totalElements; i++){

						if (this.menu.composition[i].family._id == this.gastroElement.family._id) {
							
							familyEndIndex=i;
							
							if (this.menu.composition[i].subfamily._id == this.gastroElement.subfamily._id) { //subfamily match
								
								subfamilyMatch=true;
								subfamilyEndIndex=i;
							
							}
						}
					}
					
					if (subfamilyMatch) { //add dish as last subfamily dish


						if(this.gastroElement._id && (this.menu.composition[subfamilyEndIndex]._id == this.gastroElement._id)) {
							this.menu.composition.splice(subfamilyEndIndex,1, this.clone(this.gastroElement));
						}
						else {
							this.menu.composition.splice(subfamilyEndIndex+1,0, this.clone(this.gastroElement));
						}

					} else { 	//no subfamily match	


						if (this.gastroElement.subfamily._id < 0) { //If subfamily is negative (null) then add to first position of family

							if(this.menu.composition[familyEndIndex]._id == this.gastroElement._id)
								this.menu.composition.splice(familyEndIndex,1, this.clone(this.gastroElement));
							else
								this.menu.composition.splice(familyEndIndex+1 ,0, this.clone(this.gastroElement));

						} else {		
							this.menu.composition.splice(familyEndIndex+1,0, this.clone(this.gastroElement));
						}
					}
					//this.menu.composition.splice(this.gastroElementIndex+1,1);
				}

		} else {
			this.menu.composition.push(this.clone(this.gastroElement));
		}
		this.totalElements = this.menu.composition.length;
		this.refresh();

    let array=[]; 
    array=this.selectedCategoryOptions.map(x => { return x; }); 
    this.selectedCategoryOptions=array;  
		this.cleanAndResetFields();

	} else if(this.status=='edit') {

    if (this.gastroElement.family._id==this.gastroElementBeforeEdit.family._id && this.gastroElement.subfamily._id==this.gastroElementBeforeEdit.subfamily._id) {
      this.menu.composition[this.gastroElementIndex]= this.clone(this.gastroElement)
      this.refresh();

    } else {
  		this.menu.composition.splice(this.gastroElementIndex,1);
  		this.totalElements = this.menu.composition.length;
  		this.status='new';
  		this.saveElement();      
    }
    this.gastroElementBeforeEdit = null;
	}
}

	public deleteMenuElement() {
  	this.menu.composition.splice(this.gastroElementIndex,1);

  	this.totalElements = this.menu.composition.length;

  	if(this.totalElements>0)
  	{
  		this.refresh();

      let array=[]; 
      array=this.selectedCategoryOptions.map(x => { return x; }); 
      this.selectedCategoryOptions=array;

  		this.cleanAndResetFields();

  	} else {
	  		this.menu.totalCost=0;
        let array=[]; 
        array=this.selectedCategoryOptions.map(x => { return x; }); 
        this.selectedCategoryOptions=array;
  	}
	}

  public onCategorySelectChange() {
    let array=[];
    this.categoryOptions.map((option) => { if(option.active) array.push(option.value); });
    this.selectedCategoryOptions=array;
  }

	public setSubfamilyId(){
		//Sets a 'bogus' subfamily id to dishes with null subfamily id. The 'bogus' id is negative and common for 
		//dishes within the same family. This 'bogus' id is used to group by subfamily all dishes with null subfamily within family.
		//When saving the menu composition, negative subfamily ids are reset to null.

		//console.log(this.menu.composition, 'dish composition list before filtering')

		//Filter dishes with subfamily null
		var elementsWithSubfamilyNull = this.menu.composition.filter((element) =>{
			return element.subfamily==null;
		})

		//Filter drinks with subfamily null
		// var elementsWithSubfamilyNullDrink = this.menu.composition.filter((drink) =>{
		// 	return drink.subfamily==null;
		// })
		//console.log(dishesWithSubfamilyNull, 'dishes with subfamily null')

		//Set subfamily id based on position of family in families array
		  elementsWithSubfamilyNull.forEach((element) => {

			var familyIndex;

			//get index of family in families array. There has to be a match, the alternative is not possible if 
			//referential integrity is working corectly.
			this.families.find((family, index) => {
				if(element.family._id == family._id) familyIndex=index;
			})

			//console.log(familyIndex, 'family index position')

			//Set id based on family index. 
			// Same method is used when adding/editing a dish without subfamily and setting a (bogus) id.
			element.subfamily= {
		    	_id: -(familyIndex+1),
		    	lang : {
		    		name : 'none'
		    	}
	    } 
		})

		// elementsWithSubfamilyNullDrink.forEach((element) => {

		// 	var familyIndex;

		// 	//get index of family in families array. There has to be a match, the alternative is not possible if 
		// 	//referential integrity is working corectly.
		// 	this.families.find((family, index) => {
		// 		if(element.family._id == family._id) familyIndex=index;
		// 	})

		// 	//console.log(familyIndex, 'family index position')

		// 	//Set id based on family index. 
		// 	// Same method is used when adding/editing a dish without subfamily and setting a (bogus) id.
		// 	element.subfamily= {
		//     	_id: -(familyIndex+1),
		//     	lang : {
		//     		name : 'none'
		//     	}
	 //    } 
		// })
		//console.log(this.menu.composition, "composition after setSubfamilyId")
	}

	public tagFamilies(){
		//Sets familyInit and subfamilyInit tags and calculates number of families, subfamilies and items per subfamily and family.
		var previousFamilyId=null;
		var previousSubfamilyId=null;
		var familyLength = 0;
		var subfamilyLength = 0;
		var previousFamilyInitIndex=0;
		var previousSubfamilyInitIndex=0;
		var numFamilies=0;
		var numSubfamilies=0;
		var subfamilyId=0;

		//reset tags
		if(this.menu.composition.length>0) {

      this.menu.composition.map((element)=>{
        element.familyInit=false;
        element.subfamilyInit=false;
      });

      this.menu.composition.forEach((element, index)=>{
        familyLength++;
        subfamilyLength++;

        if(element.family._id!=previousFamilyId)  {
          numFamilies++;
          element.familyInit=true;
          element.familyId=numFamilies;
          if(index>0) {
            this.menu.composition[previousFamilyInitIndex].familyLength=familyLength-1;
            this.menu.composition[previousFamilyInitIndex].numSubfamilies=numSubfamilies;
          }
          familyLength=1;
          numSubfamilies=0;
          subfamilyId=0;
          previousFamilyId=element.family._id;
          previousFamilyInitIndex=index;
        }

        if(element.subfamily&&element.subfamily._id!=previousSubfamilyId)  {
          numSubfamilies++;
          element.subfamilyInit=true;
          if (!(element.subfamily._id<0)) subfamilyId++;
          element.subfamilyId=numFamilies+'.'+subfamilyId;
          if(index>0) {
            this.menu.composition[previousSubfamilyInitIndex].subfamilyLength=subfamilyLength-1;
          }
          subfamilyLength=1;
          previousSubfamilyId=element.subfamily._id;
          previousSubfamilyInitIndex=index;
        }      
      })

			//Add length of last family and subfamily item
			this.menu.composition[previousFamilyInitIndex].familyLength=familyLength;
			this.menu.composition[previousFamilyInitIndex].numSubfamilies=numSubfamilies;
			this.menu.composition[previousSubfamilyInitIndex].subfamilyLength=subfamilyLength;
		}
		this.numFamilies=numFamilies;
	}

	public tagUpAndDownArrows(){
		var subfamilyLength;
		var subfamilyIndex;
		var familyLength;
		var familyIndex;
		var numSubfamilies;
		var previousSubfamilyId=null;
		var families = this.numFamilies;

		//reset up and down tags
		this.menu.composition.map((element)=>{
			element.dishDown=false;
			element.dishUp=false;
			element.subfamilyDown=false;
			element.subfamilyUp=false;
			element.familyDown=false;
			element.familyUp=false;
		})

		this.menu.composition.forEach((element, index) => {

			//Tag dishes
			if(element.subfamilyInit){
				subfamilyLength=element.subfamilyLength;
				subfamilyIndex=element.subfamilyLength;
				if(subfamilyLength>1)  { 
					element.dishDown=true;
					element.dishUp=false;
				} else {
					element.dishDown=false;
					element.dishUp=false;
				}
			} else {
				if (subfamilyIndex>1) {
					element.dishDown=true;
					element.dishUp=true;
				} else {
					element.dishDown=false;
					element.dishUp=true;
				}
			}
			subfamilyIndex--;

			//Tag subfamilies			
			if(element.familyInit){
				if ((element.subfamily._id<0)&&(element.numSubfamilies>1)) { //first subfamily is null
						familyLength=element.numSubfamilies-1;
						familyIndex=element.numSubfamilies-1;
				} else {  //first subfamily is not null
						familyLength=element.numSubfamilies;
						familyIndex=element.numSubfamilies;
						if(familyLength>1)  { 
							element.subfamilyDown=true;
							element.subfamilyUp=false;
					} else {
							element.subfamilyDown=false;
							element.subfamilyUp=false;
						}
					}
			} else {			
				if ((previousSubfamilyId<0)&&element.subfamilyInit&&!(element.subfamily._id<0)) { //previous subfamily was null
						if(familyLength>1)  { 
							element.subfamilyDown=true;
							element.subfamilyUp=false;
						} else {
							element.subfamilyDown=false;
							element.subfamilyUp=false;
						}				
				} else {
						if (element.subfamilyInit&&!(element.subfamily._id<0)) {
							if (familyIndex>1) {
								element.subfamilyDown=true;
								element.subfamilyUp=true;
							} else {
								element.subfamilyDown=false;
								element.subfamilyUp=true;
							}
						}
				}
			}			
      //console.log(element,'ELEMENT:SUBFAMILY NULL')
			if(element.subfamilyInit&&!(element.subfamily&&element.subfamily._id<0)) familyIndex--;
			previousSubfamilyId=element.subfamily._id;

			//Tag families
			if(element.familyInit){
				if(index==0) { //First family
					if(families>1) {
						element.familyUp=false;
						element.familyDown=true;
					} else {
						element.familyUp=false;
						element.familyDown=false;
					}
				} else {
					if (families>1) {
						element.familyDown=true;
						element.familyUp=true;
					} else {
						element.familyDown=false;
						element.familyUp=true;
					}
				}
				families--;
			}
		})
	}

	public calculateCosts(){
		this.menu.composition.forEach((element)=>{
			element.totalCost=element.cost*element.numServings;
		})
	}

	public CostsForDailyMenuAndFixedPriceCartes() {
    var previousFamilyInitIndex = 0;
    var previousSubfamilyInitIndex = 0;
    var subfamilyTotalCost = 0;
    var familyTotalCost = 0;

    var meanCost = 0;

    if (this.totalElements > 0) {
      this.menu.composition.forEach((element, index) => {
        if (element.subfamilyInit) {
          if (index > 0) {
            this.menu.composition[previousSubfamilyInitIndex].subfamilyMeanCost = subfamilyTotalCost;

            if (this.menuType == "dailyMenuCarte") {
              this.menu.composition[previousSubfamilyInitIndex].subfamilyMeanCost /= this.menu.composition[previousSubfamilyInitIndex].subfamilyLength;
            }
            familyTotalCost += this.menu.composition[previousSubfamilyInitIndex].subfamilyMeanCost;
          }
          subfamilyTotalCost = element.totalCost;
          previousSubfamilyInitIndex = index;
        } else {
          subfamilyTotalCost += element.totalCost;
        }

        if (element.familyInit) {
          if (index > 0) {
            this.menu.composition[previousFamilyInitIndex].familyMeanCost = familyTotalCost;

            if (this.menuType == "dailyMenuCarte") {
              this.menu.composition[previousFamilyInitIndex].familyMeanCost /= this.menu.composition[previousFamilyInitIndex].numSubfamilies;
            }
            meanCost += this.menu.composition[previousFamilyInitIndex].familyMeanCost;
          }
          familyTotalCost = 0;
          previousFamilyInitIndex = index;
        }
      });

      //Add mean cost of last family and subfamily item
      this.menu.composition[previousSubfamilyInitIndex].subfamilyMeanCost = subfamilyTotalCost;

      if (this.menuType == "dailyMenuCarte") {
        this.menu.composition[previousSubfamilyInitIndex].subfamilyMeanCost /= this.menu.composition[previousSubfamilyInitIndex].subfamilyLength;
      }
      familyTotalCost += this.menu.composition[previousSubfamilyInitIndex]
        .subfamilyMeanCost;
      this.menu.composition[previousFamilyInitIndex].familyMeanCost = familyTotalCost;

      if (this.menuType == "dailyMenuCarte") {
        this.menu.composition[previousFamilyInitIndex].familyMeanCost /= this.menu.composition[previousFamilyInitIndex].numSubfamilies;
      }
      meanCost += this.menu.composition[previousFamilyInitIndex].familyMeanCost;
    } else {
      meanCost = 0;
    }

    this.menu.totalCost = meanCost;
    //console.log(this.menu.totalCost,'totalCost')
  }

	public calculateSumOfCosts(){
		var sumOfCosts = 0;
		
		if(this.totalElements>0) {
			this.menu.composition.forEach((element, index)=> {
				sumOfCosts+=element.totalCost;
			})
		}

		this.menu.totalCost=sumOfCosts;
	}

	public calculateMaxMinTotals(){
		var previousFamilyId=null;
		var maxCost;
		var minCost;
		var costArray=[];
		var totalMinCost=0;
		var totalMaxCost=0;

		if(this.totalElements>0) {
			this.menu.composition.forEach((element) => {
				if(element.family._id!=previousFamilyId) {
					if(previousFamilyId!=null) { //not first time
						let costObj = {
							minCost: minCost,
							maxCost: maxCost
						}
						costArray.push(costObj);
						previousFamilyId=element.family._id;
					} else {
						previousFamilyId=element.family._id;
					}
					maxCost=element.totalCost;
					minCost=element.totalCost;
				} else {
					if (element.totalCost>maxCost) maxCost=element.totalCost;
					if (element.totalCost<minCost) minCost=element.totalCost;
					previousFamilyId=element.family._id;
				}
			})

			//Add last family max and min costs
			let costObj = {
				minCost: minCost,
				maxCost: maxCost
			}
			costArray.push(costObj);

			//Add up min and max costs
			costArray.forEach((item)=>{
				totalMaxCost+=item.maxCost;
				totalMinCost+=item.minCost;
			})
			this.menu.maxCost=totalMaxCost;
			this.menu.minCost=totalMinCost;

		} else { //totalElements is zero
			this.menu.maxCost=null;
			this.menu.minCost=null;
		}
	}

	public onChangeCategory(e){

		this.gastroElement = new GastroElement();

		if(e.value=='drink'){
			this.gastroElement.element.kind = 'drink';
			this.activeDrink=[];
			this.drinkPricingRates=[];
		} else if(e.value=='dish'){
			this.gastroElement.element.kind = 'dish';
			this.activeDish=[];
			this.dishPricingRates=[];
		}

		this.productPricingRates=[];

		this.familyService.getFamily('gastroOffering', 10000, 0, '','','','',this.filterLocations).subscribe(
			(data: any) => {
				this.families = data.families;

				//reset families
				if(this.families&&this.families.length>0) {
					this.gastroElement.family= this.families[0];
					if(this.families[0].subfamilies&&this.families[0].subfamilies.length>0) {
						this.subfamilies=this.families[0].subfamilies;
						//this.menuDish.subfamily=this.subfamilies[0];
					} else {
						this.subfamilies=[];
					}
					this.gastroElement.subfamily= {
						_id: -1,
						lang : {
							name : 'none'
						}
					}	  
				}				
			});	
	}

  public cleanAndResetFields(){

	  //reset families
	  if(this.families&&this.families.length>0) {
		    //this.gastroElement.family= this.families[0];
		    if(this.families[0].subfamilies&&this.families[0].subfamilies.length>0) {
		      this.subfamilies=this.families[0].subfamilies;
		      //this.menuDish.subfamily=this.subfamilies[0];
		    } else {
		    	this.subfamilies=[];
		    }
			}
	}

	public addClick() {
		this.gastroElement = new GastroElement();
		this.gastroElement.family=this.families[0];

    this.gastroElement.subfamily= {
	    	_id: -1,
	    	lang : {
	    		name : 'none'
	    	}
    }			
		// this.gastroElement.subfamily._id=null;
		// this.gastroElement.pricingRate._id=null;

		if(this.menuType=='catalog') {
			this.gastroElement.element.kind="product"
		} else {
			this.gastroElement.element.kind="dish"
		}

		this.activeDish=[];
		this.activeDrink=[];
  	this.activeProduct=[];

  	this.dishPricingRates=[];
  	this.drinkPricingRates=[];
  	this.productPricingRates=[];

		this.status='new';

		this.cleanAndResetFields();

	}

	public editClick() {
		this.status='edit';
	}

	public viewClick() {
		this.status='view';		
	}

  public selectElementToDelete(gastroElement, index){

      this.gastroElementIndex = this.menu.composition.indexOf(gastroElement);  

    }

	public selectElementToEdit(gastroElement, index){
    this.gastroElementBeforeEdit = JSON.parse(JSON.stringify(gastroElement));
		this.gastroElement = JSON.parse(JSON.stringify(gastroElement));
    this.gastroElementIndex = this.menu.composition.indexOf(gastroElement);  

		this.families.find((fam, i) => {
			if (fam._id == this.gastroElement.family._id) {
				this.subfamilies = this.families[i].subfamilies;
			}
		});

		//Set activeDish or activeDrink
		if(this.gastroElement.element.kind == 'dish') {
			this.activeDish=[]
			let dishObj = {
				id: this.gastroElement.element.item,
				text: this.gastroElement.name
			}
			this.activeDish.push(dishObj)

		} else if (this.gastroElement.element.kind == 'drink') {
			this.activeDrink=[]
			let drinkObj = {
				id: this.gastroElement.element.item,
				text: this.gastroElement.name
			}
			this.activeDrink.push(drinkObj)
		 
		} else {  //product
			this.activeProduct=[]
			let productObj = {
				id: this.gastroElement.element.item,
				text: this.gastroElement.name
			}
			this.activeProduct.push(productObj)		}


		if(this.menuType=='catalog') {  //catalog has products

			//Get product pricing rates
			this.productService.getPricingRates(this.gastroElement.element.item._id).subscribe(
				(data: any)=> {
					this.productPricingRates=data;
				},
				(err) => {
					this.notification.error('Error', err || 'Server error');
				})
		} else { //all other gastro offerings have dishes or drinks

			if(this.gastroElement.element.kind == 'dish'){
				//Get dish pricing rates
				if(this.menuType=='carte' || this.menuType=='fixedPriceCarte') {
					this.dishService.getPricingRates(this.gastroElement.element.item._id).subscribe(
						(data: any)=> {
							this.dishPricingRates=data;
						},
						(err) => {
							this.notification.error('Error', err || 'Server error');
						})
				}
			} else if(this.gastroElement.element.kind == 'drink'){

				if(this.menuType=='carte' || this.menuType=='fixedPriceCarte') {
					this.drinkService.getPricingRates(this.gastroElement.element.item._id).subscribe(
						(data: any)=> {
							this.drinkPricingRates=data;
						},
						(err) => {
							this.notification.error('Error', err || 'Server error');
						})
				}
			}
		}
		//Save index position for editing later
		//this.gastroElementIndex = index;
	}

  public viewDish(menuDish,tab){
  	let mode;
    let _id=menuDish.element.item._id;

    this.dishService.getActiveVersion(_id).subscribe(
        (data: any)=> {
        let _versionId=data[0].versions._id;

        //Save redirect data
        if(this.viewMode) mode = 'view'; else mode = 'edit';

        switch (this.menuType) {
		      case 'menu':
        		this.compassService.saveRedirectData('gastro-offering/menus',this.id, this.versionId, mode)
		        break;
		      case 'dailyMenuCarte':
        		this.compassService.saveRedirectData('gastro-offering/daily-menu-cartes',this.id, this.versionId, mode)
		        break;
		      case 'buffet':
        		this.compassService.saveRedirectData('gastro-offering/buffets',this.id, this.versionId, mode)
		        break;  
		      case 'carte':
        		this.compassService.saveRedirectData('gastro-offering/cartes',this.id, this.versionId, mode)
		        break;
		      case 'fixedPriceCarte':
        		this.compassService.saveRedirectData('gastro-offering/fixed-price-cartes',this.id, this.versionId, mode)
		        break;
		      default:
		        // code...
		        break;
		    }

        this.router.navigate(['./recipes/dishes/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'dish'}]);
        })
   }

   public viewDrink(menuDrink,tab){
  	let mode;
    let _id=menuDrink.element.item._id;

    this.drinkService.getActiveVersion(_id).subscribe(
        (data: any)=> {
        let _versionId=data[0].versions._id;

        //Save redirect data
        if(this.viewMode) mode = 'view'; else mode = 'edit';

        switch (this.menuType) {
		      case 'menu':
        		this.compassService.saveRedirectData('gastro-offering/menus',this.id, this.versionId, mode)
		        break;
		      case 'dailyMenuCarte':
        		this.compassService.saveRedirectData('gastro-offering/daily-menu-cartes',this.id, this.versionId, mode)
		        break;
		      case 'buffet':
        		this.compassService.saveRedirectData('gastro-offering/buffets',this.id, this.versionId, mode)
		        break;  
		      case 'carte':
        		this.compassService.saveRedirectData('gastro-offering/cartes',this.id, this.versionId, mode)
		        break;
		      case 'fixedPriceCarte':
        		this.compassService.saveRedirectData('gastro-offering/fixed-price-cartes',this.id, this.versionId, mode)
		        break;
		      default:
		        // code...
		        break;
		    }

        this.router.navigate(['./recipes/drinks/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'drink'}]);
        })
   }

   public viewProduct(menuProduct,tab){
   	let mode;
    let _id=menuProduct.element.item._id;
    this.productService.getActiveVersion(_id).subscribe(
        (data: any)=> {
        let _versionId=data[0].versions._id;

        //Save redirect data
        if(this.viewMode) mode = 'view'; else mode = 'edit';

        switch (this.menuType) {
		      case 'catalog':
        		this.compassService.saveRedirectData('gastro-offering/catalogs',this.id, this.versionId, mode)
		        break;
	      
		      default:
		        // code...
		        break;
		    }

        this.router.navigate(['./recipes/products/',_id, {versionId: _versionId, tab: 'product'}]);
        })
   }

  public viewMenuVersion(composition){
      let _id=composition.element.item._id;
      this.menuService.getActiveVersion(_id).subscribe(
            (data: any)=> {
            let _versionId=data[0].versions._id;
            this.router.navigate(['./recipes/menus/',_id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
            })

  }

  public moveElementUp(gastroElement,index){


  	let element=JSON.parse(JSON.stringify(gastroElement));

  	//delete object in position index
		this.menu.composition.splice(index,1);

		//insert object in new position 
		this.menu.composition.splice(index-1,0,element);

		this.refresh();

  }

  public moveElementDown(gastroElement,index){
  	
  	let element=JSON.parse(JSON.stringify(gastroElement));

  	//delete object in position index
		this.menu.composition.splice(index,1);

		//insert object in new position 
		this.menu.composition.splice(index+1,0,element);

		this.refresh();
  }

  public moveSubfamilyUp(gastroElement,index){
  	
  	var subfamilyLength=gastroElement.subfamilyLength;
  	var previousSubfamilyLength;

  	//Get previous subfamily length
  	for (var i=index-1; i=>0; i--) {
  		if(this.menu.composition[i].subfamilyInit) {
  			previousSubfamilyLength=this.menu.composition[i].subfamilyLength;
  			break;
  		}
  	}

  	//Move row positions up
  	for (var i=0; i<subfamilyLength; i++) {
  		let element=this.clone(this.menu.composition[index+i]);
			
			//delete object in position index
			this.menu.composition.splice(index+i,1);

			//insert object in new position 
			this.menu.composition.splice(index-previousSubfamilyLength+i,0,element);
  	}

		this.refresh();
  }

  public moveSubfamilyDown(gastroElement,index){
		var subfamilyLength=gastroElement.subfamilyLength;
  	
  	var nextSubfamilyLength=this.menu.composition[index+subfamilyLength].subfamilyLength;

  	//Move row positions down
  	for (var i=0; i<subfamilyLength; i++) {
  		let element=this.clone(this.menu.composition[index]);
			
			//delete object in position index
			this.menu.composition.splice(index,1);

			//insert object in new position 
			this.menu.composition.splice(index+subfamilyLength+nextSubfamilyLength-1,0,element);
  	}

		this.refresh();
  }

  public moveFamilyUp(gastroElement,index){
		var familyLength=gastroElement.familyLength;
  	var previousFamilyLength;

  	//Get previous subfamily length
  	for (var i=index-1; i=>0; i--) {
  		if(this.menu.composition[i].familyInit) {
  			previousFamilyLength=this.menu.composition[i].familyLength;
  			break;
  		}
  	}

  	//Move row positions up
  	for (var i=0; i<familyLength; i++) {
  		let element=this.clone(this.menu.composition[index+i]);
			
			//delete object in position index
			this.menu.composition.splice(index+i,1);

			//insert object in new position 
			this.menu.composition.splice(index-previousFamilyLength+i,0,element);
  	}

		this.refresh();
  }

  public moveFamilyDown(gastroElement,index){
		var familyLength=gastroElement.familyLength;
  	
  	var nextFamilyLength=this.menu.composition[index+familyLength].familyLength;

  	//Move row positions down
  	for (var i=0; i<familyLength; i++) {
  		let element=this.clone(this.menu.composition[index]);
			
			//delete object in position index
			this.menu.composition.splice(index,1);

			//insert object in new position 
			this.menu.composition.splice(index+familyLength+nextFamilyLength-1,0,element);
  	}

		this.refresh();
  }

  public refresh(){
  	//Tag families and subfamilies init
    this.tagFamilies();

    //Calculate cost
    this.calculateCosts();

    switch (this.menuType) {
      case 'menu':
        this.calculateSumOfCosts();
        break;
      case 'buffet':
        this.calculateSumOfCosts();
        break;  
      case 'carte':
        this.calculateSumOfCosts();
        break;
      case 'dailyMenuCarte':
      case 'fixedPriceCarte':
        this.CostsForDailyMenuAndFixedPriceCartes();
        break;
      
      default:
        // code...
        break;
    } 

    //Tag up and down arrows
    this.tagUpAndDownArrows();

    //Force refresh of list view
    let composition = [];

    this.menu.composition.forEach((compElement) => {
    	composition.push(JSON.parse(JSON.stringify(compElement)))
    })

    this.menu.composition = composition;

  }

  public searchMenus(filterText){ 
    this.filterText = filterText;
  }

}
