import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductsService } from "../../../recipes/products/products.service";
import { DishService } from "../../../recipes/dishes/dish.service";
import { DrinkService } from "../../../recipes/drinks/drink.service";
import { IngredientsService} from "../../../articles/ingredients/ingredients.service"
import { PackagingsService} from "../../../articles/packagings/packagings.service"
import { SubproductsService } from "../../../recipes/subproducts/subproducts.service";
import { ActivatedRoute, Router } from '@angular/router'; 
import { Observable } from 'rxjs/Observable';
import { NotificationsService } from 'angular2-notifications'
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from "../../../global-utils/services/compass.service";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'where-is-included',
  templateUrl: './where-is-included.component.html',
  styleUrls: ['./where-is-included.component.scss']
})

export class WhereIsIncludedComponent {
	@Input() public id;
	@Input() public versionId;
	@Input() public type; 
	@Output() public redirectOn: EventEmitter<any>;

	public filterLocations;
	public tab;
	public viewMode: boolean=false;
	public mode;
	public orderBy: string = '';
	public allGastroOffers;
	public totalElements;
	public allElements;
	public subproducts = [];
	public products = [];
	public dishes = [];
	public drinks = [];
	// public gastroOfferContainSubproducts = []
	// public gastroOfferContainIngredients = []
	public totalItems: number;
  public currentPage: number; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public numPages: number;
  public searchBoxLabel: string
  public deleteIngredientInRecipeTitle
  public deleteIngredientInRecipeContent
  public deleteSubproductInRecipeTitle
  public deleteSubproductInRecipeContent
  public deletePackagingInRecipeTitle
  public deletePackagingInRecipeContent
  public deleteProductInGastroOfferTitle
  public deleteProductInGastroOfferContent
  public deleteDishInGastroOfferTitle
  public deleteDishInGastroOfferContent
  public deleteDrinkInGastroOfferTitle
  public deleteDrinkInGastroOfferContent
  public deleteAllIngredientInRecipeTitle
  public deleteAllIngredientInRecipeContent
  public deleteAllSubproductInRecipeTitle
  public deleteAllSubproductInRecipeContent
  public deleteAllPackagingInRecipeTitle
  public deleteAllPackagingInRecipeContent
  public deleteAllProductInGastroOfferTitle
  public deleteAllProductInGastroOfferContent
  public deleteAllDishInGastroOfferTitle
  public deleteAllDishInGastroOfferContent
  public deleteAllDrinkInGastroOfferTitle
  public deleteAllDrinkInGastroOfferContent
  public parentIndex: number;
  public parentType:string;
  public loading: boolean = false;
  public updating:boolean = false;
  public backUrl;
  public observerLocation;
  public savedLocations = [];

  constructor(
  		public route: ActivatedRoute,
  		public productService: ProductsService, 
  		public dishService: DishService, 
  		public drinkService: DrinkService, 
  		public notification: NotificationsService, 
  		public router : Router, 
  		public ingredientService : IngredientsService, 
  		public subproductService: SubproductsService,
  		public packagingService: PackagingsService, 
  		public translate: TranslateService,
  		public compassService: CompassService,
      public costFilterService: CostFilterService
  ) {
  	  	this.redirectOn = new EventEmitter();
  }

  ngOnInit() {
  	this.loading = true;
  	this.updating = false
  	this.translation();

  	this.route.data.subscribe((data: {viewMode:boolean}) => {
			if(data.viewMode)  this.viewMode = data.viewMode;
			if (this.viewMode) this.mode='view'
		});

		this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data); 
        this.getItems();
    })

  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public getItems(){

  	switch(this.type){

  		case('dish'):
				this.currentPage = this.dishService.getCurrentPageWhereIs();
	      this.itemsPerPage = this.dishService.getItemsPerPageWhereIs();
	      this.filterText = this.dishService.getSearchFilterWhereIs();
	      this.backUrl = '/recipes/dishes/'
				this.getDishInGastroOffers();
  		break;

  		case('drink'):
				this.currentPage = this.drinkService.getCurrentPageWhereIs();
	      this.itemsPerPage = this.drinkService.getItemsPerPageWhereIs();
	      this.filterText = this.drinkService.getSearchFilterWhereIs();
	      this.backUrl = '/recipes/drinks/'
				this.getDrinkInGastroOffers();
  		break;

  		case('product'):
				this.currentPage = this.productService.getCurrentPageWhereIs();
	      this.itemsPerPage = this.productService.getItemsPerPageWhereIs();
	      this.filterText = this.productService.getSearchFilterWhereIs();
	      this.backUrl = '/recipes/products/'
				this.getProductInGastroOffers();
  		break;

  		case('subproduct'):
				this.currentPage = this.subproductService.getCurrentPageWhereIs();
	      this.itemsPerPage = this.subproductService.getItemsPerPageWhereIs();
	      this.filterText = this.subproductService.getSearchFilterWhereIs();
 	      this.backUrl = '/recipes/subproducts/'
				this.getSubproductInRecipes();
  		break;  	

  		case('ingredient'):
				this.currentPage = this.ingredientService.getCurrentPageWhereIs();
	      this.itemsPerPage = this.ingredientService.getItemsPerPageWhereIs();
	      this.filterText = this.ingredientService.getSearchFilterWhereIs();
 	      this.backUrl = '/articles/ingredients/'
				this.getIngredientInRecipes();
  		break; 

  		case('packaging'):
				this.currentPage = this.packagingService.getCurrentPageWhereIs();
	      this.itemsPerPage = this.packagingService.getItemsPerPageWhereIs();
	      this.filterText = this.packagingService.getSearchFilterWhereIs();
 	      this.backUrl = '/articles/packagings/'
				this.getPackagingInProducts();
  		break; 
  	}

  }

  public translation(){

  	this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translate.get('whereis.notifications.deleteIngredientInRecipeTitle').subscribe((res:string)=>{
    	this.deleteIngredientInRecipeTitle = res;
    })

    this.translate.get('whereis.notifications.deleteIngredientInRecipeContent').subscribe((res:string)=>{
    	this.deleteIngredientInRecipeContent = res;
    })

    this.translate.get('whereis.notifications.deleteSubproductInRecipeTitle').subscribe((res:string)=>{
    	this.deleteSubproductInRecipeTitle = res;
    })

    this.translate.get('whereis.notifications.deleteSubproductInRecipeContent').subscribe((res:string)=>{
    	this.deleteSubproductInRecipeContent = res;
    })

    this.translate.get('whereis.notifications.deletePackagingInRecipeTitle').subscribe((res:string)=>{
    	this.deletePackagingInRecipeTitle = res;
    })

    this.translate.get('whereis.notifications.deletePackagingInRecipeContent').subscribe((res:string)=>{
    	this.deletePackagingInRecipeContent = res;
    })

    this.translate.get('whereis.notifications.deleteProductInGastroOfferTitle').subscribe((res:string)=>{
    	this.deleteProductInGastroOfferTitle = res;
    })

    this.translate.get('whereis.notifications.deleteProductInGastroOfferContent').subscribe((res:string)=>{
    	this.deleteProductInGastroOfferContent = res;
    })

    this.translate.get('whereis.notifications.deleteDishInGastroOfferTitle').subscribe((res:string)=>{
    	this.deleteDishInGastroOfferTitle = res;
    })

    this.translate.get('whereis.notifications.deleteDishInGastroOfferContent').subscribe((res:string)=>{
    	this.deleteDishInGastroOfferContent = res;
    })

    this.translate.get('whereis.notifications.deleteDrinkInGastroOfferTitle').subscribe((res:string)=>{
    	this.deleteDrinkInGastroOfferTitle = res;
    })

    this.translate.get('whereis.notifications.deleteDrinkInGastroOfferContent').subscribe((res:string)=>{
    	this.deleteDrinkInGastroOfferContent = res;
    })

    this.translate.get('whereis.notifications.deleteAllDrinkInGastroOfferTitle').subscribe((res:string)=>{
    	this.deleteAllDrinkInGastroOfferTitle = res;
    })

    this.translate.get('whereis.notifications.deleteAllDrinkInGastroOfferContent').subscribe((res:string)=>{
    	this.deleteAllDrinkInGastroOfferContent = res;
    })

    this.translate.get('whereis.notifications.deleteAllDishInGastroOfferTitle').subscribe((res:string)=>{
    	this.deleteAllDishInGastroOfferTitle = res;
    })

    this.translate.get('whereis.notifications.deleteAllDishInGastroOfferContent').subscribe((res:string)=>{
    	this.deleteAllDishInGastroOfferContent = res;
    })


    this.translate.get('whereis.notifications.deleteAllProductInGastroOfferTitle').subscribe((res:string)=>{
    	this.deleteAllProductInGastroOfferTitle = res;
    })
    
    this.translate.get('whereis.notifications.deleteAllProductInGastroOfferContent').subscribe((res:string)=>{
    	this.deleteAllProductInGastroOfferContent = res;
    })
    
    this.translate.get('whereis.notifications.deleteAllPackagingInRecipeTitle').subscribe((res:string)=>{
    	this.deleteAllPackagingInRecipeTitle = res;
    })
    
    this.translate.get('whereis.notifications.deleteAllPackagingInRecipeContent').subscribe((res:string)=>{
    	this.deleteAllPackagingInRecipeContent = res;
    })

    this.translate.get('whereis.notifications.deleteAllSubproductInRecipeTitle').subscribe((res:string)=>{
    	this.deleteAllSubproductInRecipeTitle = res;
    })
    
    this.translate.get('whereis.notifications.deleteAllSubproductInRecipeContent').subscribe((res:string)=>{
    	this.deleteAllSubproductInRecipeContent = res;
    })

    this.translate.get('whereis.notifications.deleteAllIngredientInRecipeTitle').subscribe((res:string)=>{
    	this.deleteAllIngredientInRecipeTitle = res;
    })
    
    this.translate.get('whereis.notifications.deleteAllIngredientInRecipeContent').subscribe((res:string)=>{
    	this.deleteAllIngredientInRecipeContent = res;
    })

  }

	public getDishInGastroOffers(){
		this.updating=true;

		this.dishService.getDishIncludedInGastroOffers(this.id, this.itemsPerPage,this.currentPage-1, this.filterText, this.sortField, this.sortOrder, this.filterLocations).subscribe(
			(data:any)=>{
				//console.log(data)
					this.allGastroOffers = data[0].gastroOffers;
					if(this.parentIndex && this.parentType == 'gastroOffer') this.allGastroOffers[this.parentIndex].expanded = true;
					this.totalElements = data[0].totalElements;
					this.totalItems = 0
					this.loading = false;
          this.updating = false;
					//console.log(this.allGastroOffers,'allGastroOffersDishes')
		},(err)=>{
			this.notification.error('Error', err || 'Error');
		})
	}

	public getDrinkInGastroOffers(){
		this.updating=true;

		this.drinkService.getDrinkIncludedInGastroOffers(this.id, this.itemsPerPage,this.currentPage-1, this.filterText, this.sortField, this.sortOrder, this.filterLocations).subscribe(
			(data:any)=>{
				//console.log(data)
					this.allGastroOffers = data[0].gastroOffers;
					if(this.parentIndex && this.parentType == 'gastroOffer') this.allGastroOffers[this.parentIndex].expanded = true;
					this.totalElements = data[0].totalElements;
					this.totalItems = 0
					this.loading = false;
          this.updating = false;
					//console.log(this.allGastroOffers,'allGastroOffersDrinks')
		},(err)=>{
			this.notification.error('Error', err || 'Error');
		})
	}

	public getProductInGastroOffers(){
		this.updating=true;

		this.productService.getProductIncludedInGastroOffers(this.id, this.itemsPerPage,this.currentPage-1, this.filterText, this.sortField, this.sortOrder, this.filterLocations).subscribe(
			(data:any)=>{
					this.allGastroOffers = data[0].gastroOffers;
					if(this.parentIndex && this.parentType == 'gastroOffer') this.allGastroOffers[this.parentIndex].expanded = true;
					this.totalElements = data[0].totalElements;
					this.totalItems = 0
					this.loading = false;
          this.updating = false;
					//console.log(this.allGastroOffers,'allGastroOffersProducts')
		},(err)=>{
			this.notification.error('Error', err || 'Error');
		})
	}

	public viewGastroOffer(gastroOffer, versionId){
			var url;
			
			if(gastroOffer.type == "carte") url='./gastro-offering/cartes/'
			else if(gastroOffer.type == "menu") url='./gastro-offering/menus/'
			else if(gastroOffer.type == "dailyMenuCarte") url='./gastro-offering/daily-menu-cartes/'
			else if(gastroOffer.type == "buffet") url='./gastro-offering/buffets/'
			else if(gastroOffer.type == "fixedPriceCarte") url='./gastro-offering/fixed-price-cartes/'
			else if(gastroOffer.type == "catalog") url='./gastro-offering/catalogs/'

	  	this.redirectOn.emit(true);
			this.compassService.saveRedirectData(this.backUrl,this.id, this.versionId, 'view');

			this.router.navigate([ url, gastroOffer._id, {versionId: versionId}])
	}

	public getIngredientInRecipes(){
		this.updating=true;
    this.subproducts = [];
    this.products = [];
    this.dishes = [];
    this.drinks = [];

    this.ingredientService.getIngredientIncludedInRecipes(this.id, this.itemsPerPage,this.currentPage-1, this.filterText, this.sortField, this.sortOrder, this.filterLocations).subscribe(
      (data:any)=>{
        //console.log(data,'data')
          //this.cleanArrays();
					this.allElements = data.elements;
					this.totalElements = data.totalElements;
          this.allElements.map((element)=> {
            if (element.type == 'Subproduct') this.subproducts.push(element)
            if (element.type == 'Product') this.products.push(element)
            if (element.type == 'Dish') this.dishes.push(element)
            if (element.type == 'Drink' ) this.drinks.push(element)
          })           
          
					console.log(this.allElements.length,'allElementsIngredients.length')
					// this.subproducts = this.allElements.subproducts
					if(this.parentIndex && this.parentType == 'Subproduct') this.subproducts[this.parentIndex].expanded = true;
					console.log(this.subproducts.length,'subproducts.length')

					// this.products=this.allElements.products;
					if(this.parentIndex && this.parentType == 'Product') this.products[this.parentIndex].expanded = true;
					console.log(this.products.length,'products.length')

					// this.dishes=this.allElements.dishes;
					if(this.parentIndex && this.parentType == 'Dish') this.dishes[this.parentIndex].expanded = true;
				  console.log(this.dishes.length,'dishes.length')

					// this.drinks=this.allElements.drinks;
					if(this.parentIndex && this.parentType == 'Drink') this.drinks[this.parentIndex].expanded = true;
					console.log(this.drinks.length,'drinks.length')

					this.loading = false;
          this.updating = false;

		},(err)=>{
			this.notification.error('Error', err || 'Error');
		})

	}

	public getSubproductInRecipes(){
		this.updating=true;

		this.subproductService.getSubproductIncludedInRecipes(this.id, this.itemsPerPage,this.currentPage-1, this.filterText, this.sortField, this.sortOrder, this.filterLocations).subscribe(
			(data:any)=>{
					//this.cleanArrays();
					this.allElements = data[0];
					this.totalElements = data[0].totalElements;
					this.totalItems = 0
					//console.log(this.allElements,'allElementsSubproducts')
					this.subproducts = this.allElements.subproducts
					if(this.parentIndex && this.parentType == 'subproduct') this.subproducts[this.parentIndex].expanded = true;
					//console.log(this.subproducts,'subproducts')


					this.products=this.allElements.products;
					if(this.parentIndex && this.parentType == 'product') this.products[this.parentIndex].expanded = true;
					//console.log(this.products,'products')


					this.dishes=this.allElements.dishes;
					if(this.parentIndex && this.parentType == 'dish') this.dishes[this.parentIndex].expanded = true;
				  //console.log(this.dishes,'dishes')


					this.drinks=this.allElements.drinks;
					if(this.parentIndex && this.parentType == 'drink') this.drinks[this.parentIndex].expanded = true;
					//console.log(this.drinks,'drinks')

					this.loading = false;
          this.updating = false;

		},(err)=>{
			this.notification.error('Error', err || 'Error');
		})
	}

	public getPackagingInProducts(){
		this.updating = true

		this.packagingService.getPackagingIncludedInProducts(this.id, this.itemsPerPage,this.currentPage-1, this.filterText, this.sortField, this.sortOrder, this.filterLocations).subscribe(
			(data:any)=>{
				//console.log(data,'data')
					this.allElements = data[0];
					this.totalElements = data[0].totalElements;
					this.totalItems = 0
					//console.log(this.allElements,'allElementsPackaging')
					this.products=this.allElements.products;
					if(this.parentIndex && this.parentType == 'product') this.products[this.parentIndex].expanded = true;
					//console.log(this.products,'products')
					this.loading = false;
          this.updating = false;
		},(err)=>{
			this.notification.error('Error', err || 'Error');
		})
	}

	public viewElement(elementId, type, versionId?){
  
  	this.redirectOn.emit(true);
  	this.compassService.saveRedirectData(this.backUrl,this.id, this.versionId, 'view');

		if(type=='subproduct'){
			let timeout = setTimeout(() => {  
					this.router.navigate(['./']);
			}, 400);
			let timeoutId = setTimeout(() => {  
					this.router.navigate([ './recipes/subproducts/', elementId, {versionId: versionId}]);
			 }, 500);
		}
		if(type=='product'){
			this.router.navigate([ './recipes/products/', elementId, {versionId: versionId}]);
		}
		if(type=='dish'){
			this.router.navigate([ './recipes/dishes/', elementId, {versionId: versionId}]);
		}
		if(type=='drink'){
			this.router.navigate([ './recipes/drinks/', elementId, {versionId: versionId}]);
		}
	}

	public pageHasChanged(data) {
		//this.loading = true;

    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;

    if(this.type == 'ingredient') {
    	this.ingredientService.saveCurrentPageWhereIs(this.currentPage);
    	this.getIngredientInRecipes();
    }

    if(this.type=='subproduct'){
    	this.subproductService.saveCurrentPageWhereIs(this.currentPage);
    	this.getSubproductInRecipes();
    }

    if(this.type == 'product'){

  		this.productService.saveCurrentPageWhereIs(this.currentPage);
    	this.getProductInGastroOffers();

  	}

  	if(this.type == 'dish'){

  		this.dishService.saveCurrentPageWhereIs(this.currentPage);
    	this.getDishInGastroOffers();

  	}
    
    if(this.type == 'drink'){

  		this.drinkService.saveCurrentPageWhereIs(this.currentPage);
    	this.getDrinkInGastroOffers();
	    
  	}

  	if(this.type == 'packaging'){

  		this.packagingService.saveCurrentPageWhereIs(this.currentPage);
    	this.getPackagingInProducts();

  	}

  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    //this.loading = true

    if(this.type == 'ingredient'){
    	this.ingredientService.saveItemsPerPageWhereIs(item);
    	this.getIngredientInRecipes();
    }

    if(this.type=='subproduct'){
    	 this.subproductService.saveItemsPerPageWhereIs(item);
    	 this.getSubproductInRecipes();
    }

    if(this.type == 'product'){

  		this.productService.saveItemsPerPageWhereIs(item);
    	this.getProductInGastroOffers();

  	}

  	if(this.type == 'dish'){

  		this.dishService.saveItemsPerPageWhereIs(item);
    	this.getDishInGastroOffers();

  	}
    
    if(this.type == 'drink'){

  		this.drinkService.saveItemsPerPageWhereIs(item);
    	this.getDrinkInGastroOffers();
	    
  	}

  	if(this.type == 'packaging'){

  		this.packagingService.saveItemsPerPageWhereIs(item);
    	this.getPackagingInProducts();

  	}
  }

  public searchVersions(value: string){

  	if(this.type == 'ingredient'){

  		this.filterText=value;
	    this.ingredientService.saveSearchFilterWhereIs(this.filterText);
	    this.currentPage=1;
	    this.getIngredientInRecipes();

  	}

  	if(this.type == 'subproduct'){

  		this.filterText=value;
	    this.subproductService.saveSearchFilterWhereIs(this.filterText);
	    this.currentPage=1;
	    this.getSubproductInRecipes();

  	}

  	if(this.type == 'product'){

  		this.filterText=value;
	    this.productService.saveSearchFilterWhereIs(this.filterText);
	    this.currentPage=1;
	    this.getProductInGastroOffers();

  	}

  	if(this.type == 'dish'){

  		this.filterText=value;
	    this.dishService.saveSearchFilterWhereIs(this.filterText);
	    this.currentPage=1;
	    this.getDishInGastroOffers();

  	}
    
    if(this.type == 'drink'){

  		this.filterText=value;
	    this.drinkService.saveSearchFilterWhereIs(this.filterText);
	    this.currentPage=1;
	    this.getDrinkInGastroOffers();
	    
  	}

  	if(this.type == 'packaging'){

  		this.filterText=value;
	    this.packagingService.saveSearchFilterWhereIs(this.filterText);
	    this.currentPage=1;
	    this.getPackagingInProducts();

  	}

 }

 public getGastroOffers(){
 	//console.log(this.type,'TYPE')
 	if(this.type == 'dish') this.getDishInGastroOffers();
 	if(this.type == 'drink') this.getDrinkInGastroOffers();
 	if(this.type == 'product') this.getProductInGastroOffers();

 }

 public getRecipes(){
 	//console.log(this.type,'TYPE')
 	if(this.type=='ingredient') this.getIngredientInRecipes();
 	if(this.type == 'subproduct') this.getSubproductInRecipes();
 	if(this.type == 'packaging') this.getPackagingInProducts();

 }

 public cleanArrays(){

 	this.subproducts = []
 	this.products = []
 	this.dishes = []
 	this.drinks = [];

 }


 public deleteGastroOffer(gastroOfferId,versionId,j?, parentType?){
 	//borrar els plats seleccionats a la oferta gastronómica. Necesitem _id d'entrada
 	// this.parentIndex = j;
 	// this.parentType = 'gastroOffer';

 	// if(this.type == 'product'){

 	// 	this.productService.deleteProductIncludedInGastroOffers(this.id,gastroOfferId,versionId).subscribe(
		// 	(data:any)=>{
		// 		this.notification.success(this.deleteProductInGastroOfferTitle,this.deleteProductInGastroOfferContent);
		// 		this.getProductInGastroOffers();
		// })

 	// }

 	// if(this.type == 'dish'){

 	// 	this.dishService.deleteDishIncludedInGastroOffers(this.id,gastroOfferId,versionId).subscribe(
		// 	(data:any)=>{
		// 		this.notification.success(this.deleteDishInGastroOfferTitle,this.deleteDishInGastroOfferContent);
		// 		this.getDishInGastroOffers();
		// })

 	// }

 	// if(this.type == 'drink'){

 	// 	this.drinkService.deleteDrinkIncludedInGastroOffers(this.id,gastroOfferId,versionId).subscribe(
		// 	(data:any)=>{
		// 		this.notification.success(this.deleteDrinkInGastroOfferTitle,this.deleteDrinkInGastroOfferContent);
		// 		this.getDrinkInGastroOffers();
		// })

 	// }

 }

 public deleteAllGastroOffers(gastroOffer,j?, type?){
 	//borrar els plats seleccionats a la oferta gastronómica.
 	// this.parentIndex = j;
 	// this.parentType = type;

 	// if(this.type == 'product'){

 	// 	this.productService.deleteAllProductIncludedInGastroOffers(this.id, gastroOffer).subscribe(
		// 	(data:any)=>{
		// 		this.notification.success(this.deleteAllProductInGastroOfferTitle,this.deleteAllProductInGastroOfferContent);
		// 		this.getProductInGastroOffers();
		// })

 	// }

 	// if(this.type == 'dish'){

 	// 	this.dishService.deleteAllDishIncludedInGastroOffers(this.id,gastroOffer).subscribe(
		// 	(data:any)=>{
		// 		this.notification.success(this.deleteAllDishInGastroOfferTitle,this.deleteAllDishInGastroOfferContent);
		// 		this.getDishInGastroOffers();
		// })

 	// }

 	// if(this.type == 'drink'){

 	// 	this.drinkService.deleteAllDrinkIncludedInGastroOffers(this.id,gastroOffer).subscribe(
		// 	(data:any)=>{
		// 		this.notification.success(this.deleteAllDrinkInGastroOfferTitle,this.deleteAllDrinkInGastroOfferContent);
		// 		this.getDrinkInGastroOffers();
		// })

 	// }

 }

 public deleteRecipe(recipeId,versionId,type,j?,parentType?){
 	//borrar recipe dentro de el composition de dicho recipe. Necesitem _id d'entrada
 	  //if(type=='subproduct') this.subproducts[j].versions.splice(i,1)
 	 //  this.parentIndex = j;
 	 //  this.parentType = parentType

 		// if(this.type == 'ingredient'){

 		// 	this.ingredientService.deleteIngredientIncludedInRecipes(this.id,recipeId,versionId,type).subscribe(
 		// 		(data:any)=>{
 		// 			this.notification.success(this.deleteIngredientInRecipeTitle,this.deleteIngredientInRecipeContent);
 		// 			this.getIngredientInRecipes();
 		// 	})

 		// }

 		// if(this.type=='subproduct'){

 		// 	this.subproductService.deleteSubproductIncludedInRecipes(this.id,recipeId,versionId, type).subscribe(
 		// 		(data:any)=>{
 		// 			this.notification.success(this.deleteSubproductInRecipeTitle,this.deleteSubproductInRecipeContent);
 		// 			this.getSubproductInRecipes();
 		// 	})

 		// }

 		// if(this.type == 'packaging'){

 		// 	this.packagingService.deletePackagingIncludedInProducts(this.id,recipeId,versionId,'product').subscribe(
 		// 		(data:any)=>{
 		// 			this.notification.success(this.deletePackagingInRecipeTitle,this.deletePackagingInRecipeContent);
 		// 			this.getPackagingInProducts();
 		// 	})

 		// }

 }

 public deleteAllRecipes(recipe,j?, type?){
 	//borrar els plats seleccionats a la oferta gastronómica.
 	// this.parentIndex = j;
 	// this.parentType = type;

 	// if(this.type == 'ingredient'){

 	// 	this.ingredientService.deleteAllIngredientIncludedInRecipes(this.id, recipe, type).subscribe(
		// 	(data:any)=>{
		// 		this.notification.success(this.deleteAllIngredientInRecipeTitle,this.deleteAllIngredientInRecipeContent);
		// 		this.getIngredientInRecipes();
		// })

 	// }

 	// if(this.type == 'subproduct'){

 	// 	this.subproductService.deleteAllSubproductIncludedInRecipes(this.id, recipe, type).subscribe(
		// 	(data:any)=>{
		// 		this.notification.success(this.deleteAllSubproductInRecipeTitle,this.deleteAllSubproductInRecipeContent);
		// 		this.getSubproductInRecipes();
		// })

 	// }

 	// if(this.type == 'packaging'){

 	// 	this.packagingService.deleteAllPackagingIncludedInRecipes(this.id, recipe, type).subscribe(
		// 	(data:any)=>{
		// 		this.notification.success(this.deleteAllPackagingInRecipeTitle,this.deleteAllPackagingInRecipeContent);
		// 		this.getPackagingInProducts();
		// })

 	// }

 }

}
