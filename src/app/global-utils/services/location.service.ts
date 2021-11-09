import { Injectable } from '@angular/core';
import {AppConfig} from "../../global-utils/services/appConfig.service";
import {Http, URLSearchParams} from "@angular/http";
import { Observable } from 'rxjs/Observable';


 @Injectable()
 export class LocationService {

   private apiUrl:string;

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

  getUserLocations() {
    return this.authHttp.get(this.apiUrl + '/location')
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));

   }

  getAllLocations() {
    return this.authHttp.get(this.apiUrl + '/location/all')
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));

   }

  editLocation(data) {
    return this.authHttp.put(this.apiUrl + '/location/', data)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  addLocation(location) {
    return this.authHttp.post(this.apiUrl + '/location', location)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteLocation(id) {
    return this.authHttp.delete(this.apiUrl + '/location?_id=' + id)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getLangsLocation(id){

     let params = new URLSearchParams();
     params.set('_id', id);    	

    return this.authHttp.get(this.apiUrl + '/location/details', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  updateIngredientLocCost(model, id) {

     let params = new URLSearchParams();
  
     params.set('model', model);
     params.set('id', id);    

     return this.authHttp.get(this.apiUrl + '/ingredient/updatelocationcost', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  updatePackagingLocCost(model, id) {

     let params = new URLSearchParams();
  
     params.set('model', model);
     params.set('id', id);    

     return this.authHttp.get(this.apiUrl + '/packaging/updatelocationcost', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getProviderLocations(provider) {

    let params = new URLSearchParams();

    params.set('provider', provider);    

    return this.authHttp.get(this.apiUrl + '/location/provider', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

}