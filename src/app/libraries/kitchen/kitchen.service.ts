 import { Injectable } from '@angular/core';
 import { AppConfig } from "../../global-utils/services/appConfig.service";
 import { Http, URLSearchParams } from "@angular/http";
 import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class KitchenService {

   private apiUrl:string;
   private itemsPerPage: number=10;
   private filterLocations = [];
   private filterText = ''; 
   private currentPage = 1; 


   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }

   getKitchens(perPage, page, filterText, sortField, sortOrder, filterLocation) {
     // meter URLsearchparams

     let params = new URLSearchParams();

     params.set('perPage', perPage);
     params.set('page', page);
     params.set('filterText', filterText);
     params.set('sortField', sortField);
     params.set('sortOrder', sortOrder);
     params.set('filterLocation', JSON.stringify(filterLocation));

     return this.authHttp.get(this.apiUrl + '/kitchen', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getLangsKitchen(id) {
     // meter URLsearchparams
     //console.log(id,'kitchenId')
    return this.authHttp.get(this.apiUrl + '/kitchen/details?_id=' + id)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

   addKitchen(kitchen) {
     //console.log(kitchen,'kitchen')
     return this.authHttp.post(this.apiUrl + '/kitchen', kitchen)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   editKitchen(kitchen) {
     return this.authHttp.put(this.apiUrl + '/kitchen', kitchen)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }


   deleteKitchen(id) {
     return this.authHttp.delete(this.apiUrl + '/kitchen?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));

   }

   getWorkRooms(perPage, page, filterText, sortField, sortOrder) {
     // meter URLsearchparams

     let params = new URLSearchParams();

     params.set('perPage', perPage);
     params.set('page', page);
     params.set('filterText', filterText);
     params.set('sortField', sortField);
     params.set('sortOrder', sortOrder);
     
     return this.authHttp.get(this.apiUrl + '/kitchen/workRoom', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getLangsWorkRoom(id) {
     // meter URLsearchparams
    return this.authHttp.get(this.apiUrl + '/kitchen/workRoom/details?_id=' + id)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

   addWorkRoom(workRoom) {
     console.log(workRoom, 'workRoom')
     return this.authHttp.post(this.apiUrl + '/kitchen/workRoom', workRoom)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   editWorkRoom(workRoom) {
     return this.authHttp.put(this.apiUrl + '/kitchen/workRoom', workRoom)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }


   deleteWorkRoom(id) {
     return this.authHttp.delete(this.apiUrl + '/kitchen/workRoom?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));

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

  public saveItemsPerPage(itemsPerPage){
    this.itemsPerPage=itemsPerPage;
  }

  public getItemsPerPage(){
    // this._emitter.next(this.itemsPerPage)
    return this.itemsPerPage;
  }


 }