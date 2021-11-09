
 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import {AppConfig} from "../../global-utils/services/appConfig.service";
 import {Http, URLSearchParams, Response, ResponseContentType } from "@angular/http";

 @Injectable()
 export class ProductsService {

   private apiUrl:string;
   private itemsPerPage: number=10;
   private saveFilter: string;
   private filterLocations = [];
   private filterText = '';  
   private currentPage = 1;
   private itemsPerPageWhereIs: number=10;
   private filterTextWhereIs = '';  
   private currentPageWhereIs = 1; 
   private savedFilters = {
     sortField:'versions.lang.name', 
     sortOrder:1,
     active:true,
     filterActive:false
   };

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

   getProducts(perPage, page, filterText, sortField, sortOrder, filterLocation, family, active?, addModal?) {
     let params = new URLSearchParams();
  
     params.set('perPage', perPage);
     params.set('page', page);
     params.set('filterText', filterText);
     params.set('sortField', sortField);
     params.set('sortOrder', sortOrder);
     params.set('filterLocation', JSON.stringify(filterLocation));
     params.set('family', family);
     if(active != null) params.set('active', active);
     if(addModal != null) params.set('addModal', addModal);

    return this.authHttp.get(this.apiUrl + '/product', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getProduct(id, versionId, filterLocation?) {

     let params = new URLSearchParams();
  
     params.set('_id', id);
     params.set('_versionId', versionId);
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

     return this.authHttp.get(this.apiUrl + '/product/version', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   duplicateProduct(id, name, location, updateSubproductsLocation) {

     let params = new URLSearchParams();
  
     params.set('_id', id);
     params.set('name', name);
     params.set('updateSubproductsLocation', updateSubproductsLocation);
     params.set('location', JSON.stringify(location));

     return this.authHttp.get(this.apiUrl + '/product/duplicate', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));   
   }

   getUserLang(id, versionId) {
     return this.authHttp.get(this.apiUrl + '/product/lang?_id=' + id + '&_versionId=' + versionId)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }
  
   getProductVersions(id, perPage, page, orderBy, filterText, filterLocation?) {
     
     let params = new URLSearchParams();
     params.set('_id', id);    
     params.set('perPage', perPage);    
     params.set('page', page);    
     params.set('orderBy', orderBy);    
     params.set('filterText', filterText);    
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));    

     return this.authHttp.get(this.apiUrl + '/product/versions', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addProduct(product) {
     return this.authHttp.post(this.apiUrl + '/product', product)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addVersion(product) {
     return this.authHttp.post(this.apiUrl + '/product/version', product)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteProduct(id) {
     return this.authHttp.delete(this.apiUrl + '/product?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteProductVersion(id, versionId) {
     return this.authHttp.delete(this.apiUrl + '/product/version?_id=' + id + '&&_versionId=' + versionId)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  setAsActiveVersion(id, versionId) {
    return this.authHttp.get(this.apiUrl + '/product/version/active?_id=' + id + '&&_versionId=' + versionId)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getElements(filterText, filterLocation?) {

   let params = new URLSearchParams();

   params.set('filterText', filterText);
   if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation)); 

	  return this.authHttp.get(this.apiUrl + '/product/elements', {search: params})
	  .map(request => <string[]> request.json())
	  .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getIngredientsFilter(filterText, filterLocation?) {
 
  let params = new URLSearchParams();
 
  params.set('filterText', filterText);
  if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation)); 
     
   return this.authHttp.get(this.apiUrl + '/product/ingredients', {search: params})
   .map(request => <string[]> request.json())
   .catch((error:any) => Observable.throw(error.json() || 'Server error'));
 }
 
 getSubproductsFilter(filterText, filterLocation?) {
 
    let params = new URLSearchParams();
 
    params.set('filterText', filterText);
    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation)); 
       
     return this.authHttp.get(this.apiUrl + '/product/subproducts', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }
  

  getCookingSteps(id, versionId) {
    return this.authHttp.get(this.apiUrl + '/product/version/cooksteps?_id=' + id + '&_versionId=' + versionId)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getActiveVersion(id) {
     return this.authHttp.get(this.apiUrl + '/product/activeversion?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  getLocCost(id, versionId) {
     let params = new URLSearchParams();

     params.set('_id', id);
     params.set('versionId', versionId);

     return this.authHttp.get(this.apiUrl + '/product/locationcost', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   } 

   getLocAllergens(id, versionId) {
     let params = new URLSearchParams();

     params.set('_id', id);
     params.set('versionId', versionId);
     return this.authHttp.get(this.apiUrl + '/product/locationallergens', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }
   
  getPricingRates(id) {
     return this.authHttp.get(this.apiUrl + '/product/pricingrates?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  restrictPricingRate(id) {
     return this.authHttp.get(this.apiUrl + '/product/restrictpricingrate?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getProductIncludedInGastroOffers(id, perPage, page, filterText, sortField, sortOrder, filterLocation){
    //console.log(id,'id of element Product')
    let params = new URLSearchParams();
    params.set('_id',id);
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));    

    return this.authHttp.get(this.apiUrl + '/product/productingastrooffers', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteProductIncludedInGastroOffers(id, gastroOfferId, gastroOfferVersionId){

    let params = new URLSearchParams();
    params.set('productId',id);
    params.set('gastroOfferId', gastroOfferId);
    params.set('gastroOfferVersionId', gastroOfferVersionId);

    return this.authHttp.delete(this.apiUrl + '/product/productingastrooffers', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteAllProductIncludedInGastroOffers(id, gastroOffer){

    let params = new URLSearchParams();
    params.set('productId',id);
    params.set('gastroOffer', JSON.parse(JSON.stringify(gastroOffer)));
    console.log(params,'params')
    return this.authHttp.delete(this.apiUrl + '/product/all', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  public saveItemsPerPage(itemsPerPage){
    this.itemsPerPage=itemsPerPage;
  }
  
  public getItemsPerPage(){
    // this._emitter.next(this.itemsPerPage)
    return this.itemsPerPage;
  }

  public saveLocationFilter(locations){
      this.filterLocations=locations;    
  }
  
  public getLocationFilter(){
    return this.filterLocations;
  }

  public saveSearchFilter(text){
      this.filterText=text;    
  }
  
  public getSearchFilter(){
    return this.filterText;
  }

  public saveCurrentPage(page){
      this.currentPage=page;    
  }
  
  public getCurrentPage(){
    return this.currentPage;
  }
  
  public saveFilters(sortField, sortOrder, active, filterActive){
    this.savedFilters={
      sortField, 
      sortOrder,
      active,
      filterActive
    };   
  }
  
  public getSavedFilters(){
    return this.savedFilters;
  }

  public saveItemsPerPageWhereIs(itemsPerPage){
    this.itemsPerPageWhereIs=itemsPerPage;
  }

  public getItemsPerPageWhereIs(){
    // this._emitter.next(this.itemsPerPage)
    return this.itemsPerPageWhereIs;
  }

  public saveSearchFilterWhereIs(text){
      this.filterTextWhereIs=text;    
  }
  
  public getSearchFilterWhereIs(){
    return this.filterTextWhereIs;
  }

  public saveCurrentPageWhereIs(page){
      this.currentPageWhereIs=page;    
  }
  
  public getCurrentPageWhereIs(){
    return this.currentPageWhereIs;
  }
  
  public fetchTimeIntervals(){
    return this.authHttp.get(this.apiUrl + '/config/timeintervals')
    .map(request => <any> request.json());
  }
}
