import { Element } from './element.model'
import { PricingRate } from './pricingRate.model'

export class GastroElement {
  family: any
  familyIndex: number
  subfamily: any
  element: Element;
  pricingRate: string
  name: string
  price: number
  numServings: number
  cost: number
  totalCost: number
  active: boolean

  constructor() {
  	this.family={}
    this.familyIndex=0
    this.subfamily={}
    this.pricingRate=null
    this.element = new Element();
    this.name=''
    this.price=0
    this.numServings=0
    this.cost=0
    this.totalCost=0
    this.active=true
  }
}