import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { ExportService } from '../export.service';
import { GastroOfferService } from '../../gastro/gastro-offers/gastro-offer.service';
import { SubproductsService } from '../../recipes/subproducts/subproducts.service';
import { ProductsService } from '../../recipes/products/products.service';
import { DishService } from '../../recipes/dishes/dish.service';
import { DrinkService } from '../../recipes/drinks/drink.service';
import { IngredientsService } from '../../articles/ingredients/ingredients.service';
import { PackagingsService } from '../../articles/packagings/packagings.service';
import { Observable, Subject } from "rxjs/Rx";
import * as FileSaver from "file-saver";
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'export-selector',
  templateUrl: './export-selector.component.html',
  styleUrls: ['./export-selector.component.scss']
})
export class ExportSelectorComponent implements OnInit {

  @ViewChild('gastroOfferSelectElement') gastroOfferSelectElement;  
  @ViewChild('subproductSelectElement') subproductSelectElement; 
  @ViewChild('productSelectElement') productSelectElement; 
  @ViewChild('dishSelectElement') dishSelectElement; 
  @ViewChild('drinkSelectElement') drinkSelectElement; 
  @ViewChild('ingredientSelectElement') ingredientSelectElement; 
  @ViewChild('packagingSelectElement') packagingSelectElement; 
  public filterLocations = [];
  public firstSelectorType;
  public recipeType;
  public articleType;
  public gastroOfferSubject: Subject<any> = new Subject();
  public gastroOfferType;
  public gastroOfferList;
  public gastroOffer = [];
  public subproductSubject: Subject<any> = new Subject();
  public subproductFamily;
  public subproductList;
  public subproduct = [];
  public productSubject: Subject<any> = new Subject();
  public productFamily;
  public productList;
  public product = [];
  public dishSubject: Subject<any> = new Subject();
  public dishFamily;
  public dishList;
  public dish = [];
  public drinkSubject: Subject<any> = new Subject();
  public drinkFamily;
  public drinkList;
  public drink = [];
  public ingredientSubject: Subject<any> = new Subject();
  public ingredientFamily;
  public ingredientList;
  public ingredient = [];
  public packagingSubject: Subject<any> = new Subject();
  public packagingList;
  public packaging = [];
  public previousSearch;
  public filterText;
  public quantityOptions;
  public qty;
	public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }  
  public loadingData=false;
  public exportStartedSummary;
  public exportStartedDetail;
  public nameSelected = [];

  constructor(
    public notification: NotificationsService, 
    public gastroOfferService: GastroOfferService,
  	public exportService: ExportService,
    public subproductsService: SubproductsService,
    public productsService: ProductsService,
    public dishService: DishService,
    public drinkService: DrinkService,
    public ingredientService: IngredientsService,
    public packagingService: PackagingsService,
    public translate: TranslateService
   ){}

  ngOnInit() {
    this.translation();
    this.gastroOfferType = '';
    this.subproductFamily = '';
    this.productFamily = '';
  	this.firstSelectorType = 'gastroOffer';
    this.recipeType = 'subproduct';
    this.articleType = 'ingredient';

    this.quantityOptions = [{label: 'Todas', value: 'all'}, {label: 'Una o más', value: 'some'}];
    this.qty='all'


/*gastroOffer Subject*/
    this.gastroOfferSubject
    .debounceTime(300)
    .subscribe((searchString) => {

      if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
        // string was deleted so assign empty array to ng-select items
        this.gastroOfferSelectElement.items = [];
        // force the ng-select to update and show the new list
        this.gastroOfferSelectElement.open()
        this.previousSearch = ''
      
      } else {

        this.previousSearch = searchString;
        this.gastroOfferService.getMenus(50, 0, searchString, '',1, this.filterLocations, null, null, this.gastroOfferType, true).subscribe(
          (data:any) => {
            this.gastroOfferList = data.gastroOffers;

            if(this.gastroOfferList.length == 0) {
              let object = [{
                    id: 1,
                    text: 'No results'
                  }]

                this.gastroOfferSelectElement.items = object;
                this.gastroOfferSelectElement.open();

            } else {


              let elementData = this.gastroOfferList.map((element, index) => { 
                let object = {
                  id: element,
                  text: element.versions.lang.name
                }
                return object;
              });

              this.gastroOfferSelectElement.items = elementData;
              this.gastroOfferSelectElement.open();
          	}
          },
          (err) => {
            this.notification.error('Error', err || 'Error');
          });
      }
    });

/*subproduct Subject*/
    this.subproductSubject
    .debounceTime(300)
    .subscribe((searchString) => {

      if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
        // string was deleted so assign empty array to ng-select items
        this.subproductSelectElement.items = [];
        // force the ng-select to update and show the new list
        this.subproductSelectElement.open()
        this.previousSearch = ''
      
      } else {

        this.previousSearch = searchString;
        this.subproductsService.getSubproducts(50, 0, searchString, '', 1, this.filterLocations, this.subproductFamily).subscribe(
          (data:any) => {
            this.subproductList = data.subproducts;
            
            if(this.subproductList.length == 0) {
              let object = [{
                    id: 1,
                    text: 'No results'
                  }]

                this.subproductSelectElement.items = object;
                this.subproductSelectElement.open();

            } else {


              let elementData = this.subproductList.map((element, index) => { 
                let object = {
                  id: element,
                  text: element.versions.lang.name
                }
                return object;
              });
              this.subproductSelectElement.items = elementData;
              this.subproductSelectElement.open();
            }
          },
          (err) => {
            this.notification.error('Error', err || 'Error');
          });
      }
    });

/*product Subject*/
    this.productSubject
    .debounceTime(300)
    .subscribe((searchString) => {

      if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
        // string was deleted so assign empty array to ng-select items
        this.productSelectElement.items = []
        // force the ng-select to update and show the new list
        this.productSelectElement.open()
        this.previousSearch = ''
      
      } else {

        this.previousSearch = searchString;
        this.productsService.getProducts(50, 0, searchString, '',1, this.filterLocations, this.productFamily).subscribe(
          (data:any) => {
            this.productList = data.products;

            if(this.productList.length == 0) {
              let object = [{
                    id: 1,
                    text: 'No results'
                  }]

                this.productSelectElement.items = object;
                this.productSelectElement.open();

            } else {


              let elementData = this.productList.map((element, index) => { 
                let object = {
                  id: element,
                  text: element.versions.lang.name
                }
                return object;
              });

              this.productSelectElement.items = elementData;
              this.productSelectElement.open();
            }
          },
          (err) => {
            this.notification.error('Error', err || 'Error');
          });
      }
    });

/*dish Subject*/
    this.dishSubject
    .debounceTime(300)
    .subscribe((searchString) => {

      if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
        // string was deleted so assign empty array to ng-select items
        this.dishSelectElement.items = []
        // force the ng-select to update and show the new list
        this.dishSelectElement.open()
        this.previousSearch = ''
      
      } else {

        this.previousSearch = searchString;
        this.dishService.getDishes(50, 0, searchString, '', 1, this.filterLocations, this.dishFamily).subscribe(
          (data:any) => {
            this.dishList = data.dishes;

            if(this.dishList.length == 0) {
              let object = [{
                    id: 1,
                    text: 'No results'
                  }]

                this.dishSelectElement.items = object;
                this.dishSelectElement.open();

            } else {


              let elementData = this.dishList.map((element, index) => { 
                let object = {
                  id: element,
                  text: element.versions.lang.name
                }
                return object;
              });

              this.dishSelectElement.items = elementData;
              this.dishSelectElement.open();
            }
          },
          (err) => {
            this.notification.error('Error', err || 'Error');
          });
      }
    });

/*drink Subject*/
    this.drinkSubject
    .debounceTime(300)
    .subscribe((searchString) => {

      if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
        // string was deleted so assign empty array to ng-select items
        this.drinkSelectElement.items = []
        // force the ng-select to update and show the new list
        this.drinkSelectElement.open()
        this.previousSearch = ''
      
      } else {

        this.previousSearch = searchString;
        this.drinkService.getDrinks(50, 0, searchString, '', 1, this.filterLocations, this.drinkFamily).subscribe(
          (data:any) => {
            this.drinkList = data.drinks;

            if(this.drinkList.length == 0) {
              let object = [{
                    id: 1,
                    text: 'No results'
                  }]

                this.drinkSelectElement.items = object;
                this.drinkSelectElement.open();

            } else {


              let elementData = this.drinkList.map((element, index) => { 
                let object = {
                  id: element,
                  text: element.versions.lang.name
                }
                return object;
              });

              this.drinkSelectElement.items = elementData;
              this.drinkSelectElement.open();
            }
          },
          (err) => {
            this.notification.error('Error', err || 'Error');
          });
      }
    });

/*ingredient Subject*/
    this.ingredientSubject
    .debounceTime(300)
    .subscribe((searchString) => {

      if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
        // string was deleted so assign empty array to ng-select items
        this.ingredientSelectElement.items = []
        // force the ng-select to update and show the new list
        this.ingredientSelectElement.open()
        this.previousSearch = ''
      
      } else {

        this.previousSearch = searchString;
        this.ingredientService.getIngredients(50, 0, searchString, '', 1).subscribe(
          (data:any) => {
            this.ingredientList = data.ingredients;
            if(this.ingredientList.length == 0) {
              let object = [{
                    id: 1,
                    text: 'No results'
                  }]

                this.ingredientSelectElement.items = object;
                this.ingredientSelectElement.open();

            } else {

              let elementData = this.ingredientList.map((element, index) => { 
                let object = {
                  id: element,
                  text: element.lang.name
                }
                return object;
              });

              this.ingredientSelectElement.items = elementData;
              this.ingredientSelectElement.open();
            }
          },
          (err) => {
            this.notification.error('Error', err || 'Error');
          });
      }
    });

/*packaging Subject*/
    this.packagingSubject
    .debounceTime(300)
    .subscribe((searchString) => {

      if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
        // string was deleted so assign empty array to ng-select items
        this.packagingSelectElement.items = []
        // force the ng-select to update and show the new list
        this.packagingSelectElement.open()
        this.previousSearch = ''
      
      } else {

        this.previousSearch = searchString;
        this.packagingService.getPackagings(50, 0, searchString, '',1).subscribe(
          (data:any) => {
            this.packagingList = data.packagings;

            if(this.packagingList.length == 0) {
              let object = [{
                    id: 1,
                    text: 'No results'
                  }]

                this.packagingSelectElement.items = object;
                this.packagingSelectElement.open();

            } else {

              let elementData = this.packagingList.map((element, index) => { 
                let object = {
                  id: element,
                  text: element.lang.name
                }
                return object;
              });

              this.packagingSelectElement.items = elementData;
              this.packagingSelectElement.open();
            }
          },
          (err) => {
            this.notification.error('Error', err || 'Error');
          });
      }
    });

  }

  public translation(){
    this.translate.get('messageGeneric.exportStartedSummary').subscribe((res: string) => {
      this.exportStartedSummary = res;
    });  

    this.translate.get('messageGeneric.exportStartedDetail').subscribe((res: string) => {
      this.exportStartedDetail = res;
    });        
  }


  public firstSelected(e:any){
    this.firstSelectorType = e;
    this.nameSelected = [];
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public gastroOfferTypeSelected(gastroOfferType:string) {
    this.qty='all';
    this.gastroOffer=[];
    this.gastroOfferType = gastroOfferType;
    this.nameSelected = [];
  }

  public gastroOfferSearchChanged(value) {
    this.gastroOfferSubject.next(value);    
  }

  public gastroOfferSelected(value) {
    this.gastroOffer.push(value.id._id);
    this.nameSelected.push(value.text);
  }

  public gastroOfferRemoved(value) {
  	let index = this.gastroOffer.indexOf(value.id._id)
  	this.gastroOffer.splice(index,1);
    let indexName = this.nameSelected.indexOf(value.text)
    this.nameSelected.splice(indexName,1);    
  }

  public resetList() {
  	this.gastroOffer=[];
    this.subproduct=[];
    this.product=[];
    this.dish=[];
    this.drink=[];
    this.ingredient=[];
    this.packaging=[];
    this.nameSelected = [];
  }

  public recipesTypeSelected(recipeType:string) {
    this.qty='all';
    this.previousSearch = ''
    this.subproduct=[];
    this.product=[];
    this.dish=[];
    this.drink=[];
    this.recipeType = recipeType;
    this.nameSelected = [];
  }

  public recipeSearchChanged(value) {
    switch (this.recipeType) {
      case 'subproduct':
        this.subproductSubject.next(value);
        break;
      case 'product':
        this.productSubject.next(value);
        break
      case 'dish':
        this.dishSubject.next(value);
        break
      case 'drink':
        this.drinkSubject.next(value);
        break
    }
  }

  public recipeSelected(value) {
    switch (this.recipeType) {
      case 'subproduct':
        this.subproduct.push(value.id._id);
        break;
      case 'product':
        this.product.push(value.id._id);
        break
      case 'dish':
        this.dish.push(value.id._id);
        break
      case 'drink':
        this.drink.push(value.id._id);
        break
    }
    this.nameSelected.push(value.text);
  }

  public recipeRemoved(value) {
    switch (this.recipeType) {
      case 'subproduct':
        let index1 = this.subproduct.indexOf(value.id._id)
        this.subproduct.splice(index1,1);
        break;
      case 'product':
        let index2 = this.product.indexOf(value.id._id)
        this.product.splice(index2,1);
        break
      case 'dish':
        let index3 = this.dish.indexOf(value.id._id)
        this.dish.splice(index3,1);
        break
      case 'drink':
        let index4 = this.drink.indexOf(value.id._id)
        this.drink.splice(index4,1);
        break
    }
    let indexName = this.nameSelected.indexOf(value.text)
    this.nameSelected.splice(indexName,1);
  }

  public articlesTypeSelected(articleType:string) {
    this.qty='all';
    this.previousSearch = ''
    this.ingredient=[];
    this.packaging=[];
    this.articleType = articleType;
    this.nameSelected = [];
  }

  public articleSearchChanged(value) {
    switch (this.articleType) {
      case 'ingredient':
        this.ingredientSubject.next(value);
        break;
      case 'packaging':
        this.packagingSubject.next(value);
        break
    }
  }

  public articleSelected(value) {
    switch (this.articleType) {
      case 'ingredient':
        this.ingredient.push(value.id._id);
        break;
      case 'packaging':
        this.packaging.push(value.id._id);
        break
    }
    this.nameSelected.push(value.text);
  }

  public articleRemoved(value) {
    switch (this.recipeType) {
      case 'ingredient':
        let index1 = this.ingredient.indexOf(value.id._id)
        this.ingredient.splice(index1,1);
        break;
      case 'packaging':
        let index2 = this.packaging.indexOf(value.id._id)
        this.packaging.splice(index2,1);
        break
    }
    let indexName = this.nameSelected.indexOf(value.text)
    this.nameSelected.splice(indexName,1);
  }

  public downloadGastroData() {

  	let filterLocations;
  	let filterText;
  	let gastroOfferType;
  	let refreshNames=true;

  	if(this.qty=='some') {
  		filterLocations = [];
  		filterText='';

  	} else {
  		filterLocations = this.filterLocations;
  		filterText = this.filterText;
  	}

  	if(this.gastroOfferType == 'all') gastroOfferType='';
  	else gastroOfferType = this.gastroOfferType;

  //console.log(this.gastroOffer, gastroOfferType, 'GASTRO')
  	this.exportService.getGastroOffers(this.gastroOffer, gastroOfferType, filterLocations, filterText, refreshNames, this.nameSelected).subscribe(
  		(data: any) => {
  			this.notification.success(this.exportStartedSummary, this.exportStartedDetail, 
  				{
		        timeOut: 1500,
		        showProgressBar: false,
		        pauseOnHover: false,
		        clickToClose: true
  				}
  			);
  		},(err) => {
  			this.notification.error('Error', err || 'Error');
  		})
  }

  public downloadRecipeData() {

    let filterLocations;
    let filterText;
    let refreshNames=true;
    let recipe;

    if(this.qty=='some') {
      filterLocations = [];
      filterText='';

    } else {
      filterLocations = this.filterLocations;
      filterText = this.filterText;
    }

    switch (this.recipeType) {
      case 'subproduct':
        recipe = this.subproduct;
        break;
      case 'product':
        recipe = this.product;
        break
      case 'dish':
        recipe = this.dish;
        break
      case 'drink':
        recipe = this.drink;
        break
    }

    //console.log(recipe, this.recipeType, 'recipe')
    this.exportService.getRecipes(recipe, this.recipeType, filterLocations, filterText, refreshNames, this.nameSelected).subscribe(
      (data: any) => {
        this.notification.success(this.exportStartedSummary, this.exportStartedDetail, 
          {
            timeOut: 1500,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: true
          }
        );        
      },(err) => {
        this.notification.error('Error', err || 'Error');
      })
  }  

  public downloadArticleData() {


    let filterText;
    let refreshNames=true;
    let article;

    if(this.qty=='some') {
      filterText='';
    } else {
      filterText = this.filterText;
    }

    switch (this.articleType) {
      case 'ingredient':
        article = this.ingredient;
        break;
      case 'packaging':
        article = this.packaging;
        break
    }
    //console.log(this.nameSelected, 'this.nameSelected')
    this.exportService.getArticles(article, this.articleType, filterText, this.nameSelected).subscribe(
      (data: any) => {
        this.notification.success(this.exportStartedSummary, this.exportStartedDetail, 
          {
            timeOut: 1500,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: true
          }
        ); 
      },(err) => {
        this.notification.error('Error', err || 'Error');
      })
  } 


}
