 import { Injectable,EventEmitter } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { AppConfig } from "../../global-utils/services/appConfig.service";
 import { Http, URLSearchParams, Response } from "@angular/http";
 

 @Injectable()
 export class TemplateService {

   private apiUrl:string;
   
   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

   getTemplates(category, subcategory) {
     return this.authHttp.get(this.apiUrl + '/template?_category=' + category + '&_subcategory=' +  subcategory)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

}

