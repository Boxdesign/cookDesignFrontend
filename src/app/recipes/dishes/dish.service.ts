 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { AppConfig } from "../../global-utils/services/appConfig.service";
 import { Http, URLSearchParams, Response, ResponseContentType } from "@angular/http";

 @Injectable()
 export class DishService {

   private apiUrl:string;
   private itemsPerPage: number=10;
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

   getDishes(perPage, page, filterText, sortField, sortOrder, filterLocation, family, active?, addModal?, filterExcludes?) {
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
     if(filterExcludes != null) params.set('filterExcludes', filterExcludes);

     return this.authHttp.get(this.apiUrl + '/dish', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getDish(id, versionId, filterLocation?) {

     let params = new URLSearchParams();
  
     params.set('_id', id);
     params.set('_versionId', versionId);
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

     return this.authHttp.get(this.apiUrl + '/dish/version', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   duplicateDish(id, name, location, updateSubproductsLocation) {

     let params = new URLSearchParams();
  
     params.set('_id', id);
     params.set('name', name);
     params.set('updateSubproductsLocation', updateSubproductsLocation);
     params.set('location', JSON.stringify(location));

     return this.authHttp.get(this.apiUrl + '/dish/duplicate', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));   
   }

   duplicateDishIntoSubproduct(id, name, location, updateSubproductsLocation) {

     let params = new URLSearchParams();
  
     params.set('_id', id);
     params.set('name', name);
     params.set('updateSubproductsLocation', updateSubproductsLocation);
     params.set('location', JSON.stringify(location));

     return this.authHttp.get(this.apiUrl + '/dish/duplicateIntoSubproduct', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));   
   }

   getUserLang(id, versionId) {
     return this.authHttp.get(this.apiUrl + '/dish/lang?_id=' + id + '&_versionId=' + versionId)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getLocCost(id, versionId) {
     let params = new URLSearchParams();

     params.set('_id', id);
     params.set('versionId', versionId);

     return this.authHttp.get(this.apiUrl + '/dish/locationcost', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getLocAllergens(id, versionId) {
     let params = new URLSearchParams();

     params.set('_id', id);
     params.set('versionId', versionId);

     return this.authHttp.get(this.apiUrl + '/dish/locationallergens', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }
   
   getDishVersions(id, perPage, page, orderBy, filterText, filterLocation?) {
     
     let params = new URLSearchParams();
     params.set('_id', id);    
     params.set('perPage', perPage);    
     params.set('page', page);    
     params.set('orderBy', orderBy);    
     params.set('filterText', filterText);    
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));    

     return this.authHttp.get(this.apiUrl + '/dish/versions', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addDish(dish) {
     return this.authHttp.post(this.apiUrl + '/dish', dish)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addVersion(dish) {
     return this.authHttp.post(this.apiUrl + '/dish/version', dish)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteDish(id) {
     return this.authHttp.delete(this.apiUrl + '/dish?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteDishVersion(id, versionId) {
     return this.authHttp.delete(this.apiUrl + '/dish/version?_id=' + id + '&&_versionId=' + versionId)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  setAsActiveVersion(id, versionId) {
    return this.authHttp.get(this.apiUrl + '/dish/version/active?_id=' + id + '&&_versionId=' + versionId)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getElements(filterText, filterLocation?) {

   let params = new URLSearchParams();

   params.set('filterText', filterText);
   if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));    
    
    return this.authHttp.get(this.apiUrl + '/dish/elements', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getIngredientsFilter(filterText, filterLocation?) {
 
  let params = new URLSearchParams();
 
  params.set('filterText', filterText);
  if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation)); 
     
   return this.authHttp.get(this.apiUrl + '/dish/ingredients', {search: params})
   .map(request => <string[]> request.json())
   .catch((error:any) => Observable.throw(error.json() || 'Server error'));
 }
 
 getSubproductsFilter(filterText, filterLocation?) {
 
    let params = new URLSearchParams();
 
    params.set('filterText', filterText);
    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation)); 
       
     return this.authHttp.get(this.apiUrl + '/dish/subproducts', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  getCookingSteps(id, versionId) {
    return this.authHttp.get(this.apiUrl + '/dish/version/cooksteps?_id=' + id + '&_versionId=' + versionId)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getActiveVersion(id) {
     return this.authHttp.get(this.apiUrl + '/dish/activeversion?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  getPricingRates(id) {
     return this.authHttp.get(this.apiUrl + '/dish/pricingrates?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  restrictPricingRate(id) {
     return this.authHttp.get(this.apiUrl + '/dish/restrictpricingrate?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getDishIncludedInGastroOffers(id, perPage, page, filterText, sortField, sortOrder, filterLocation){
    //console.log(id,'id of element Dish')
    let params = new URLSearchParams();
    params.set('_id',id);
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));    
    
    return this.authHttp.get(this.apiUrl + '/dish/dishingastrooffers', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteDishIncludedInGastroOffers(id, gastroOfferId, gastroOfferVersionId){

    let params = new URLSearchParams();
    params.set('dishId',id);
    params.set('gastroOfferId', gastroOfferId);
    params.set('gastroOfferVersionId', gastroOfferVersionId);

    return this.authHttp.delete(this.apiUrl + '/dish/dishingastrooffers', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteAllDishIncludedInGastroOffers(id, gastroOffer){

     let params = new URLSearchParams();
     params.set('dishId',id);
     params.set('gastroOfferId', gastroOffer._id);
    
    return this.authHttp.delete(this.apiUrl + '/dish/all', {search: params})
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
