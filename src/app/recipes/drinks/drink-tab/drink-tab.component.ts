import { Component, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrinkService } from "../drink.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from '../../../global-utils/services/compass.service'
import { Subject, Observable} from 'rxjs/Rx'
import { ConfirmationService } from 'primeng/primeng'
import { NotificationsService } from 'angular2-notifications'
import { Drink } from '../../../global-utils/models/drink.model'
import { AccountService } from "../../../global-utils/services/account.service";
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
	selector: 'drink-tab',
	templateUrl: './drink-tab.component.html'
})  
export class DrinkTabComponent {
	public forceRefresh = new EventEmitter();
	public id: string;
	public versionId: string;
	public tab;
	public drink;
	public forceRefreshForEditMain = new EventEmitter();
	public hiddenTabButtons:boolean = false;
	public userLang;
	public mode;
	public redirectData;
  public deactivate: Subject<boolean> = new Subject();
  public saving: boolean = false;
  public editing: boolean = false;
  public redirectOn: boolean = false;
  public alertHeader;
  public alertMessage;
  public drinkUpdatedTitle;
  public drinkUpdatedContent
  public drinkUpdatedTitleLocWarning;
  public drinkUpdatedContentLocWarning
  public drinkCreatedTitle
  public drinkCreatedContent
  public drinkDuplicatedTitle
  public drinkDuplicatedContent
  public account;
  public locationCost;
  public filterLocations;
  public duplicateLocation = [];
  public drinkUpdatedLang: any[] = [];
  public drinkLang;
  public timeOut;
  public duplicateName;
  public duplicatedDrink: any;
  public options = {
    timeOut: 1500,
    position: ["top", "right"]
   }
  public loading : boolean;
  public savingDrink = new Subject();
  public observerLocation;
  public updateSubproductsLocation: boolean = false;

	constructor(
		public route: ActivatedRoute, 
		public drinkService: DrinkService,  
		public router: Router,
		public compassService: CompassService, 
		public confirmationService: ConfirmationService, 
		public translate: TranslateService, 
		public notification: NotificationsService,
		public accountService: AccountService,
		public costFilterService: CostFilterService
	) {}

	ngOnInit() {

    this.loading = true;
  	//Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
      //console.log(this.mode,'mode')
    });
    //In case the user is coming from the articles tab in providers, redirectData contains the info to be able to redirect the user back
    //to providers. We know whether the user is coming from providers with the flag activated in redirectData.
    this.redirectData = this.compassService.getRedirectData();	
	    
		this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId']; this.tab=params['tab'];});

		// if(!this.filterLocations)  { 
		// 	this.filterLocations = [];
		// } else {
		// 	if(this.filterLocations&&this.filterLocations.length) this.filterLocations = JSON.parse(this.filterLocations)
		// }

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
    }) 

		this.translation();

		if(this.mode=='new'){  
    		this.drink = new Drink();
        this.loading = false;
  	} else {
		    this.getEditedDrink();	
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

	    this.translate.get('recipes.drink.notifications.drinkUpdatedTitle').subscribe((res: string) => {
      	this.drinkUpdatedTitle = res;
    	});

    	this.translate.get('recipes.drink.notifications.drinkUpdatedContent').subscribe((res: string) => {
      	this.drinkUpdatedContent = res;
    	});

	    this.translate.get('recipes.drink.notifications.drinkUpdatedTitleLocWarning').subscribe((res: string) => {
      	this.drinkUpdatedTitleLocWarning = res;
    	});

    	this.translate.get('recipes.drink.notifications.drinkUpdatedContentLocWarning').subscribe((res: string) => {
      	this.drinkUpdatedContentLocWarning = res;
    	});    	

    	this.translate.get('recipes.drink.notifications.drinkCreatedTitle').subscribe((res: string) => {
      	this.drinkCreatedTitle = res;
    	});

    	this.translate.get('recipes.drink.notifications.drinkCreatedContent').subscribe((res: string) => {
      	this.drinkCreatedContent = res;
   	 	});

      this.translate.get('recipes.drink.notifications.drinkDuplicatedTitle').subscribe((res: string) => {
        this.drinkDuplicatedTitle = res;
      });

      this.translate.get('recipes.drink.notifications.drinkDuplicatedContent').subscribe((res: string) => {
        this.drinkDuplicatedContent = res;
        });


	}

	public getEditedDrink(){
	    //Get the ingredient being edited.

	    this.drinkService.getDrink(this.id, this.versionId, this.filterLocations).subscribe(
	    	(data: any) => {
	    		this.drink = data[0];
          ////console.log(data[0].versions,'dataVersions')
          //rebuild drink to avoid reference to versions in components
          this.drink.lang = data[0].versions.lang; //lang object with all languages
          if (typeof data[0].versions._id != 'undefined') this.drink.versionId = data[0].versions._id;
          if (typeof data[0].versions.composition != 'undefined') this.drink.composition = data[0].versions.composition;
          if (typeof data[0].versions.pricing != 'undefined') this.drink.pricing = data[0].versions.pricing;
          if (typeof data[0].versions.cookingSteps != 'undefined') this.drink.cookingSteps = data[0].versions.cookingSteps;
          if (typeof data[0].versions.allergens != 'undefined') this.drink.allergens = data[0].versions.allergens;
          if (typeof data[0].versions.gallery != 'undefined') this.drink.gallery = data[0].versions.gallery;
          if (typeof data[0].versions.numServings != 'undefined') this.drink.numServings = data[0].versions.numServings;
          if (typeof data[0].versions.batchServings != 'undefined') this.drink.batchServings = data[0].versions.batchServings;
          if (typeof data[0].versions.costPerServing != 'undefined') this.drink.costPerServing = data[0].versions.costPerServing;
          if (typeof data[0].versions.weightPerServing != 'undefined') this.drink.weightPerServing = data[0].versions.weightPerServing;
          if (typeof data[0].versions.maxCostOverPricePercentage != 'undefined') this.drink.maxCostOverPricePercentage = data[0].versions.maxCostOverPricePercentage;
          if (typeof data[0].versions.refPricePerServing != 'undefined') this.drink.refPricePerServing = data[0].versions.refPricePerServing;
          if (typeof data[0].versions.last_account != 'undefined') this.drink.last_account = data[0].versions.last_account;
          if (typeof data[0].versions.updatedAt != 'undefined') this.drink.updatedAt = data[0].versions.updatedAt;
          
          delete this.drink.versions;
	    		//Get lang field filtered for user's profile language
	    		this.drinkService.getUserLang(this.id, this.versionId).subscribe(
	    			(data: any) => { 
	    				this.userLang=data.userLang;
              this.loading = false;
	    		})

	    	})
	}

  public preSaveDrink() {
    this.savingDrink.next(true);
  }

	public saveDrink() {

    if(this.mode == 'new'){

      this.forceRefresh.emit(true);

      let drinkObj = {
        active: this.drink.active,
        family: this.drink.family,
        subfamily: this.drink.subfamily,
        kitchens : this.drink.kitchens,
        referenceNumber : this.drink.referenceNumber,
        measurementUnit: this.drink.measurementUnit,
        location: this.drink.location,
        versions: { 
          costPerServing: 0,
          numServings: 0,
          weightPerServing: 0,
          maxCostOverPricePercentage: 0,
          lang: this.drink.lang,
          refPricePerServing: 0,
          composition: [],
          cookingSteps: [],
          allergens: [],
          pricing: [],
          active: true,
          gallery: this.drink.gallery? this.drink.gallery: null
        }      
      };

      this.drinkService.addDrink(drinkObj).subscribe(
        (data) => {
          this.notification.success(this.drinkCreatedTitle, this.drinkCreatedContent);
          this.saving=true; //set saving flag to true in order to bypass candeactivate
          this.drinkLang = {
            name: '',
            description: '',
            gastroComment:'',
            diet:'',
            tasting:''
          }
         // this.router.navigate(['/recipes/drinks']);
         this.router.navigate(['./recipes/drinks/edit/',data._id, {versionId: data.versions[0]._id}]);
        },
        (err) => {
         this.notification.error('Error', err || 'Error');
        });

		} else {

  		var costPerServing: number;

  		this.forceRefresh.emit(true);
  		if(this.drink.numServings&&this.drink.totalCost) {
  			costPerServing=this.drink.totalCost / this.drink.numServings;
  		} else
  		{
  			costPerServing=0;
  		}

  		let allergens = this.refactorAllergens(this.drink.allergens);


  		let drinkObj = {
        _id: this.drink._id,
        family: this.drink.family,
        subfamily: this.drink.subfamily,
        measurementUnit: this.drink.measurementUnit,
        kitchens: this.drink.kitchens || null,
        referenceNumber : this.drink.referenceNumber,
        active: this.drink.active,
        location: this.drink.location,
        version: {
          lang: this.drink.lang,
          gallery: this.drink.gallery || null,
          composition: this.drink.composition || [],
          pricing: this.drink.pricing || [],
          cookingSteps: this.drink.cookingSteps || [],
          numServings: this.drink.numServings || 0,
          batchServings: this.drink.simulationNetWeight || 0,
          weightPerServing: this.drink.weightPerServing || 0,
          refPricePerServing: this.drink.refPricePerServing || 0,
          maxCostOverPricePercentage: this.drink.maxCostOverPricePercentage || 0,
          costPerServing: costPerServing || 0,
          active: true, //new version is set to active
          allergens: allergens || []
        }
      }

  		this.drinkService.addVersion(drinkObj).subscribe(
  			(data) => {
          this.id = data.id;
  				this.versionId = data.activeVersionId;
  				this.saving=true; //set saving flag to true in order to bypass candeactivate
  				let locationWarning = data.locationWarning;
  				if(locationWarning)
  				{
          	this.notification.warn(this.drinkUpdatedTitleLocWarning, this.drinkUpdatedContentLocWarning, {clickToClose: true, timeOut:0});
  				} 
  				else
  				{
          	this.notification.success(this.drinkUpdatedTitle, this.drinkUpdatedContent);
  				}
      		this.router.navigate(['./recipes/drinks/edit/',this.id, {versionId: this.versionId}]);     	
        },
        (err) => {
        	this.notification.error('Error', err || 'Error');
        })
		}
	}

	canDeactivate(): Subject<boolean> | boolean {
    //Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (this.mode=='view') {
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
       this.router.navigate(['./recipes/drinks/']);
     }
  }

  public setRedirectOn(e){
  	this.redirectOn=true;
  }

  public updateTabButtonsView(event) {
  	this.hiddenTabButtons=event;
  }

  public viewCompositionEdit(){
    this.router.navigate(['./recipes/drinks/edit/',this.id, {versionId: this.versionId, tab: 'composition'}]);
  }
  public viewCookingStepsEdit(){
    this.router.navigate(['./recipes/drinks/edit/',this.id, {versionId: this.versionId, tab: 'cookingSteps'}]);
  }
  public viewDrinkTab(){
    this.router.navigate(['./recipes/drinks/edit/',this.id, {versionId: this.versionId, tab: 'drink'}]);
  }

  public navigateEditDrink() {
      //No delete redirect data
      this.redirectOn = true;
  	this.editing=true;
    this.router.navigate(['./recipes/drinks/edit/',this.id, {versionId: this.versionId, filterLocations: JSON.stringify(this.filterLocations)}]);
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

  public notificationDestroyed(e){
    
    if(e.type!="error"){

      if (this.mode == 'new') {

        this.router.navigate(['/recipes/drinks']);

      }

    } 

  }

  public getLocationCost() {
    this.drinkService.getLocCost(this.id, this.versionId).subscribe(
      (data: any) => {
        this.locationCost = data;
      })
  } 

  public duplicateDrink() {

    this.drinkService.duplicateDrink(this.id, this.duplicateName, this.duplicateLocation, this.updateSubproductsLocation).subscribe(
      (data) => {
        let drinkId = data._id;
        let _versionId = data.versions[0]._id;
        this.notification.success(this.drinkDuplicatedTitle, this.drinkDuplicatedContent);
        let timeout = setTimeout(() => {  
          this.router.navigate(['./recipes/drinks/']);
        }, 400);
        let timeoutId = setTimeout(() => {  
          this.router.navigate(['./recipes/drinks/'+ drinkId, {versionId: _versionId, tab: 'drink'}]);
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
