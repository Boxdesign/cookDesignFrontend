import { subFamily } from './subfamily.model'

export class Family {
    _id: string
    lang: any[]
    category: string
    referenceNumber: string
    externalCode: string
    subfamilies: subFamily
    externalFamily: boolean
    location: any

  constructor () {
    this.lang = [];
    this.externalCode = "";
    this.externalFamily = false;
    this.location = []
  }
}