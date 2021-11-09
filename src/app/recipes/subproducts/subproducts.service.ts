 import { Injectable,EventEmitter } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { AppConfig } from "../../global-utils/services/appConfig.service";
 import { Http, URLSearchParams, Response, ResponseContentType } from "@angular/http";
 

 @Injectable()
 export class SubproductsService {

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

   getSubproducts(perPage, page, filterText, sortField, sortOrder, filterLocation, family, active?, addModal?) {
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

     //return this.authHttp.get(this.apiUrl + '/subproduct?perPage=' + perPage + '&page=' + page + '&orderBy=' + orderBy + '&filterText=' + filterText + '&location=' + location + '&family=' + family)
     return this.authHttp.get(this.apiUrl + '/subproduct', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getSubproduct(id, versionId, filterLocation?) {

     let params = new URLSearchParams();
  
     params.set('_id', id);
     params.set('_versionId', versionId);
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

     return this.authHttp.get(this.apiUrl + '/subproduct/version', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   duplicateSubproduct(id, name, location, updateSubproductsLocation) {

     let params = new URLSearchParams();
  
     params.set('_id', id);
     params.set('name', name);
     params.set('updateSubproductsLocation', updateSubproductsLocation);
     params.set('location', JSON.stringify(location));

     return this.authHttp.get(this.apiUrl + '/subproduct/duplicate', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));   
   }

   duplicateSubproductIntoDish(id, name, location, updateSubproductsLocation) {

     let params = new URLSearchParams();
  
     params.set('_id', id);
     params.set('name', name);
     params.set('updateSubproductsLocation', updateSubproductsLocation);
     params.set('location', JSON.stringify(location));

     return this.authHttp.get(this.apiUrl + '/subproduct/duplicateIntoDish', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));   
   }

   getUserLang(id, versionId) {
     return this.authHttp.get(this.apiUrl + '/subproduct/lang?_id=' + id + '&_versionId=' + versionId)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }  

   getSubproductVersions(id, perPage, page, orderBy, filterText, filterLocation?) {
     
     let params = new URLSearchParams();
     params.set('_id', id);    
     params.set('perPage', perPage);    
     params.set('page', page);    
     params.set('orderBy', orderBy);    
     params.set('filterText', filterText);    
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));    

     return this.authHttp.get(this.apiUrl + '/subproduct/versions', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }
   
   getLocCost(id, versionId) {
     let params = new URLSearchParams();

     params.set('_id', id);
     params.set('versionId', versionId);

     return this.authHttp.get(this.apiUrl + '/subproduct/locationcost', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  getLocAllergens(id, versionId) {
     let params = new URLSearchParams();

     params.set('_id', id);
     params.set('versionId', versionId);
     return this.authHttp.get(this.apiUrl + '/subproduct/locationallergens', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addSubproduct(subproduct) {
     return this.authHttp.post(this.apiUrl + '/subproduct', subproduct)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addVersion(subproduct) {
     //console.log(subproduct,'subproductService add versions')
     return this.authHttp.post(this.apiUrl + '/subproduct/version', subproduct)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteSubproduct(id) {
     return this.authHttp.delete(this.apiUrl + '/subproduct?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteSubproductVersion(id, versionId) {
     return this.authHttp.delete(this.apiUrl + '/subproduct/version?_id=' + id + '&&_versionId=' + versionId)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  setAsActiveVersion(id, versionId) {
    return this.authHttp.get(this.apiUrl + '/subproduct/version/active?_id=' + id + '&&_versionId=' + versionId)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }
  
  getElements(filterText, filterLocation?) {

   let params = new URLSearchParams();

   params.set('filterText', filterText);
   if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation)); 
      
    return this.authHttp.get(this.apiUrl + '/subproduct/elements', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }
  
  getIngredientsFilter(filterText, filterLocation?) {

   let params = new URLSearchParams();

   params.set('filterText', filterText);
   if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation)); 
      
    return this.authHttp.get(this.apiUrl + '/subproduct/ingredients', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSubproductsFilter(filterText, filterLocation, subproductId) {

     let params = new URLSearchParams();

     params.set('filterText', filterText);
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation)); 
     if(subproductId) params.set('subproductId', subproductId); 

      return this.authHttp.get(this.apiUrl + '/subproduct/subproducts', {search: params})
      .map(request => <string[]> request.json())
      .catch((error:any) => Observable.throw(error.json() || 'Server error'));
    }

  getCookingSteps(id, versionId) {
    return this.authHttp.get(this.apiUrl + '/subproduct/version/cooksteps?_id=' + id + '&_versionId=' + versionId)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getActiveVersion(id) {
     return this.authHttp.get(this.apiUrl + '/subproduct/activeversion?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  getSubproductIncludedInRecipes(id, perPage, page, filterText, sortField, sortOrder, filterLocation){

    let params = new URLSearchParams();
    params.set('_id',id);
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));    

    return this.authHttp.get(this.apiUrl + '/subproduct/subproductinrecipes', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteSubproductIncludedInRecipes(id, recipeId, recipeVersionId,type){

    let params = new URLSearchParams();
    params.set('subproductId',id);
    params.set('recipeId', recipeId);
    params.set('recipeVersionId', recipeVersionId);
    params.set('type',type)

    return this.authHttp.delete(this.apiUrl + '/subproduct/subproductinrecipes', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteAllSubproductIncludedInRecipes(id,recipe, type){
    let params = new URLSearchParams();
    params.set('subproductId',id);
    params.set('recipeId', recipe._id);
    params.set('type',type)

    return this.authHttp.delete(this.apiUrl + '/subproduct/all', {search: params})
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

  fetchTimeIntervals(){
    return this.authHttp.get(this.apiUrl + '/config/timeintervals')
    .map(request => <any> request.json());
  }
}

