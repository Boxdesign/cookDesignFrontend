/**
 * Created by odin on 4/08/16.
 */
 import { Injectable } from '@angular/core';
 import {AppConfig} from "../../global-utils/services/appConfig.service";
 import {Http, URLSearchParams} from "@angular/http";
 import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class UtensilService {

   private apiUrl:string;

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

   getUtensil(perPage, page, sortField, sortOrder, filterText?) {
     let params = new URLSearchParams();
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterText)params.set('filterText', filterText);
    return this.authHttp.get(this.apiUrl + '/utensil', {search: params}).map(request => <string[]> request.json());
   }

   getLangsUtensil(id) {
    return this.authHttp.get(this.apiUrl + '/utensil/details?_id=' + id).map(request => <string[]> request.json());
  }

   addUtensil(utensil) {
     console.log(utensil,'uService')
     return this.authHttp.post(this.apiUrl + '/utensil', utensil).map(request => <string[]> request.json());
   }

   editUtensil(utensil) {
     return this.authHttp.put(this.apiUrl + '/utensil', utensil).map(request => <string[]> request.json());
   }

   deleteUtensil(id) {
     return this.authHttp.delete(this.apiUrl + '/utensil?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }
   getUtensilVersion(id) {
     return this.authHttp.get(this.apiUrl + '/utensil/detailversion?_id=' + id).map(request => <string[]> request.json());
   }

 }
