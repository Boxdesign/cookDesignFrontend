import {Component, Input, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SubproductsService} from "../subproducts.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications';
import { ConfirmationService } from 'primeng/primeng'
import { Subject, Observable} from 'rxjs/Rx'
import { CompassService } from '../../../global-utils/services/compass.service'
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";
import { Subproduct } from '../../../global-utils/models/subproduct.model'

@Component({
	templateUrl: './subproduct-tab-edit.template.html',
})
export class SubproductTabEditComponent {
	public id: string;
	public versionId: string;
	public tab: string = 'subproduct';
	public subproduct;
	public forceRefresh = new EventEmitter();
	public hiddenTabButtons:boolean = false;
	public userLang;
	public totalElements;
	public mode;
	public subproductEditedTitle;
  	public subproductEditedContent;
  	public notificationOptions = {
		timeOut: 1500,
		position: ["top", "right"]
	}
  public saving: boolean = false;
  public editing: boolean = false;
  public redirectOn: boolean = false;
  public deactivate: Subject<boolean> = new Subject();
  public alertHeader;
  public alertMessage; 
 	public redirectData;
	public locationCost;
  public filterLocations;
  public subproductDuplicatedTitle
  public subproductDuplicatedContent
  public dishDuplicatedTitle
  public dishDuplicatedContent  
  public subproductUpdatedTitle
  public subproductUpdatedContent
  public subproductUpdatedTitleLocWarning
  public subproductUpdatedContentLocWarning  
  public subproductCreatedTitle
  public subproductCreatedContent
  public duplicateLocation = [];
  public duplicateName;
  public subproductLang
  public loading : boolean;
  public savingSubproduct = new Subject();
  public duplicateIntoDish: boolean = false;
  public updateSubproductsLocation: boolean = false;
  public observerLocation;

	constructor(
		public route: ActivatedRoute, 
		public subproductsService: SubproductsService,  
		public router: Router, 
		public translate: TranslateService, 
		public notification: NotificationsService, 
		public confirmationService: ConfirmationService,
		public compassService: CompassService, 
		public costFilterService: CostFilterService
		) 
	{}

	ngOnInit() {

		this.loading = true;

    this.redirectData = this.compassService.getRedirectData();	

		this.route.data.subscribe((data: {mode:string}) => {
	      if(data.mode) this.mode = data.mode;
	    });
		
		this.route.params.subscribe(params => {
			this.id=params['id']; 
			this.versionId=params['versionId']; 
			this.tab=params['tab'];
		});

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
    }) 

		this.translation();

		if(this.mode == 'new') {

			this.subproduct = new Subproduct();
			this.loading = false;
			
		} else {

			this.getLocationCost();
			this.getEditedSubproduct();

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

		this.translate.get('recipes.subproduct.notifications.subproductEditedTitle').subscribe((res: string) => {
			this.subproductUpdatedTitle = res;
		});

		this.translate.get('recipes.subproduct.notifications.subproductEditedContent').subscribe((res: string) => {
			this.subproductUpdatedContent = res;
		});

		this.translate.get('recipes.subproduct.notifications.subproductEditedTitleLocWarning').subscribe((res: string) => {
			this.subproductUpdatedTitleLocWarning = res;
		});

		this.translate.get('recipes.subproduct.notifications.subproductEditedContentLocWarning').subscribe((res: string) => {
			this.subproductUpdatedContentLocWarning = res;
		});

		this.translate.get('messageGeneric.alert').subscribe((res: string) => {
      this.alertHeader = res;
    });  

    this.translate.get('messageGeneric.alertMessage').subscribe((res: string) => {
      this.alertMessage = res;
    });		

    this.translate.get('recipes.subproduct.notifications.subproductDuplicatedTitle').subscribe((res: string) => {
      this.subproductDuplicatedTitle = res;
    });

    this.translate.get('recipes.subproduct.notifications.subproductDuplicatedContent').subscribe((res: string) => {
      this.subproductDuplicatedContent = res;
    });

    this.translate.get('recipes.dish.notifications.dishDuplicatedTitle').subscribe((res: string) => {
      this.dishDuplicatedTitle = res;
    });

    this.translate.get('recipes.dish.notifications.dishDuplicatedContent').subscribe((res: string) => {
      this.dishDuplicatedContent = res;
    });


    this.translate.get('recipes.subproduct.notifications.subproductCreatedTitle').subscribe((res: string) => {
      this.subproductCreatedTitle = res;
    });

    this.translate.get('recipes.subproduct.notifications.subproductCreatedContent').subscribe((res: string) => {
      this.subproductCreatedContent = res;
    });

	}

	public getEditedSubproduct(){
		//Get the ingredient being edited.
		this.subproductsService.getSubproduct(this.id, this.versionId, this.filterLocations).subscribe(
			(data: any) => {
				this.subproduct = data[0];
				console.log(this.subproduct, 'subpr in tab')
				//rebuild subproduct to avoid reference to versions in components
				this.subproduct.lang = data[0].versions.lang;
				if (typeof data[0].versions._id != 'undefined') this.subproduct.versionId = data[0].versions._id;
				if (typeof data[0].versions.composition != 'undefined') this.subproduct.composition = data[0].versions.composition;
				if (typeof data[0].versions.cookingSteps != 'undefined') this.subproduct.cookingSteps = data[0].versions.cookingSteps;
				if (typeof data[0].versions.allergens != 'undefined') this.subproduct.allergens = data[0].versions.allergens;
				if (typeof data[0].versions.gallery != 'undefined') this.subproduct.gallery = data[0].versions.gallery;
				if (typeof data[0].versions.batchWeight != 'undefined') this.subproduct.batchWeight = data[0].versions.batchWeight;
				if (typeof data[0].versions.netWeight != 'undefined') this.subproduct.netWeight = data[0].versions.netWeight;
				if (typeof data[0].versions.calculatedCost != 'undefined') this.subproduct.calculatedCost = data[0].versions.calculatedCost;
				if (typeof data[0].versions.quantity != 'undefined') this.subproduct.quantity = data[0].versions.quantity;
				if (typeof data[0].versions.last_account != 'undefined') this.subproduct.last_account = data[0].versions.last_account;
				if (typeof data[0].versions.updatedAt != 'undefined') this.subproduct.updatedAt = data[0].versions.updatedAt;
				
					delete this.subproduct.versions;
				
				this.totalElements=this.subproduct.composition.length;

				//Get lang field filtered for user's profile language
				this.subproductsService.getUserLang(this.id, this.versionId).subscribe(
					(data: any) => { 
						this.userLang=data.userLang;
						this.loading = false;
					})
			})
	}

	public preSaveSubproduct() {
    this.savingSubproduct.next(true);
  }

	public saveSubproduct(){

		if (this.mode == 'new'){

			this.forceRefresh.emit(true);
	    let subproductObj = {
	      active: this.subproduct.active,
	      family: this.subproduct.family,
	      subfamily: this.subproduct.subfamily,
	      measurementUnit: this.subproduct.measurementUnit,
	      kitchens : this.subproduct.kitchens,
	      caducityFresh : this.subproduct.caducityFresh,
	      caducityFreeze : this.subproduct.caducityFreeze,
	      daysToUse : this.subproduct.daysToUse,
	      location: this.subproduct.location,
	      versions: { 
	        unitCost: 0,
	        batchWeight: 0,
					netWeight: 0,
	        lang: this.subproduct.lang,
	        composition: [],
	        cookingSteps: [],
	        allergens: [],
	        active: true,
	        gallery: this.subproduct.gallery? this.subproduct.gallery : null
	      }      
	    };

	    //console.log(subproductObj,'ADD Subproduct Object')
	    this.subproductsService.addSubproduct(subproductObj).subscribe(
	      (data) => {
	        this.notification.success(this.subproductCreatedTitle, this.subproductCreatedContent);
	        this.saving=true; //set saving flag to true in order to bypass candeactivate

	        this.subproductLang = {
	          name: '',
	          description: '',
	          gastroComment:'',
	          diet:'',
	          tasting:'',
	          gastroCommentLabel:'',
	          dietLabel:'',
	          tastingLabel:''
	        }
	        this.router.navigate(['./recipes/subproducts/edit/',data._id, {versionId: data.versions[0]._id}]);
	      },
	      (err) => {
	      	//console.log(err,'err')
	          this.notification.error('Error', err || 'Error');
	        })  

		} else {

			var unitCost: number;

			this.forceRefresh.emit(true);

			if(this.subproduct.netWeight) {
				unitCost=this.subproduct.totalCost / this.subproduct.netWeight;
			} else
			{
				unitCost=0;
			}

			let allergens = this.refactorAllergens(this.subproduct.allergens);
			let subproductObj = {
				_id: this.subproduct._id,
				family: this.subproduct.family,
				subfamily: this.subproduct.subfamily,
				measurementUnit: this.subproduct.measurementUnit,
				active: this.subproduct.active,
				kitchens: this.subproduct.kitchens || null,
				caducityFresh: this.subproduct.caducityFresh || null,
				caducityFreeze: this.subproduct.caducityFreeze || null,
				daysToUse: this.subproduct.daysToUse || null,
				location: this.subproduct.location,
				version: {
					lang: this.subproduct.lang,
					gallery: this.subproduct.gallery || null,
					composition: this.subproduct.composition || [],
					cookingSteps: this.subproduct.cookingSteps || [],
					batchWeight: this.subproduct.simulationNetWeight || 0,
					netWeight: this.subproduct.netWeight || 0,
					allergens: allergens || [],
					unitCost: unitCost,
					active: true
				}

			}

		////console.log(subproductObj,'subproductinTABcomponentToADDVERSION');

		this.subproductsService.addVersion(subproductObj).subscribe(
			(data) => {
				let locationWarning = data.locationWarning;
				this.id = data.id;
				this.versionId = data.activeVersionId;
				this.saving=true; //set saving flag to true in order to bypass candeactivate

				if(locationWarning){
					this.notification.warn(this.subproductUpdatedTitleLocWarning, this.subproductUpdatedContentLocWarning, {clickToClose: true, timeOut:0});
				}
				else
				{					
					this.notification.success(this.subproductUpdatedTitle, this.subproductUpdatedContent);
				}
	  		this.router.navigate(['./recipes/subproducts/edit/',this.id, {versionId: this.versionId}]);
	    },
	  		(err) => {
	  			//console.log(err,'err')
	      		this.notification.error('Error', err || 'Error');
	    	})  
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
		    this.router.navigate(['./recipes/subproducts/']); // change route to detect chenges on the same path
		    let timeout = setTimeout(() => {  
        	this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
		    }, 50);
      } else if (this.redirectData.mode == 'view') {
		    this.router.navigate(['./recipes/subproducts/']); // change route to detect chenges on the same path
		    let timeout = setTimeout(() => {  
        	this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
		    }, 50);
      }
     } else { //user came from recipes
       this.router.navigate(['./recipes/subproducts/']);
     }
  }

  public setRedirectOn(e){
  	this.redirectOn=true;
  }

  public notificationDestroyed(e){
    if(e.type!="error"){
      //this.router.navigate(['/recipes/subproducts']);
    }
  }

	public viewCompositionEdit(){
		this.router.navigate(['./recipes/subproducts/edit/',this.id, {versionId: this.versionId, tab: 'composition'}]);
	}
	public viewCookingStepsEdit(){
		this.router.navigate(['./recipes/subproducts/edit/',this.id, {versionId: this.versionId, tab: 'cookingSteps'}]);
	}
	public viewSubproductTabEdit(){
		this.router.navigate(['./recipes/subproducts/edit/',this.id, {versionId: this.versionId, tab: 'subproduct'}]);
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

  public navigateEditSubproduct() {  	
    //No delete redirect data
    this.redirectOn = true;
  	this.editing=true;
    this.router.navigate(['./recipes/subproducts/edit/',this.id, {versionId: this.versionId, filterLocations: JSON.stringify(this.filterLocations)}]);
  }

	public getLocationCost() {
		this.subproductsService.getLocCost(this.id, this.versionId).subscribe(
			(data: any) => {
				this.locationCost = data;
			})
	}	

  public duplicateSubproduct() {

  	if(this.duplicateIntoDish) {

			this.subproductsService.duplicateSubproductIntoDish(this.id, this.duplicateName, this.duplicateLocation, this.updateSubproductsLocation).subscribe(
	      (data) => {
	        let dishId = data._id;
	        let _versionId = data.versions[0]._id;
	        this.notification.success(this.dishDuplicatedTitle, this.dishDuplicatedContent);
	        let timeout = setTimeout(() => {  
	          this.router.navigate(['./recipes/dishes/']);
	        }, 400);
	        let timeoutId = setTimeout(() => {  
	          this.router.navigate(['./recipes/dishes/'+ dishId, {versionId: _versionId, tab: 'subproduct'}]);
	        }, 500);
	      },
	      (err) => {
	        this.notification.error('Error', err || 'Server error');
	      });

  	} else {

	    this.subproductsService.duplicateSubproduct(this.id, this.duplicateName, this.duplicateLocation, this.updateSubproductsLocation).subscribe(
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
	    }
  }

  public clickDuplicate(){
  	this.duplicateLocation=[];
  	this.duplicateIntoDish=false;
  	this.duplicateName='';
  }  

  public updateFilterLocations(e) {
    this.duplicateLocation=e;
  }
}
