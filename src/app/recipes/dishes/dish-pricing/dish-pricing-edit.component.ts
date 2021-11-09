import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications';
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { ActivatedRoute, Router } from '@angular/router';
import { DishService } from "../dish.service";
import { PricingRate } from "../../../global-utils/models/pricingRate.model";

@Component({
  selector: 'dish-pricing-edit',
  templateUrl: './dish-pricing-edit.component.html',
  styleUrls: ['./dish-pricing-edit.component.scss']
})
export class DishPricingEditComponent implements OnInit {
	@Input() public dish;
	public pricingRateIndex;
	// public subdishMeasUnitShortName;
	public searchBoxLabel: string;
	public totalPricingRates=0;
  public salesTax;
  public costOverPriceSimulation;
  public mode
  public simulatorOpen;
  public status;
	public pricingRate = new PricingRate();

  constructor(public translate: TranslateService, public notification: NotificationsService, public appConfig:AppConfig, 
    public route:ActivatedRoute, public dishService:DishService) { 

  }

  ngOnInit() {

    this.appConfig.getSalesTax().subscribe((salesTax: any) => {
      this.salesTax=salesTax;
    });  	

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
        ////console.log('translation: '+ res);
    });
    
    this.route.data.subscribe((data: {mode:string}) => {
      if(data.mode) this.mode = data.mode;
    });

    this.totalPricingRates = this.dish.pricing.length;

		if(this.totalPricingRates>0) {
			this.calculatePricing();
		}
  }

  public savePricingRate(){
    //console.log('status :',this.status)
    if(this.status == 'new'){

      //console.log(this.product.pricing,'addPricingRatebefore push pricingRate')
      this.dish.pricing.push(this.pricingRate);
      //console.log(this.product.pricing,'after push pricingRate')
      this.totalPricingRates = this.dish.pricing.length;

      this.calculatePricing();
  
      this.cleanAndResetFields();

    } else {

      //replace object in position productPackagingsOnEditIndex
       // console.log(this.pricingRate,'pricingRate Edit')
       // console.log(this.dish.pricing,'productPricing')
      this.dish.pricing.splice(this.pricingRateIndex,1,this.pricingRate);
       //console.log(this.dish.pricing,'productPricingAftersplice')
      //Calculate costs
     this.calculatePricing();

    }

  }


  public calculatePricing(){

   	this.dish.pricing.forEach( (pricingRate) => {
      //console.log(this.dish.totalCost,'totalCost', this.dish.numServings, 'weightPerServing')
   		if(this.dish.totalCost&&this.dish.numServings) {
        let costPerServing = this.dish.totalCost / this.dish.numServings;
	   		this.pricingRate.costOverPricePercentage  = (costPerServing / pricingRate.price)*100;
         //console.log(costPerServing,'costePorRacion')

	   	}
        
   	})

   }

  public deletePricingRate(index) {

      if(this.pricingRate._id) { //If pricingRate has an _id it means it has been saved to the database and potentially it coul be
                                       // used in a gastro offer.
        this.dishService.restrictPricingRate(this.pricingRate._id).subscribe(
          (data: any)=> { 
            this.dish.pricing.splice(index,1);
            this.totalPricingRates = this.dish.pricing.length;
          },
          (err) => {
            this.notification.error('Error', err || 'Server error');
          });  	
      } else { //pricing rate does not have an _id, which means it has just been created and not saved. It is safe to delete it
              //as there are no chances it is used in a gastronomic offer.
            this.dish.pricing.splice(index,1);
            this.totalPricingRates = this.dish.pricing.length;
      }
  }

  public selectPricingRateToEdit(pricingRate, index) {
  		this.pricingRate = Object.assign({}, pricingRate);
  		this.pricingRateIndex = index;
      //console.log(this.pricingRateIndex)
  }

  public cleanAndResetFields(){
   
   }

  public searchDishes(event){}

  public addClick(){
    this.status = 'new';
    this.pricingRate = new PricingRate();
  }
}
