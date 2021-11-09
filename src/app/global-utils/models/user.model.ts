
export class User {
    _id: string
    firstName:string
    lastName:string
    active: boolean
    email: string
    password: string
    last_account: string
    gallery: string 
    language: string

  constructor () {
  	this.firstName="";
    this.lastName="";
    this.active=true;  
    this.gallery=null;  
  }
}