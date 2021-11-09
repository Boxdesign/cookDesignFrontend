import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications';
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { ActivatedRoute, Router } from '@angular/router';
import { DrinkService } from "../drink.service";
import { CompassService } from '../../../global-utils/services/compass.service'
import { Subject, Observable} from 'rxjs/Rx'
import { ConfirmationService } from 'primeng/primeng'
import { PricingRate } from '../../../global-utils/models/pricingRate.model';

@Component({
  selector: 'drink-pricing',
  templateUrl: './drink-pricing.component.html',
  styleUrls: ['./drink-pricing.component.scss']
})
export class DrinkPricingComponent {
	@Input() public drink;
	public pricingRateOnEdit;
	public pricingRateOnEditIndex;
	// public subdishMeasUnitShortName;
	public searchBoxLabel: string;
	public totalPricingRates=0;
  public salesTax;
  public costOverPriceSimulation;
  public viewMode: boolean=false;
  public mode;
  public redirectData;
  public deactivate: Subject<boolean> = new Subject();
  public saving: boolean = false;
  public editing: boolean = false;
  public redirectOn: boolean = false;
  public alertHeader;
  public alertMessage;
  public status;
  public simulatorOpen;

	public pricingRate = new PricingRate();
	// {
	// 	name: '',
	// 	costOverPricePercentage: 0,
	// 	price: 0,
	// 	active: false 
	// }

  constructor(public translate: TranslateService, public notification: NotificationsService, public appConfig:AppConfig, 
    public route:ActivatedRoute, public drinkService:DrinkService, public compassService: CompassService, public confirmationService: ConfirmationService, public router: Router) { 

  }

  ngOnInit() {

    this.appConfig.getSalesTax().subscribe((salesTax: any) => {
      this.salesTax=salesTax;
    });  	

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
        ////console.log('translation: '+ res);
    });
    
    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
      //console.log(this.mode,'mode')
    });

    this.redirectData = this.compassService.getRedirectData();	

    this.totalPricingRates = this.drink.pricing.length;

		if(this.totalPricingRates>0) {
			this.calculatePricing();
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

      if (mode == 'edit') {
        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, tab: 'menu'}]);
      } else if (this.redirectData.mode == 'view') {
        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, tab: 'menu'}]);
      }
     } else { //user came from recipes
       this.router.navigate(['./recipes/drinks/']);
     }
  }
  public savePricing(){

  	if (this.status=='new'){
  	  this.drink.pricing.push(this.pricingRate);
  	  this.totalPricingRates = this.drink.pricing.length;
  	  this.saving=true;
  	  //console.log(this.pricingRate,'pricingRateADD')
  	  //Calculate costs
	  this.calculatePricing();
  
    this.cleanAndResetFields();

  } else if(this.status=='edit'){
  		//replace object in position dishPackagingsOnEditIndex
  		this.drink.pricing.splice(this.pricingRateOnEditIndex,1,this.pricingRate);
  		//console.log(this.pricingRate,'pricingRateEdit')
  		this.saving=true; //set saving flag to true in order to bypass candeactivate
  		//Calculate costs
	 	this.calculatePricing();
  }


  }

  public calculatePricing(){

   	this.drink.pricing.forEach( (pricingRate) => {
   		if(this.drink.totalCost&&this.drink.numServings&&this.drink.weightPerServing) {
        let costPerServing = this.drink.totalCost / this.drink.numServings;
	   		pricingRate.costOverPricePercentage  = (costPerServing / pricingRate.price)*100;
         //console.log(costPerServing,'costePorRacion')
	   	}
        
   	})
   }

 //  public editPricingRate() {
 //  	if(this.status=='edit'){
 //  		//replace object in position dishPackagingsOnEditIndex
 //  		this.drink.pricing.splice(this.pricingRateOnEditIndex,1,this.pricingRate);
 //  		this.saving=true; //set saving flag to true in order to bypass candeactivate
 //  		//Calculate costs
	//  	this.calculatePricing();
 //  }
 // }

  public deletePricingRate(index) {

      if(this.pricingRate._id) { //If pricingRate has an _id it means it has been saved to the database and potentially it coul be
                                       // used in a gastro offer.
        this.drinkService.restrictPricingRate(this.pricingRate._id).subscribe(
          (data: any)=> { 
            this.drink.pricing.splice(index,1);
            this.totalPricingRates = this.drink.pricing.length;
          },
          (err) => {
            alert(err);
          });  	
      } else { //pricing rate does not have an _id, which means it has just been created and not saved. It is safe to delete it
              //as there are no chances it is used in a gastronomic offer.
            this.drink.pricing.splice(index,1);
            this.totalPricingRates = this.drink.pricing.length;
      }
  }

  public selectPricingRateToEdit(pricingRate, index) {
  		this.pricingRate = Object.assign({}, pricingRate);
  		this.pricingRateOnEditIndex = index;
  }

  public cleanAndResetFields(){
   		this.pricingRate = new PricingRate();
   }
  public addClick() {
		this.pricingRate = new PricingRate();
    this.status='new';
    this.cleanAndResetFields();
    //console.log(this.status,'status')
    //console.log(this.pricingRate,'drinkComposition')
  }

  public viewClick(){
    this.status='view';
  }

  public editClick(){
    this.status='edit';
  }

  public searchDrinks(event){}
}
