 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { AppConfig } from "../../global-utils/services/appConfig.service";
 import { Http, URLSearchParams } from "@angular/http";

 @Injectable()
 export class ProviderService {

   private apiUrl:string;
   private itemsPerPage: number=10;
   private filterLocations = [];
   private filterText = ''; 
   private currentPage = 1; 
   private savedFilters = {
     sortField:'commercialName', 
     sortOrder:1,
     active:true,
     filterActive:false
   };

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

   getProviders(perPage, page, filterText, filterLocation, sortField, sortOrder, noExternalReference?, active?) {
     let params = new URLSearchParams();

     params.set('perPage', perPage);
     params.set('page', page);
     params.set('filterText', filterText);
     params.set('filterLocation', JSON.stringify(filterLocation));
     params.set('sortField', sortField);
     params.set('sortOrder', sortOrder);
     if(noExternalReference) params.set('noExternalReference', 'true');
     if(active != null) params.set('active', active);

     return this.authHttp.get(this.apiUrl + '/provider', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getProvider(id) {
     return this.authHttp.get(this.apiUrl + '/provider/detail?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addProvider(provider) {
     return this.authHttp.post(this.apiUrl + '/provider', provider)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   editProvider(provider) {
     return this.authHttp.put(this.apiUrl + '/provider', provider)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteProvider(id) {
     return this.authHttp.delete(this.apiUrl + '/provider?_id=' + id)
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
 }
