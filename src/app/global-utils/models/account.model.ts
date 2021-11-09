
export class Account {
    _id: string
    name:string
    active: boolean
    role: string
    user:string
    location: any
    

  constructor () {
  	this.name="";
    this.role="";
    this.active=true;  
    this.location=[]
  }
}