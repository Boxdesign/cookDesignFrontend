 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { AppConfig } from "../global-utils/services/appConfig.service";
 import { Http, URLSearchParams, Response, ResponseContentType } from "@angular/http";

 @Injectable()
 export class PrintBooksService {

   private apiUrl:string;

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

	printGastroOffer(gastroOfferId,menuType, templateId, tax, type,filterLocation, showSubproducts) {

     let params = new URLSearchParams();
  
     params.set('_gastroOfferId', gastroOfferId);
     params.set('_menuType', menuType);
     params.set('_templateId', templateId);
     params.set('_tax', tax);
     params.set('_type', type);
     params.set('filterLocation', JSON.stringify(filterLocation));
     params.set('_show', showSubproducts);

     return this.authHttp.get(this.apiUrl + '/print-book/gastro-offer', 
     {
     		search: params,
       responseType: ResponseContentType.Blob
     })

     .map(res => {
        return new Blob([(<any> res)._body],{ type: 'application/pdf' });
      })
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  } 

}