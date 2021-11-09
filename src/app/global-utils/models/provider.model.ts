import { Address } from './address.model'
import { Contact } from './contact.model'

export class Provider {
    _id: string
    active:boolean
    identification: string
    commercialName: string
    legalName: string
    approved: boolean
    provider: boolean
    creditor: boolean
    telephone: string[]
    url: string
    address: Address[]
    contact: Contact[]
    document: any[]
    location: any[]
    externalReference: string
    taxId: string

  constructor () {
    this.approved = false
    this.provider = true
    this.creditor = false
    this.telephone = []
    this.document = []
    this.address = [new Address()]
    this.contact = []
    this.active = true
    this.location = []
    this.externalReference = ''
    this.taxId = ''
  }
}
