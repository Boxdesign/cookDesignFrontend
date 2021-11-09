import { Injectable } from '@angular/core';
import {AppConfig} from "../../global-utils/services/appConfig.service";
import { Http, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class AccountService {

   private apiUrl:string;
   private itemsPerPage: number=10;
   private filterLocations = [];
   private filterText = ''; 
   private currentPage = 1; 

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

  getAccountInfo(id?) {
    
    let params = new URLSearchParams();
  	if (id) params.set('_id', id);

    return this.authHttp.get(this.apiUrl + '/account/detail', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  getUserAccounts(activeFilter?, _id?, perPage?, page?, filterText?, sortField?, sortOrder?) {

     let params = new URLSearchParams();
     if(activeFilter) params.set('activeFilter', activeFilter);
     if(_id) params.set('_id', _id);
     if(perPage) params.set('perPage', perPage);
     if(page) params.set('page', page);
     if(filterText) params.set('filterText', filterText);
     if(sortField) params.set('sortField', sortField);
     if(sortOrder) params.set('sortOrder', sortOrder);

    return this.authHttp.get(this.apiUrl + '/account', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  addAccount(account) {
     return this.authHttp.post(this.apiUrl + '/account', account)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  editAccount(account) {
     return this.authHttp.put(this.apiUrl + '/account', account)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  deleteAccount(id) {
     return this.authHttp.delete(this.apiUrl + '/account?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  saveItemsPerPage(itemsPerPage){
    this.itemsPerPage=itemsPerPage;
  }

  getItemsPerPage(){
    // this._emitter.next(this.itemsPerPage)
    return this.itemsPerPage;
  }

  saveLocationFilter(locations){
      this.filterLocations=locations;    
  }
  
  getLocationFilter(){
    return this.filterLocations;
  }

  saveSearchFilter(text){
      this.filterText=text;    
  }
  
  getSearchFilter(){
    return this.filterText;
  }

  saveCurrentPage(page){
      this.currentPage=page;    
  }
  
  getCurrentPage(){
    return this.currentPage;
  }
}