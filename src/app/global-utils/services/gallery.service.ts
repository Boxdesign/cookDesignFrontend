import { Injectable } from '@angular/core';
import { AppConfig } from "../../global-utils/services/appConfig.service";
import { Http, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class GalleryService {

   private apiUrl:string;

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

  getGallery(id) {
     let params = new URLSearchParams();
     params.set('_id', id);

     return this.authHttp.get(this.apiUrl + '/gallery',{search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }
}