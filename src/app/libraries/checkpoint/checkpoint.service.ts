/**
 * Created by odin on 4/08/16.
 */
 import { Injectable } from '@angular/core';
 import { AppConfig } from "../../global-utils/services/appConfig.service";
 import { Http, URLSearchParams } from "@angular/http";
 import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class CheckpointService {

   private apiUrl:string;

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

   getCheckpoint(type, perPage, page, sortField, sortOrder, filterText?) {
    let params = new URLSearchParams();
      params.set('type', type);
      params.set('perPage', perPage);
      params.set('page', page);
      params.set('sortField', sortField);
      params.set('sortOrder', sortOrder);
      if(filterText)params.set('filterText', filterText);

    return this.authHttp.get(this.apiUrl + '/checkpoint', {search: params}).map(request => <string[]> request.json());
     //return Promise.resolve(checkpointES);
   }

   getLangsCheckpoint(id) {
    return this.authHttp.get(this.apiUrl + '/checkpoint/details?_id=' + id).map(request => <string[]> request.json());
  }

   addCheckpoint(checkpoint) {
     return this.authHttp.post(this.apiUrl + '/checkpoint', checkpoint).map(request => <string[]> request.json());
   }

   editCheckpoint(checkpoint) {
     return this.authHttp.put(this.apiUrl + '/checkpoint', checkpoint).map(request => <string[]> request.json());
   }


   deleteCheckpoint(id) {
     return this.authHttp.delete(this.apiUrl + '/checkpoint?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));

   }
 }
