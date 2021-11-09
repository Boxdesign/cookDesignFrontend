import { Injectable } from '@angular/core';
import { AppConfig } from "../../global-utils/services/appConfig.service";
import { Http, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class AppReleaseService {

   private apiUrl:string;
   private itemsPerPage: number=10;
   private filterLocations = [];
   private filterText = ''; 
   private currentPage = 1; 

   constructor(
   		public authHttp:Http, 
   		public appConfig:AppConfig) 
   {
     this.apiUrl = this.appConfig.apiUrl;
   }

  getAll() {    
    return this.authHttp.get(this.apiUrl + '/appRelease')
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

 }