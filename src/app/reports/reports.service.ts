 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { AppConfig } from "../global-utils/services/appConfig.service";
 import { Http, URLSearchParams, Headers, RequestOptions, ResponseContentType } from "@angular/http";

 @Injectable()
 export class ReportsService {

  private apiUrl:string;

  constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
  }

  getGastroIngredients(id, qty, gastroType) {
    let params = new URLSearchParams();
     console.log(id,'gastroOfferService')
     params.set('filterId', JSON.stringify(id));
     params.set('_qty',qty);
     params.set('_gastroType',gastroType)

    return this.authHttp.get(this.apiUrl + '/report/gastroingredients', {search: params})
      .map(res => {
        return new Blob([res.arrayBuffer()],{ type: 'text/csv' });
      })
      .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }  

  getIngredientsByLocation(gastroOffer, qty, gastroType, filterLocations) {
    let params = new URLSearchParams();
     //console.log(gastroOffer,'gastroOfferService')
     params.set('filterId', JSON.stringify(gastroOffer));
     params.set('filterLocations', JSON.stringify(filterLocations));
     params.set('_qty',qty);
     params.set('_gastroType',gastroType)
     // params.set('format',format);

    return this.authHttp.get(this.apiUrl + '/report/ingredientsbylocation', {search: params})
      .map(res => {
        return new Blob([res.arrayBuffer()],{ type: 'text/csv' });
      })
      .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  printSubproductsInLocation(templateId, tax,filterLocations) {

     let params = new URLSearchParams();
 
     params.set('_templateId', templateId);
     params.set('_tax', tax);
     params.set('filterLocations', JSON.stringify(filterLocations));

     return this.authHttp.get(this.apiUrl + '/report/subproductsinlocation', 
     {
         search: params,
       responseType: ResponseContentType.Blob
     })

     .map(res => {
        return new Blob([(<any> res)._body],{ type: 'application/pdf' });
      })
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  printSubproductsInLocationDetailed(templateId, tax,filterLocations) {

    let params = new URLSearchParams();

    params.set('_templateId', templateId);
    params.set('_tax', tax);
    params.set('filterLocations', JSON.stringify(filterLocations));

    return this.authHttp.get(this.apiUrl + '/report/subproductsinlocationDetailed', 
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
