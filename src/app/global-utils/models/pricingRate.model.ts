export class PricingRate {
	 _id: string
  name: string
  costOverPricePercentage: number
  price: number
  active: boolean

  constructor() {
  	this.name=""
  	this.costOverPricePercentage=0,
  	this.price=0
  	this.active=false;
  }
}