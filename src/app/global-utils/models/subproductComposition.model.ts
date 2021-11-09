import { Element } from './element.model'
import { EquivalenceUnit } from './equivalenceUnit.model'

export class subproductComposition {

  grossWeight: number
  wastePercentage: number
  measuringUnit: any[]
  measuringUnitShortName: string
  baseUnit: any[]
  baseUnitShortName: string
  name: string
  unitCost: number
  calculatedCost: number
  quantity: number
  equivalenceUnit: EquivalenceUnit
  element: Element
  allergens: any[]
  location_unavailable: string
  active: boolean

  constructor() {
    this.grossWeight=0;
    this.wastePercentage=0;
    this.measuringUnit=[];
    this.measuringUnitShortName="";
    this.baseUnit=[];
    this.baseUnitShortName="";
    this.name="";
    this.unitCost=0;
    this.calculatedCost=0;
    this.quantity=0;
    this.equivalenceUnit=new EquivalenceUnit;
    this.element= new Element();
    this.allergens=[];
    this.location_unavailable= undefined;
    this.active=true;
  }
}