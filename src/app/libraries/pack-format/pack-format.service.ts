/**
 * Created by odin on 4/08/16.
 */
 import { Injectable } from '@angular/core';
import {AppConfig} from "../../global-utils/services/appConfig.service";
import {Http, URLSearchParams} from "@angular/http";

 @Injectable()
 export class PackFormatService {

   private apiUrl:string;

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

   getPackagings(perPage, page, sortField, sortOrder, filterText?) {
    let params = new URLSearchParams();
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterText)params.set('filterText', filterText);

    return this.authHttp.get(this.apiUrl + '/packformat', {search: params}).map(request => <string[]> request.json());
   }

  getLangsPackaging(id) {
    return this.authHttp.get(this.apiUrl + '/packformat/lang?_id=' + id).map(request => <string[]> request.json());
  }

  getPackaging(id) {
      return this.authHttp.get(this.apiUrl + '/packformat/detail?_id=' + id).map(request => <string[]> request.json());
  }

  addPackaging(packaging) {
     return this.authHttp.post(this.apiUrl + '/packformat', packaging).map(request => <string[]> request.json());
   }

  editPackaging(packaging) {
     return this.authHttp.put(this.apiUrl + '/packformat', packaging).map(request => <string[]> request.json());
   }

  deletePackaging(id) {
     return this.authHttp.delete(this.apiUrl + '/packformat?_id=' + id).map(request => <string[]> request.json());

   }
 }
