import { CookingStep } from './cooking-step.model'
import { Composition } from './composition.model'
import { Kitchen } from './kitchen.model'
import { WorkRoom } from './workRoom.model'

export class Subproduct {
  family: any
  subfamily: any
  measurementUnit: any
  kitchens : any []
  caducityFresh: any
  caducityFreeze: any
  daysToUse : any
  active: boolean
  location: any
  lang: any[]
  gallery: any
  pricing: any
  maxCostOverPricePercentage: number
  refPricePerServing: number
  numServings: number
  costPerServing: number
  weightPerServing: number
  allergens: any
  cookingSteps: any
  composition: any
  last_account: string
  gastroComment:string
  diet:string


  constructor() {
    this.family=null
    this.subfamily=null
    this.measurementUnit=[]
    this.active=true
    this.caducityFresh = {}
    this.caducityFreeze = {}
    this.daysToUse = {}
    this.kitchens = []
    this.cookingSteps = new CookingStep();
    this.location=[]
    this.gallery=null
    this.pricing=null
    this.allergens=[]
    this.composition= new Composition();
    this.maxCostOverPricePercentage=0
    this.refPricePerServing=0
    this.numServings=0
    this.costPerServing=0
    this.weightPerServing=0
    this.last_account= null
    this.gastroComment=""
    this.diet=""
  }
}