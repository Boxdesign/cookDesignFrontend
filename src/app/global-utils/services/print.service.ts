 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { AppConfig } from "../../global-utils/services/appConfig.service";
 import  {Http, URLSearchParams, Response, ResponseContentType  } from "@angular/http";


 @Injectable()
 export class PrintService {

   private apiUrl:string;
   private account;

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

   ngOnInit(){
   }

  printArticle(articleId,articleType, templateId, tax, filterLocation) {

     let params = new URLSearchParams();
  
     params.set('_articleId', articleId);
     params.set('_articleType', articleType);
     params.set('_templateId', templateId);
     params.set('_tax', tax);
     if(filterLocation)  params.set('filterLocation', JSON.stringify(filterLocation));

     return this.authHttp.get(this.apiUrl + '/print/article', 
     {
     		search: params,
       	responseType: ResponseContentType.Blob
     })
     .map(res => {
        return new Blob([(<any> res)._body],{ type: 'application/pdf' });
      })
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  printDish(dishId, templateId, simulationNetWeight, tax, filterLocation) {
    
   	let simNetWeight = simulationNetWeight || null;

   	let params = new URLSearchParams();

   	params.set('_dishId', dishId);
   	params.set('_templateId', templateId);
   	params.set('_simulationNetWeight', simNetWeight);
   	params.set('_tax', tax); 
    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));   	

     return this.authHttp.get(this.apiUrl + '/print/dish', 
     {
     		search: params,
       	responseType: ResponseContentType.Blob
     })
     .map(res => {
        return new Blob([(<any> res)._body],{ type: 'application/pdf' });
      })
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   printDrink(drinkId, templateId, simulationNetWeight, tax, filterLocation) {

   	let simNetWeight = simulationNetWeight || null;

   	let params = new URLSearchParams();

   	params.set('_drinkId', drinkId);
   	params.set('_templateId', templateId);
   	params.set('_simulationNetWeight', simNetWeight);
   	params.set('_tax', tax); 
    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

   	return this.authHttp.get(this.apiUrl + '/print/drink', 
   	{
   		search: params,
   		responseType: ResponseContentType.Blob
   	})
   	.map(res => {
   		return new Blob([(<any> res)._body],{ type: 'application/pdf' });
   	})
   	.catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }


   printSubproduct(subproductId, templateId, simulationNetWeight, tax, filterLocation) {

   	let simNetWeight = simulationNetWeight || null;

   	let params = new URLSearchParams();

   	params.set('_subproductId', subproductId);
   	params.set('_templateId', templateId);
   	params.set('_simulationNetWeight', simNetWeight);
   	params.set('_tax', tax);	

    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

   	return this.authHttp.get(this.apiUrl + '/print/subproduct', 
   	{ 
   		search: params,
   		responseType: ResponseContentType.Blob
   	})
   	.map(res => {
   		return new Blob([(<any> res)._body],{ type: 'application/pdf' });
   	})
   	.catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  printProduct(productId, templateId, simulationNetWeight, tax, filterLocation) {

		let simNetWeight = simulationNetWeight || null;

   	let params = new URLSearchParams();
  
	   params.set('_productId', productId);
	   params.set('_templateId', templateId);
	   params.set('_simulationNetWeight', simNetWeight);
	   params.set('_tax', tax);

     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

     return this.authHttp.get(this.apiUrl + '/print/product', 
     { 
     		search: params,
       responseType: ResponseContentType.Blob
     })
     .map(res => {
        return new Blob([(<any> res)._body],{ type: 'application/pdf' });
      })
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   printGastroOffer(gastroOfferId,menuType, templateId, tax, type, filterLocation, showPrice, recipe) {

   	let params = new URLSearchParams();
  
	   params.set('_gastroOfferId', gastroOfferId);
	   params.set('_templateId', templateId);
	   params.set('_menuType', menuType);
	   params.set('_tax', tax);
	   params.set('_type', type);
     params.set('_showPrice',showPrice);
     params.set('_recipe',recipe)
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

   	return this.authHttp.get(this.apiUrl + '/print/gastro-offer', 
   	{ 
   		search: params,
   		responseType: ResponseContentType.Blob
   	})
   	.map(res => {
   		return new Blob([(<any> res)._body],{ type: 'application/pdf' });
   	})
   	.catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   printAllergensInGastroOffer(gastroOfferId, templateId, tax) {

   	let params = new URLSearchParams();
  
	   params.set('_gastroOfferId', gastroOfferId);
	   params.set('_templateId', templateId);
	   params.set('_tax', tax);

   	return this.authHttp.get(this.apiUrl + '/print/allergen', 
   	{
   		search: params,
   		responseType: ResponseContentType.Blob
   	})
   	.map(res => {
   		return new Blob([(<any> res)._body],{ type: 'application/pdf' });
   	})
   	.catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   printLibrary(type, templateId, familyType?,filterFamily?, format?){
     let params = new URLSearchParams();
  
     params.set('_type', type);
     params.set('_familyType',familyType);
     params.set('_templateId', templateId);
     params.set('filterFamily', filterFamily);
     params.set('_format',format)

     return this.authHttp.get(this.apiUrl + '/print/library', 
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