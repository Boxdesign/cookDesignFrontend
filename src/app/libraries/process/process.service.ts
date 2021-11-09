/**
 * Created by odin on 4/08/16.
 */
 import { Injectable } from '@angular/core';
 import {AppConfig} from "../../global-utils/services/appConfig.service";
 import { Observable } from 'rxjs/Observable';
 import {Http, URLSearchParams} from "@angular/http";

 @Injectable()
 export class ProcessService {

   private apiUrl:string;

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

   getProcess(perPage, page, sortField, sortOrder, filterText?) {
    let params = new URLSearchParams();
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterText)params.set('filterText', filterText);

    return this.authHttp.get(this.apiUrl + '/process', {search: params}).map(request => <string[]> request.json());
   }

   getLangsProcess(id) {
    return this.authHttp.get(this.apiUrl + '/process/details?_id=' + id).map(request => <string[]> request.json());
  }

   addProcess(process) {
     console.log(process,'processService')
     return this.authHttp.post(this.apiUrl + '/process', process).map(request => <string[]> request.json());
   }

   editProcess(process) {
     return this.authHttp.put(this.apiUrl + '/process', process).map(request => <string[]> request.json());
   }


   deleteProcess(id) {
     return this.authHttp.delete(this.apiUrl + '/process?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));

   }


 }
