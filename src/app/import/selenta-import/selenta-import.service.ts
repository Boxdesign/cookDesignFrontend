 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { AppConfig } from "../../global-utils/services/appConfig.service";
 import { Http, URLSearchParams, Response, ResponseContentType } from "@angular/http";

 @Injectable()
 export class SelentaImportService {

  private apiUrl:string;
  private conflictLogFilterText ='';
  private updateLogFilterText='';
  private sapArticlesFilterText='';

  constructor(public authHttp:Http, public appConfig:AppConfig) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  getSelentaSapNewArticles(perPage, page, filterText, sortField, sortOrder) {
    let params = new URLSearchParams();

    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);

    return this.authHttp.get(this.apiUrl + '/selentaImport/newArticles', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSelentaSapNewProviders(perPage, page, filterText, sortField, sortOrder) {
    let params = new URLSearchParams();

    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);

    return this.authHttp.get(this.apiUrl + '/selentaImport/newProviders', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteSelentaSapArticle(articleId, providerId) {
    let params = new URLSearchParams();

    params.set('articleId', articleId);
    params.set('providerId', providerId);

    return this.authHttp.delete(this.apiUrl + '/selentaImport/newArticles', {search: params})
    .map(request => <string[]> request.json())    
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteSelentaSapProvider(providerId) {
    let params = new URLSearchParams();

    params.set('providerId', providerId);

    return this.authHttp.delete(this.apiUrl + '/selentaImport', {search: params})
    .map(request => <string[]> request.json())    
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSelentaDeletedArticles(perPage, page, filterText, filterLocation, sortField, sortOrder) {
    let params = new URLSearchParams();

    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('filterLocation', JSON.stringify(filterLocation));
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);

    return this.authHttp.get(this.apiUrl + '/selentaImport/deletedArticles', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSelentaDeletedProviders(perPage, page, filterText, filterLocation, sortField, sortOrder) {
    let params = new URLSearchParams();

    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('filterLocation', JSON.stringify(filterLocation));
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);

    return this.authHttp.get(this.apiUrl + '/selentaImport/deletedProviders', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSelentaUpdatedArticles(filterText) {

    let params = new URLSearchParams();
    params.set('filterText', filterText);

    return this.authHttp.get(this.apiUrl + '/selentaImport/updatedArticles', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSelentaArticlesConflicts(filterText) {

    let params = new URLSearchParams();
    params.set('filterText', filterText);

    return this.authHttp.get(this.apiUrl + '/selentaImport/articlesConflicts', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSelentaSapArticles(perPage, page, filterText, sortField, sortOrder) {
    let params = new URLSearchParams();

    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);

    return this.authHttp.get(this.apiUrl + '/selentaImport/articles', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSelentaSapArticle(MATNR, LIFNR) {
    let params = new URLSearchParams();

    params.set('MATNR', MATNR);
    params.set('LIFNR', LIFNR);

    return this.authHttp.get(this.apiUrl + '/selentaImport/article', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSelentaSapProviders(perPage, page, filterText, sortField, sortOrder) {
    let params = new URLSearchParams();

    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);

    return this.authHttp.get(this.apiUrl + '/selentaImport/providers', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSelentaSapFamilies(perPage?, page?, filterText?, sortField?, sortOrder?) {
    let params = new URLSearchParams();

    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);

    return this.authHttp.get(this.apiUrl + '/selentaImport/family', {search:params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getSelentaCookDesignFamilies(perPage?, page?, filterText?, sortField?, sortOrder?) {
    let params = new URLSearchParams();

    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);

    return this.authHttp.get(this.apiUrl + '/selentaImport/familycookdesign', {search:params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteSelentaSapFamily(familyId) {
    let params = new URLSearchParams();

    params.set('familyId', familyId);

    return this.authHttp.delete(this.apiUrl + '/selentaImport/family', {search: params})
    .map(request => <string[]> request.json())    
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  public saveConflictLogSearchFilter(text){
      this.conflictLogFilterText=text;    
  }
  
  public getConflictLogSearchFilter(){
    return this.conflictLogFilterText;
  }

  public saveUpdateLogSearchFilter(text){
      this.updateLogFilterText=text;    
  }
  
  public getUpdateLogSearchFilter(){
    return this.updateLogFilterText;
  }

  public saveSapArticlesSearchFilter(text){
      this.sapArticlesFilterText=text;    
  }
  
  public getSapArticlesSearchFilter(){
    return this.sapArticlesFilterText;
  }  

}