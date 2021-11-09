/**
 * Created by odin on 4/08/16.
 */
import { Injectable } from '@angular/core';
import {AppConfig} from "../../global-utils/services/appConfig.service";
import { Http, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class PackagingsService {

   private apiUrl:string;
   private itemsPerPage: number=10;
   private filterText = ''; 
   private currentPage = 1;
   private itemsPerPageWhereIs: number=10;
   private filterTextWhereIs = '';  
   private currentPageWhereIs = 1;
   private savedFilters = {
     sortField:'lang.name', 
     sortOrder:1,
     active:true,
     filterActive:false
   };
   
   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

  getPackagings(perPage, page, filterText, sortField, sortOrder, filterLocation?, active?) {

     let params = new URLSearchParams();

     params.set('perPage', perPage);
     params.set('page', page);
     params.set('filterText', filterText);
     params.set('sortField', sortField);
     params.set('sortOrder', sortOrder);
     if(filterLocation)  params.set('filterLocation', JSON.stringify(filterLocation));
     if(active != null) params.set('active', active);

     return this.authHttp.get(this.apiUrl + '/packaging', {search: params}).map(request => <string[]> request.json());
   }

  getLangsPackaging(id) {
    return this.authHttp.get(this.apiUrl + '/packaging/lang?_id=' + id).map(request => <string[]> request.json());
  }

  getPackaging(id, filterLocation?) {
     let params = new URLSearchParams();
  
     params.set('_id', id);
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

      return this.authHttp.get(this.apiUrl + '/packaging/detail', {search: params}).map(request => <string[]> request.json());
  }

  getLocPrices(id) {
     return this.authHttp.get(this.apiUrl + '/packaging/locprices?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }
  
  addPackaging(packaging) {
     return this.authHttp.post(this.apiUrl + '/packaging', packaging).map(request => <string[]> request.json());
   }

  editPackaging(packaging) {
     return this.authHttp.put(this.apiUrl + '/packaging', packaging).map(request => <string[]> request.json());
   }

  deletePackaging(id) {
     return this.authHttp.delete(this.apiUrl + '/packaging?_id=' + id).map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  getPackagingIncludedInProducts(id, perPage, page, filterText, sortField, sortOrder, filterLocation){
    let params = new URLSearchParams();
    params.set('_id',id);
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));    

    return this.authHttp.get(this.apiUrl + '/packaging/packaginginproducts', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deletePackagingIncludedInProducts(id,productId, productVersionId, type){
    let params = new URLSearchParams();
    params.set('_id',id);
    params.set('productId', productId);
    params.set('productVersionId', productVersionId);
    params.set('type',type)

    return this.authHttp.delete(this.apiUrl + '/packaging/packaginginproducts', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteAllPackagingIncludedInRecipes(id,recipe, type){
    let params = new URLSearchParams();
    params.set('packagingId',id);
    params.set('recipeId', recipe._id);
    params.set('type',type)

    return this.authHttp.delete(this.apiUrl + '/packaging/all', {search: params})
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

 }
