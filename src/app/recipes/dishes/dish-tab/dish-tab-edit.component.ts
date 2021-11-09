import { Component, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DishService } from "../dish.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from '../../../global-utils/services/compass.service'
import { Subject, Observable} from 'rxjs/Rx'
import { ConfirmationService } from 'primeng/primeng'
import { NotificationsService } from 'angular2-notifications'
import { Dish } from '../../../global-utils/models/dish.model'
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
	templateUrl: './dish-tab-edit.template.html'
})
export class DishTabEditComponent {

	public id: string;
	public versionId: string;
	public tab: string = 'dish';
	public dish;
	public forceRefresh = new EventEmitter();
	public hiddenTabButtons:boolean = false;
	public userLang;
	public mode
	public redirectData;
  public deactivate: Subject<boolean> = new Subject();
  public saving: boolean = false;
  public editing: boolean = false;
  public redirectOn: boolean = false;
  public alertHeader;
  public alertMessage;
  public locationCost;
  public filterLocations;
  public dishDuplicatedTitle
  public dishDuplicatedContent
  public subproductDuplicatedTitle
  public subproductDuplicatedContent  
  public dishUpdatedTitle;
  public dishUpdatedTitleLocWarning;
  public dishUpdatedContent
  public dishUpdatedContentLocWarning;
  public dishCreatedTitle
  public dishCreatedContent
  public dishLang
  public duplicateLocation = [];
  public duplicateName;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
   }
   public loading : boolean;
  public savingDish = new Subject();
  public duplicateIntoSubproduct: boolean = false;
  public updateSubproductsLocation: boolean = false;
  public observerLocation;

	constructor(
			public route: ActivatedRoute, 
			public dishService: DishService,  
			public router: Router,
			public compassService: CompassService, 
			public confirmationService: ConfirmationService, 
			public translate: TranslateService, 
			public notification: NotificationsService,
			public costFilterService: CostFilterService
		) {}

	ngOnInit() {
    
    this.loading = true;
    //In case the user is coming from the articles tab in providers, redirectData contains the info to be able to redirect the user back
    //to providers. We know whether the user is coming from providers with the flag activated in redirectData.
    this.redirectData = this.compassService.getRedirectData();

		this.route.data.subscribe((data: {mode:string}) => {
	      if(data.mode) this.mode = data.mode;
	    });
	    
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
	
		this.translation();
		
    if(this.mode == 'new'){

      this.dish = new Dish();
      this.loading = false;
    } else {

      this.getEditedDish();
      this.getLocationCost();  

    }
	}

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }	

	public translation(){
			this.translate.get('messageGeneric.alert').subscribe((res: string) => {
	      this.alertHeader = res;
	    });  

	    this.translate.get('messageGeneric.alertMessage').subscribe((res: string) => {
	      this.alertMessage = res;
	    }); 

      this.translate.get('recipes.dish.notifications.dishDuplicatedTitle').subscribe((res: string) => {
        this.dishDuplicatedTitle = res;
      });

      this.translate.get('recipes.dish.notifications.dishDuplicatedContent').subscribe((res: string) => {
        this.dishDuplicatedContent = res;
      });

      this.translate.get('recipes.dish.notifications.subproductDuplicatedTitle').subscribe((res: string) => {
        this.subproductDuplicatedTitle = res;
      });

      this.translate.get('recipes.dish.notifications.subproductDuplicatedContent').subscribe((res: string) => {
        this.subproductDuplicatedContent = res;
      });

      this.translate.get('recipes.dish.notifications.dishCreatedTitle').subscribe((res: string) => {
        this.dishCreatedTitle = res;
      });

      this.translate.get('recipes.dish.notifications.dishCreatedContent').subscribe((res: string) => {
        this.dishCreatedContent = res;
      });

      this.translate.get('recipes.dish.notifications.dishUpdatedTitle').subscribe((res: string) => {
        this.dishUpdatedTitle = res;
      });

      this.translate.get('recipes.dish.notifications.dishUpdatedContent').subscribe((res: string) => {
        this.dishUpdatedContent = res;
      });

			this.translate.get('recipes.dish.notifications.dishUpdatedTitleLocWarning').subscribe((res: string) => {
        this.dishUpdatedTitleLocWarning = res;
      });

      this.translate.get('recipes.dish.notifications.dishUpdatedContentLocWarning').subscribe((res: string) => {
        this.dishUpdatedContentLocWarning = res;
      });

	}

	public getEditedDish(){
	    //Get the ingredient being edited.

	    this.dishService.getDish(this.id, this.versionId, this.filterLocations).subscribe(
	    	(data: any) => {
	    		this.dish = data[0];
	    		//rebuild dish to avoid reference to versions in components
	    		this.dish.lang = data[0].versions.lang;
	    		if (typeof data[0].versions._id != 'undefined') this.dish.versionId = data[0].versions._id;
	    		if (typeof data[0].versions.composition != 'undefined') this.dish.composition = data[0].versions.composition;
	    		if (typeof data[0].versions.pricing != 'undefined') this.dish.pricing = data[0].versions.pricing;
	    		if (typeof data[0].versions.cookingSteps != 'undefined') this.dish.cookingSteps = data[0].versions.cookingSteps;
	    		if (typeof data[0].versions.allergens != 'undefined') this.dish.allergens = data[0].versions.allergens;
	    		if (typeof data[0].versions.gallery != 'undefined') this.dish.gallery = data[0].versions.gallery;
	    		if (typeof data[0].versions.numServings != 'undefined') this.dish.numServings = data[0].versions.numServings;
	    		if (typeof data[0].versions.batchServings != 'undefined') this.dish.batchServings = data[0].versions.batchServings;
	    		if (typeof data[0].versions.costPerServing != 'undefined') this.dish.costPerServing = data[0].versions.costPerServing;
	    		if (typeof data[0].versions.weightPerServing != 'undefined') this.dish.weightPerServing = data[0].versions.weightPerServing;
	    		if (typeof data[0].versions.maxCostOverPricePercentage != 'undefined') this.dish.maxCostOverPricePercentage = data[0].versions.maxCostOverPricePercentage;
	    		if (typeof data[0].versions.refPricePerServing != 'undefined') this.dish.refPricePerServing = data[0].versions.refPricePerServing;
	    		if (typeof data[0].versions.last_account != 'undefined') this.dish.last_account = data[0].versions.last_account;
	    		if (typeof data[0].versions.updatedAt != 'undefined') this.dish.updatedAt = data[0].versions.updatedAt;
	    		
	    		delete this.dish.versions;
	    		//Get lang field filtered for user's profile language
	    		this.dishService.getUserLang(this.id, this.versionId).subscribe(
	    			(data: any) => { 
	    				this.userLang=data.userLang;
              this.loading = false;
	    		})

	    	})
	}
  public preSaveDish() {
    this.savingDish.next(true);
  }

  public saveDish(){

    if(this.mode == 'new'){

      this.forceRefresh.emit(true);
      //console.log(this.dish,'dish before dishObj')
      let dishObj = {
        active: this.dish.active,
        family: this.dish.family,
        subfamily: this.dish.subfamily,
        measurementUnit: this.dish.measurementUnit,
        kitchens : this.dish.kitchens,
        caducityFresh : this.dish.caducityFresh,
        caducityFreeze : this.dish.caducityFreeze,
        daysToUse : this.dish.daysToUse,
        location: this.dish.location,
        versions: { 
          costPerServing: 0,
          lang: this.dish.lang,
          refPricePerServing: 0,
          numServings:0,
          weigthPerServing:0,
          batchServings:0,
          maxCostOverPricePercentage:0,
          composition: [],
          cookingSteps: [],
          allergens: [],
          pricing: [],
          active: true,
          gallery: this.dish.gallery ? this.dish.gallery: null
        }      
      };

    //console.log(dishObj,'dishADD');

    this.dishService.addDish(dishObj).subscribe(
      (data) => {
        this.notification.success(this.dishCreatedTitle,this.dishCreatedContent)
        this.saving=true; //set saving flag to true in order to bypass candeactivate
        this.dishLang = {
          name: '',
          description: '',
          gastroComment:'',
          diet:'',
          tasting:'',
          gastroCommentLabel:'',
          dietLabel:'',
          tastingLabel:''
        }
        this.router.navigate(['./recipes/dishes/edit/',data._id, {versionId: data.versions[0]._id}]);
      },
      (err) => {
        this.notification.error('Error', err || 'Error');  
      });

    } else {

      var costPerServing: number;

      this.forceRefresh.emit(true);
      //console.log(this.dishLang,'dishLang',this.dish.lang,'dish.lang')
      if(this.dish.numServings&&this.dish.totalCost) {
        costPerServing=this.dish.totalCost / this.dish.numServings;
      } else
      {
        costPerServing=0;
      }

      let allergens = this.refactorAllergens(this.dish.allergens);

      let dishObj = {
        _id: this.dish._id,
        family: this.dish.family,
        subfamily: this.dish.subfamily,
        measurementUnit: this.dish.measurementUnit,
        active: this.dish.active,
        kitchens: this.dish.kitchens || null,
        caducityFresh: this.dish.caducityFresh || null,
        caducityFreeze: this.dish.caducityFreeze || null,
        daysToUse: this.dish.daysToUse || null,
        location: this.dish.location,
        version: {
          lang: this.dish.lang,
          gallery: this.dish.gallery || null,
          composition: this.dish.composition || [],
          pricing: this.dish.pricing || [],
          cookingSteps: this.dish.cookingSteps || [],
          numServings: this.dish.numServings || 0,
          weightPerServing: this.dish.weightPerServing || 0,
          batchServings: this.dish.simulationNetWeight || 0,
          refPricePerServing: this.dish.refPricePerServing || 0,
          maxCostOverPricePercentage: this.dish.maxCostOverPricePercentage || 0,
          costPerServing: costPerServing || 0,
          active: true, //new version is set to active
          allergens: allergens || []
        }
      }
      
      this.dishService.addVersion(dishObj).subscribe(
        (data) => {

					let locationWarning:boolean = data.locationWarning;

					if(locationWarning)
					{
						this.notification.warn(this.dishUpdatedTitleLocWarning,this.dishUpdatedContentLocWarning, {clickToClose: true, timeOut:0})
					}
					else
					{
          	this.notification.success(this.dishUpdatedTitle,this.dishUpdatedContent)						
					}
          this.id = data.id;
          this.versionId = data.activeVersionId;
          this.saving=true; //set saving flag to true in order to bypass candeactivate
          this.router.navigate(['./recipes/dishes/edit/',this.id, {versionId: this.versionId}]);
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
       this.router.navigate(['./recipes/dishes/']);
     }
  }

  public setRedirectOn(e){
  	this.redirectOn=true;
  }

  public updateTabButtonsView(event) {
  	this.hiddenTabButtons=event;
  }

  public viewCompositionEdit(){
    this.router.navigate(['./recipes/dishes/edit/',this.id, {versionId: this.versionId, tab: 'composition'}]);
  }
  public viewCookingStepsEdit(){
    this.router.navigate(['./recipes/dishes/edit/',this.id, {versionId: this.versionId, tab: 'cookingSteps'}]);
  }
  public viewDishTabEdit(){
    this.router.navigate(['./recipes/dishes/edit/',this.id, {versionId: this.versionId, tab: 'dish'}]);
  }

  public navigateEditDish() {
      //No delete redirect data
      this.redirectOn = true;
  	this.editing=true;
    this.router.navigate(['./recipes/dishes/edit/',this.id, {versionId: this.versionId, filterLocations: JSON.stringify(this.filterLocations)}]);
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

	public getLocationCost() {
		this.dishService.getLocCost(this.id, this.versionId).subscribe(
			(data: any) => {
				this.locationCost = data;
			})
	}  

  public notificationDestroyed(e){
    
    if(e.type!="error"){

      if (this.mode == 'new') {

        this.router.navigate(['/recipes/dishes']);

      }

    } 

  }

  public duplicateDish() {


  	if(this.duplicateIntoSubproduct) {

			this.dishService.duplicateDishIntoSubproduct(this.id, this.duplicateName, this.duplicateLocation, this.updateSubproductsLocation).subscribe(
	      (data) => {
	        let subproductId = data._id;
	        let _versionId = data.versions[0]._id;
	        this.notification.success(this.subproductDuplicatedTitle, this.subproductDuplicatedContent);
	        let timeout = setTimeout(() => {  
	          this.router.navigate(['./recipes/subproducts/']);
	        }, 400);
	        let timeoutId = setTimeout(() => {  
	          this.router.navigate(['./recipes/subproducts/'+ subproductId, {versionId: _versionId, tab: 'subproduct'}]);
	        }, 500);
	      },
	      (err) => {
	        this.notification.error('Error', err || 'Server error');
	      });

  	} else {

	    this.dishService.duplicateDish(this.id, this.duplicateName, this.duplicateLocation, this.updateSubproductsLocation).subscribe(
	      (data) => {
	        let dishId = data._id;
	        let _versionId = data.versions[0]._id;
	        this.notification.success(this.dishDuplicatedTitle, this.dishDuplicatedContent);
	        let timeout = setTimeout(() => {  
	          this.router.navigate(['./recipes/dishes/']);
	        }, 400);
	        let timeoutId = setTimeout(() => {  
	          this.router.navigate(['./recipes/dishes/'+ dishId, {versionId: _versionId, tab: 'dish'}]);
	        }, 500);
	      },
	      (err) => {
	        this.notification.error('Error', err || 'Server error');
	      });
  	
  	}

  }

  public clickDuplicate(){
  	this.duplicateLocation=[];
  	this.duplicateIntoSubproduct=false;
  	this.duplicateName='';
  }

  public updateFilterLocations(e) {
    this.duplicateLocation=e;
  }
}
