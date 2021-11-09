import { Provider } from './provider.model'

export class Utensil {
    _id: string
    lang: any[]
    referenceNumber : string
    family: any
    subfamily:any
    externalFamily:any
    externalSubfamily: any
    externalLink: boolean
    provider: string
    gallery: any
    last_account:string
    assigned_location:any

  constructor () {
  	this.lang=[];
    this.family= { _id: null}
    this.subfamily=null
    this.externalFamily = { _id: null}
    this.externalSubfamily = null
    this.externalLink = false
		this.referenceNumber = ''   
    this.gallery = null
    this.provider = null
  }

}