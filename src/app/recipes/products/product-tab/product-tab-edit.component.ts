import {Component, Input, EventEmitter, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductsService} from "../products.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { CompassService } from '../../../global-utils/services/compass.service'
import { Subject, Observable} from 'rxjs/Rx'
import { ConfirmationService } from 'primeng/primeng'
import { NotificationsService } from 'angular2-notifications'
import { Product } from '../../../global-utils/models/product.model'
import { SessionService } from '../../../global-utils/services/session.service';
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'product-tab-edit',
  templateUrl: './product-tab-edit.component.html',
  styleUrls: ['./product-tab-edit.component.scss']
})
export class ProductTabEditComponent implements OnInit {
	
	public forceRefresh = new EventEmitter();
	public id: string;
	public versionId: string;
	public tab: string = 'product';
	public productOnEdit;
	public product;
	public forceRefreshForEditMain = new EventEmitter();
	public hiddenTabButtons:boolean = false;
	public userLang;
	public mode
	public deactivate: Subject<boolean> = new Subject();
	public saving: boolean = false;
	public editing: boolean = false;
	public redirectOn: boolean = false;
	public alertHeader;
	public alertMessage;  
	public redirectData;
	public compLocationCost;
	public packLocationCost;
	public totalLocationCost;
  public productDuplicatedTitle
  public productDuplicatedContent
  public productUpdatedTitle
  public productUpdatedContent
  public productUpdatedTitleLocWarning
  public productUpdatedContentLocWarning  
  public productCreatedTitle
  public productCreatedContent
  public duplicateLocation = [];
  public duplicateName;
  public filterLocations;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
   }
  public productLang 
  public loading : boolean;
 	public isAdmin;
  public savingProduct = new Subject();
  public observerLocation;
  public updateSubproductsLocation: boolean = false;

	constructor(
		public route: ActivatedRoute, 
		public productsService: ProductsService,  
		public router: Router,
		public confirmationService: ConfirmationService, 
		public compassService: CompassService, 
		public translate: TranslateService, 
		public notification: NotificationsService,
		public sessionService: SessionService,
		public costFilterService: CostFilterService
	) { }

	ngOnInit() {

		this.loading = true;

		this.sessionService.isAdmin().subscribe((value) => {
  		this.isAdmin = value;
  	});

    this.redirectData = this.compassService.getRedirectData();	

		this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId']; this.tab=params['tab'];});

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
      ////console.log(this.mode,'mode')
    });		

		this.translation();

		if(this.mode == 'new') {

			this.product = new Product();
			this.loading = false;

		} else {

			this.getEditedProduct();
			this.getLocationCost();
		}
		
	}	

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }	

	public langObjRefreshed(e) {
    //Don't ask why this has to be commented. Fact of the matter is otherwise it doesn't work.
    //this.drinkLang = e.langsObj;
  }


	public translation(){

		this.translate.get('messageGeneric.alert').subscribe((res: string) => {
      this.alertHeader = res;
    });  

    this.translate.get('messageGeneric.alertMessage').subscribe((res: string) => {
      this.alertMessage = res;
    }); 

    this.translate.get('recipes.product.notifications.productDuplicatedTitle').subscribe((res: string) => {
      this.productDuplicatedTitle = res;
    });

    this.translate.get('recipes.product.notifications.productDuplicatedContent').subscribe((res: string) => {
      this.productDuplicatedContent = res;
    });

    this.translate.get('recipes.product.notifications.productUpdatedTitle').subscribe((res: string) => {
      	this.productUpdatedTitle = res;
    });

  	this.translate.get('recipes.product.notifications.productUpdatedContent').subscribe((res: string) => {
    	this.productUpdatedContent = res;
  	});

    this.translate.get('recipes.product.notifications.productUpdatedTitleLocWarning').subscribe((res: string) => {
      	this.productUpdatedTitleLocWarning = res;
    });

  	this.translate.get('recipes.product.notifications.productUpdatedContentLocWarning').subscribe((res: string) => {
    	this.productUpdatedContentLocWarning = res;
  	});  	

  	this.translate.get('recipes.product.notifications.productCreatedTitle').subscribe((res: string) => {
    	this.productCreatedTitle = res;
  	});

  	this.translate.get('recipes.product.notifications.productCreatedContent').subscribe((res: string) => {
    	this.productCreatedContent = res;
 	 	});

	}

	public getEditedProduct(){
	    //Get the ingredient being edited.
	    this.productsService.getProduct(this.id, this.versionId, this.filterLocations).subscribe(
	    	(data: any) => {
	    		this.product = data[0];

	    		//rebuild product to avoid reference to versions in components
	    		this.product.lang = data[0].versions.lang;
	    		if (typeof data[0].versions._id != 'undefined') this.product.versionId = data[0].versions._id;
	    		if (typeof data[0].versions.composition != 'undefined') this.product.composition = data[0].versions.composition;
	    		if (typeof data[0].versions.cookingSteps != 'undefined') this.product.cookingSteps = data[0].versions.cookingSteps;
	    		if (typeof data[0].versions.packaging != 'undefined') this.product.packaging = data[0].versions.packaging;
	    		if (typeof data[0].versions.pricing != 'undefined') this.product.pricing = data[0].versions.pricing;
	    		if (typeof data[0].versions.allergens != 'undefined') this.product.allergens = data[0].versions.allergens;
	    		if (typeof data[0].versions.gallery != 'undefined') this.product.gallery = data[0].versions.gallery;
	    		if (typeof data[0].versions.netWeight != 'undefined') this.product.netWeight = data[0].versions.netWeight;
	    		if (typeof data[0].versions.batchWeight != 'undefined') this.product.batchWeight = data[0].versions.batchWeight;
	    		if (typeof data[0].versions.packagingCost != 'undefined') this.product.packagingCost = data[0].versions.packagingCost;
	    		if (typeof data[0].versions.maxCostOverPricePercentage != 'undefined') this.product.maxCostOverPricePercentage = data[0].versions.maxCostOverPricePercentage;
	    		if (typeof data[0].versions.refPrice != 'undefined') this.product.refPrice = data[0].versions.refPrice;
	    		if (typeof data[0].versions.compositionCost != 'undefined') this.product.compositionCost = data[0].versions.compositionCost;
	    		if (typeof data[0].versions.last_account != 'undefined') this.product.last_account = data[0].versions.last_account;
	    		if (typeof data[0].versions.updatedAt != 'undefined') this.product.updatedAt = data[0].versions.updatedAt;
	    		delete this.product.versions;

	    		//Get lang field filtered for user's profile language
	    		this.productsService.getUserLang(this.id, this.versionId).subscribe(
	    			(data: any) => { 
	    				this.userLang=data.userLang;
	    				this.loading = false;
	    		})
	    	})
	}

	public preSaveProduct() {
    this.savingProduct.next(true);
  }

	public saveProduct() {

		if(this.mode == 'new'){

				this.forceRefresh.emit(true);

				let productObj = {
		    	_id: this.product._id,
		    	family: this.product.family,
		    	subfamily: this.product.subfamily,
		    	measurementUnit: this.product.measurementUnit,
		    	active: this.product.active,
		    	kitchens: this.product.kitchens || null,
					caducityFresh: this.product.caducityFresh || null,
					caducityFreeze: this.product.caducityFreeze || null,
					daysToUse: this.product.daysToUse || null,
		    	location: this.product.location,
		    	versions: {
		    		lang: this.product.lang,
		    		gallery: this.product.gallery? this.product.gallery: null,
		    		composition: [],
		    		cookingSteps: [],
		    		packaging: [],
		    		pricing: [],
		    		refPrice: 0,
		    		maxCostOverPricePercentage: 0,
		    		netWeight: 0,
		    		batchWeight: 0,
		    		packagingCost: 0,
		    		compositionCost: 0,
		    		unitCost: 0,
		    		totalCost: 0,
		    		allergens: [],
		    		active: true
		    	}
		    }

		  this.productsService.addProduct(productObj).subscribe(
		  	(data)=>{
		  		console.log(data, 'data')
		  		this.notification.success(this.productCreatedTitle,this.productCreatedContent);
		  		this.saving = true;
		  		this.productLang = {
		          name: '',
		          description: '',
		          gastroComment:'',
		          diet:'',
		          tasting:'',
		          gastroCommentLabel:'',
		          dietLabel:'',
		          tastingLabel:''
		        }
		        this.router.navigate(['./recipes/products/edit/',data._id, {versionId: data.versions[0]._id}]);

		  	},(err)=>{
		  		this.notification.error('Error', err || 'Error');
		  })

		} else {

			var unitCost: number;
			var totalCost: number;

			this.forceRefresh.emit(true);
			totalCost = this.product.packagingCost + this.product.compositionCost;

			if(this.product.netWeight) {
				unitCost= totalCost / this.product.netWeight;
			} else
			{
				unitCost=0;
			}

			let allergens = this.refactorAllergens(this.product.allergens);

		    let productObj = {
		    	_id: this.product._id,
		    	family: this.product.family,
		    	subfamily: this.product.subfamily,
		    	measurementUnit: this.product.measurementUnit,
		    	active: this.product.active,
		    	kitchens: this.product.kitchens || null,
					caducityFresh: this.product.caducityFresh || null,
					caducityFreeze: this.product.caducityFreeze || null,
					daysToUse: this.product.daysToUse || null,
		    	location: this.product.location,
		    	version: {
		    		lang: this.product.lang,
		    		gallery: this.product.gallery || null,
		    		composition: this.product.composition || [],
		    		cookingSteps: this.product.cookingSteps || [],
		    		packaging: this.product.packaging || [],
		    		pricing: this.product.pricing || [],
		    		refPrice: this.product.refPrice || 0,
		    		maxCostOverPricePercentage: this.product.maxCostOverPricePercentage || 0,
		    		netWeight: this.product.netWeight || 0,
		    		batchWeight: this.product.simulationNetWeight || 0,
		    		packagingCost: this.product.packagingCost || 0,
		    		compositionCost: this.product.compositionCost || 0,
		    		unitCost: unitCost || 0,
		    		totalCost: totalCost || 0,
		    		allergens: allergens || [],
		    		active: true
		    	}
		    }

		    this.productsService.addVersion(productObj).subscribe(
		    	(data) => {
		        this.id = data.id;
						this.versionId = data.activeVersionId;
						this.saving=true; //set saving flag to true in order to bypass candeactivate
						let locationWarning = data.locationWarning;
						if(locationWarning)
						{
		    			this.notification.warn(this.productUpdatedTitleLocWarning, this.productUpdatedContentLocWarning, {clickToClose: true, timeOut:0});
						}
						else
						{
		    			this.notification.success(this.productUpdatedTitle, this.productUpdatedContent);
						}
		    		this.router.navigate(['./recipes/products/edit/',this.id, {versionId: this.versionId}]);  		
		    	},
		    	(err) => {
		    		this.notification.error('Error', err || 'Error');
		    	});

		}
		
	}

	canDeactivate(): Subject<boolean> | boolean {
    //Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (this.mode == 'view') {
   	  //Delete redirect data when the user cancel the route thread
      if(!this.redirectOn) {
      	this.compassService.deleteRedirectData();
      }
      return true;
    }

  	if(this.saving) { //It's save redirection, no need to to confirm redirection with a user dialog.
  		this.saving=false;
  		return true;
  	}    

  	//Otherwise ask the user with the dialog service and return its
    //promise which resolves to true or false when the user decides
    this.confirmAction();
    return this.deactivate;
  }

  public confirmAction() {

    this.confirmationService.confirm({
        header: this.alertHeader,
        message: this.alertMessage,
        icon: "fa fa-exclamation-triangle",
        accept: () => {
          this.deactivate.next(true);
        },
        reject: () => {
          this.deactivate.next(false);
        }      
      });
  }	

  public redirect() {

    if(this.redirectData && this.redirectData.activated) { //user came from articles tab in providers, need to redirect back to providers
      let _id = this.redirectData.id;
      let _versionId = this.redirectData.versionId;
      let mode = this.redirectData.mode;
      let originPath = this.redirectData.originPath;

      //No delete redirect data
      this.redirectOn = true;

      //Reset redirect data.
      this.compassService.resetRedirectData();

      if(!this.filterLocations) this.filterLocations = [];

      if (mode == 'edit') {
        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
      } else if (this.redirectData.mode == 'view') {
        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
      }
     } else { //user came from recipes
       this.router.navigate(['./recipes/products/']);
     }
  }

  public setRedirectOn(e){
  	this.redirectOn=true;
  }

	public updateTabButtonsView(event) {
		this.hiddenTabButtons=event;
	}
	  public viewCompositionEdit(){
	    this.router.navigate(['./recipes/products/edit/',this.id, {versionId: this.versionId, tab: 'composition'}]);
	  }
	  public viewCookingStepsEdit(){
	    this.router.navigate(['./recipes/products/edit/',this.id, {versionId: this.versionId, tab: 'cookingSteps'}]);
	  }
	  public viewProductTabEdit(){
	    this.router.navigate(['./recipes/products/edit/',this.id, {versionId: this.versionId, tab: 'product'}]);
	  }

	  public refactorAllergens(allergens){
	  	//allergens is an array of objects in subproductOnEdit which are objects of data model type Allergen with a 'level' field that we've added. 
	  	//The hasAllergens model of data model Subproduct only stores the allergen ObjectId and the level.
	  	let refactorAllergens=allergens.map((allergen) => {
	  		let obj= {
	  			allergen: allergen._id,
	  			level: allergen.level
	  		}
	  		return obj;
	  	})
	  	return refactorAllergens;
	  }

  public navigateEditProduct() {
      //No delete redirect data
      this.redirectOn = true;
  	this.editing=true;
    this.router.navigate(['./recipes/products/edit/',this.id, {versionId: this.versionId, filterLocations: JSON.stringify(this.filterLocations)}]);
  }

	public getLocationCost() {
		this.productsService.getLocCost(this.id, this.versionId).subscribe(
			(data: any) => {
				//console.log(data, 'product location cost')
				this.compLocationCost = data.locationCost;
				this.packLocationCost = data.packLocCost;
				this.totalLocationCost = data.totalLocCost;
			})
	}

  public notificationDestroyed(e){

    if(e.type!="error"){
      if (this.mode == 'new') 
      this.router.navigate(['/recipes/products']);
    } 

  }

  public duplicateProduct() {

    this.productsService.duplicateProduct(this.id, this.duplicateName, this.duplicateLocation, this.updateSubproductsLocation).subscribe(
      (data) => {
        let productId = data._id;
        let _versionId = data.versions[0]._id;
        this.notification.success(this.productDuplicatedTitle, this.productDuplicatedContent);
        let timeout = setTimeout(() => {  
          this.router.navigate(['./recipes/products/']);
        }, 400);
        let timeoutId = setTimeout(() => {  
          this.router.navigate(['./recipes/products/'+ productId, {versionId: _versionId, tab: 'product'}]);
        }, 500);
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      });
  }

  public updateFilterLocations(e) {
    this.duplicateLocation=e;
  }
}
