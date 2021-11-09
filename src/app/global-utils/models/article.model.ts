export class Article {
  lang: any[]
  reference: string
  category: any
  provider: string
  packFormat: string
  packUnits: number
  grossWeightPerUnit: number
  netWeightPerUnit: number
  totalGrossWeight: number
  packPrice: number
  grossPricePerUnit: number
  netPricePerUnit: number
  grossPrice: number
  netPrice: number
  location: any[]
  document: any[]
  active: boolean
  externalReference: string

  constructor() {
    this.lang = []
    this.reference= ''
    this.category= {}
    this.category.kind = 'ingredient'
    this.category.item = null
    this.provider = null
    this.packFormat = null
    this.packUnits = 0;
    this.grossWeightPerUnit = 0; 
    this.netWeightPerUnit = 0; 
    this.totalGrossWeight = 0; 
    this.packPrice = 0; 
    this.grossPricePerUnit = 0; 
    this.netPricePerUnit = 0; 
    this.grossPrice = 0; 
    this.netPrice = 0;     
    this.location = []
    this.document = []
    this.active= true
    this.externalReference=''
  }

  public setLang(langObj) {
    this.lang = langObj;
  }
}