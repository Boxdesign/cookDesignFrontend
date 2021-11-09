import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications';
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from "../products.service";
import { PricingRate } from "../../../global-utils/models/pricingRate.model";

@Component({
  selector: 'product-pricing-edit',
  templateUrl: './product-pricing-edit.component.html',
  styleUrls: ['./product-pricing-edit.component.scss']
})
export class ProductPricingEditComponent implements OnInit {
	@Input() public product;
	public pricingRateIndex;
	// public subdishMeasUnitShortName;
	public searchBoxLabel: string;
	public totalPricingRates=0;
  public salesTax;
  public costOverPriceSimulation;
  public mode
  public simulatorOpen;
	public pricingRate = new PricingRate();
  public status;
  constructor(public translate: TranslateService, public notification: NotificationsService, public appConfig:AppConfig, 
    public route: ActivatedRoute, public productService: ProductsService) { 

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

    this.totalPricingRates = this.product.pricing.length;

		if(this.totalPricingRates>0) {
			this.calculatePricing();
		}
  }

  public savePricingRate(){
    //console.log('status :',this.status)
    if(this.status == 'new'){

      //console.log(this.product.pricing,'addPricingRatebefore push pricingRate')
      this.product.pricing.push(this.pricingRate);
      //console.log(this.product.pricing,'after push pricingRate')
      this.totalPricingRates = this.product.pricing.length;

      this.calculatePricing();
  
      this.cleanAndResetFields();

    } else {

      //replace object in position productPackagingsOnEditIndex
      // console.log(this.pricingRate,'pricingRate Edit')
      // console.log(this.product.pricing,'productPricing')
      this.product.pricing.splice(this.pricingRateIndex,1,this.pricingRate);
      // console.log(this.product.pricing,'productPricingAftersplice')
      //Calculate costs
     this.calculatePricing();

    }

  }

  public calculatePricing(){

   	this.product.pricing.forEach( (pricingRate) => {

       // console.log(pricingRate,'productPricingRate')
       // console.log(this.product,'product')
   		if(this.product.compositionCost || this.product.packagingCost) {
        let totalCost = this.product.compositionCost + this.product.packagingCost;
	   		this.pricingRate.costOverPricePercentage  = (totalCost / pricingRate.price)*100;
        // console.log('compositionCost:',this.product.compositionCost,'+ packagingCost:', this.product.packagingCost,'= totalCost:',totalCost)
	   	}

   	})
     // console.log(this.pricingRate,'pricingRate after calculate')

   }

  public deletePricingRate(index) {

    if(this.pricingRate._id) { //If pricingRate has an _id it means it has been saved to the database and potentially it coul be
                                       // used in a gastro offer.
        this.productService.restrictPricingRate(this.pricingRate._id).subscribe(
          (data: any)=> { 
            this.product.pricing.splice(index,1);
            this.totalPricingRates = this.product.pricing.length;
          },
          (err) => {
            alert(err);
          });    
      } else { //pricing rate does not have an _id, which means it has just been created and not saved. It is safe to delete it
              //as there are no chances it is used in a gastronomic offer.
            this.product.pricing.splice(index,1);
            this.totalPricingRates = this.product.pricing.length;
      }

  }

  public selectPricingRateToEdit(pricingRate, index) {

      // console.log(pricingRate,'PricingRate', this.pricingRate,'this.pricingRate')
  		this.pricingRate = Object.assign({}, pricingRate);
      // console.log(pricingRate,'PricingRate', this.pricingRate,'this.pricingRateAfter Assign')

  		this.pricingRateIndex = index;

  }

  public cleanAndResetFields(){
      // console.log(this.pricingRate,'pricingRate CleanAndResetFields')
   }

  public searchProducts(event){}

  public addClick(){
    this.status = 'new';
    this.pricingRate = new PricingRate();
  }

}
