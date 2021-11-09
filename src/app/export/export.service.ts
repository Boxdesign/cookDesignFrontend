 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { AppConfig } from "../global-utils/services/appConfig.service";
 import { Http, URLSearchParams, Response, ResponseContentType } from "@angular/http";

 @Injectable()
 export class ExportService {

   private apiUrl:string;

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

	getGastroOffers(filterId, exportType, filterLocation, filterText, refreshNames, nameSelected) {
     let params = new URLSearchParams();
  
     params.set('filterId',  JSON.stringify(filterId));
     params.set('exportType', exportType);
     params.set('filterLocation', JSON.stringify(filterLocation));
     params.set('filterText', filterText);
     params.set('refreshNames', refreshNames);
     params.set('nameSelected', JSON.stringify(nameSelected));

     return this.authHttp.get(this.apiUrl + '/export/gastro-offer', {search: params, responseType: ResponseContentType.Blob})
			.timeout(300000)
      .map(res => {
        return new Blob([(<any> res)._body],{ type: 'application/zip' });
      })  
      .catch((error:any) => Observable.throw(error.json() || 'Server error'))
   }

  getRecipes(filterId, exportType, filterLocation, filterText, refreshNames, nameSelected) {
     let params = new URLSearchParams();
  
     params.set('filterId',  JSON.stringify(filterId));
     params.set('exportType', exportType);
     params.set('filterLocation', JSON.stringify(filterLocation));
     params.set('filterText', filterText);
     params.set('refreshNames', refreshNames);
     params.set('nameSelected', JSON.stringify(nameSelected));

     return this.authHttp.get(this.apiUrl + '/export/recipe', {search: params, responseType: ResponseContentType.Blob})
      .timeout(300000)
      .map(res => {
        return new Blob([(<any> res)._body],{ type: 'application/zip' });
      }) 
      .catch((error:any) => Observable.throw(error.json() || 'Server error'))
   }   

  getArticles(filterId, exportType, filterText, nameSelected) {
     let params = new URLSearchParams();
  
     params.set('filterId',  JSON.stringify(filterId));
     params.set('exportType', exportType);
     params.set('filterText', filterText);
     params.set('nameSelected', JSON.stringify(nameSelected));

     return this.authHttp.get(this.apiUrl + '/export/article', {search: params, responseType: ResponseContentType.Blob})
      .timeout(300000)
      .map(res => {
        return new Blob([(<any> res)._body],{ type: 'application/zip' });
      }) 
      .catch((error:any) => Observable.throw(error.json() || 'Server error'))
   }   
}