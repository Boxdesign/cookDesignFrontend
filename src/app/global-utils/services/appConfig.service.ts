import {  Injectable , OnInit} from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}    from '@angular/router';
import {Http} from "@angular/http";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";

@Injectable()
export class AppConfig implements OnInit{

  apiUrl:string;
  appLanguages;
  salesTax;
  organizationName;
  public taxSubject: any = new ReplaySubject(1);
  public organizationSubject: any = new ReplaySubject(1);

  constructor(private router:Router, public authHttp : Http) {
    if (environment.production) { //environment variable is configured in /src/environments. If prod or staging is specified, these files overwrite environment.ts
      this.apiUrl = environment.apiURL; 

    } else {
      this.apiUrl = environment.apiURL; //the API server runs on port 3333 in development
    }
  }

  ngOnInit(){
    this.getAppLanguages();
  }

  public getAppLanguages(){
    return this.fetchAppLanguages();
  }


  public getEntities(){
    return this.fetchEntities();
  }

  public getSalesTax(){   
    return this.taxSubject; //return Subject
  }

  public getOrganization(){   
    return this.organizationSubject; //return Subject
  }

  public saveTax(salesTax) {
    this.salesTax=salesTax.tax.salesTax; 
    this.taxSubject.next(this.salesTax); 
  }

  public saveOrganization(name) {
  	this.organizationName = name; 
    this.organizationSubject.next(name); 
  }  

  public fetchOrganization(){
    return this.authHttp.get(this.apiUrl + '/config/organization')
    .map(request => <any> request.json());  	
  }

  fetchAppLanguages(){
    return this.authHttp.get(this.apiUrl + '/config/languages')
    .map(request => <any> request.json());
  }

  fetchTaxes(){
    return this.authHttp.get(this.apiUrl + '/config/tax')
    .map(request => <any> request.json());
  }

  fetchSelentaModule(){
    return this.authHttp.get(this.apiUrl + '/config/selenta-module-active')
    .map(request => <any> request.json());
  }

  fetchEntities(){
    return this.authHttp.get(this.apiUrl + '/config/entity')
    .map(request => <any> request.json());
  }

  public fetchTimeIntervals(){
    return this.authHttp.get(this.apiUrl + '/config/timeintervals')
    .map(request => <any> request.json());
  }

  public fetchCookingStepsTimeUnits(){
      return this.authHttp.get(this.apiUrl + '/config/cookingstepstimeunits')
      .map(request => <any> request.json());
    }

  

}
