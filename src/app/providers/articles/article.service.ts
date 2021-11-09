import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from "@angular/http";
import { AppConfig } from "../../global-utils/services/appConfig.service";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ArticleService {

  private apiUrl:string;
  private itemsPerPage: number=10;
  private filterLocations = [];
  private filterText = ''; 
  private currentPage = 1;
  private redirectData = {
    mode: '',
    providerId: null,
    activated: false
  } 
  private savedFilters = {
     sortField:'lang.description', 
     sortOrder:1
   };

  constructor(public authHttp:Http, public appConfig:AppConfig) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  getArticles(provider, ing_pack, perPage, page, filterText, filterLocation, sortField, sortOrder, noExternalReference?) {
     let params = new URLSearchParams();

     params.set('provider', provider); //providerId
     params.set('ing_pack', ing_pack); //ingredient or packaging Id
     params.set('perPage', perPage);
     params.set('page', page);
     params.set('filterText', filterText);
     params.set('filterLocation', JSON.stringify(filterLocation));
     params.set('sortField', sortField);
     params.set('sortOrder', sortOrder);
     if(noExternalReference) params.set('noExternalReference', 'true');

     return this.authHttp.get(this.apiUrl + '/article', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getIngredients(perPage, page, filterText, sortField, sortOrder, filterLocation?, noQuartering?, active?) {

    let params = new URLSearchParams();
 
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterLocation)  params.set('filterLocation', JSON.stringify(filterLocation));
    if(noQuartering) params.set('noQuartering', noQuartering);
    if(active != null) params.set('active', active);

    return this.authHttp.get(this.apiUrl + '/article/ingredients', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

   articlesByProvider(id, filterLocation) {
     let params = new URLSearchParams();

     params.set('id', id); //ingredient or packaging Id
     params.set('filterLocation', JSON.stringify(filterLocation));

     return this.authHttp.get(this.apiUrl + '/article/articlesbyprovider', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  getArticle(id) {
    return this.authHttp.get(this.apiUrl + '/article/detail?_id=' + id)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  addArticle(article) {
    return this.authHttp.post(this.apiUrl + '/article', article)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  editArticle(article) {
    return this.authHttp.put(this.apiUrl + '/article', article)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  changeHasDataSheet(id, hasDataSheet) {
    let params = new URLSearchParams();

    params.set('id', id); //ingredient or packaging Id
    params.set('hasDataSheet', hasDataSheet); //ingredient or packaging Id

    return this.authHttp.get(this.apiUrl + '/article/changehasdatasheet', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteArticle(id) {
    return this.authHttp.delete(this.apiUrl + '/article?_id=' + id)
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

  public saveFilters(sortField, sortOrder){
    this.savedFilters={
      sortField, 
      sortOrder
    };   
  }
  
  public getSavedFilters(){
    return this.savedFilters;
  }

  // public saveRedirectData(mode, providerId){
  //   this.redirectData.mode = mode;
  //   this.redirectData.providerId = providerId;
  //   this.redirectData.activated = true;
  // }

  // public getRedirectData() {
  //   return this.redirectData;
  // }

  // public resetRedirectData(){
  //   this.redirectData.activated = false;
  //   this.redirectData.providerId = null;
  // }

}