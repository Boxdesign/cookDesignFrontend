 import { Injectable } from '@angular/core';
 import { AppConfig } from "../../global-utils/services/appConfig.service";
 import { Http, URLSearchParams, RequestOptions } from "@angular/http";
 import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class IngredientsService {

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

     return this.authHttp.get(this.apiUrl + '/ingredient', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getLangsIngredient(id) {
     return this.authHttp.get(this.apiUrl + '/ingredient/lang?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getIngredient(id, filterLocation?) {
     let params = new URLSearchParams();
  
     params.set('_id', id);
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

     return this.authHttp.get(this.apiUrl + '/ingredient/detail', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getLocPrices(id) {
     return this.authHttp.get(this.apiUrl + '/ingredient/locprices?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  getLocAllergens(id) {
     return this.authHttp.get(this.apiUrl + '/ingredient/locallergens?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addIngredient(ingredient) {
     return this.authHttp.post(this.apiUrl + '/ingredient', ingredient)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   editIngredient(ingredient) {
     return this.authHttp.put(this.apiUrl + '/ingredient', ingredient)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));;
   }

   editBatch(batch) {
     return this.authHttp.put(this.apiUrl + '/ingredient/batch', batch)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteIngredient(id) {
     return this.authHttp.delete(this.apiUrl + '/ingredient?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));

   }

   getQuarterings(id, perPage, page, filterText, sortField, sortOrder, filterLocation?) {

     let params = new URLSearchParams();
  
     params.set('ingredientId', id);
     params.set('perPage', perPage);
     params.set('page', page);
     params.set('filterText', filterText);
     params.set('sortField', sortField);
     params.set('sortOrder', sortOrder);
     if(filterLocation)  params.set('filterLocation', JSON.stringify(filterLocation));

     return this.authHttp.get(this.apiUrl + '/ingredient/quarter',{search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addQuartering(quartering) {
     return this.authHttp.post(this.apiUrl + '/ingredient/quarter', quartering)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   editQuartering(quartering) {
     return this.authHttp.put(this.apiUrl + '/ingredient/quarter', quartering)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteQuartering(id) {

     let params = new URLSearchParams();
     params.set('id', id);     

     return this.authHttp.delete(this.apiUrl + '/ingredient/quarter', {search:params})
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

   getIngredientIncludedInRecipes(id,perPage, page,filterText, sortField, sortOrder, filterLocation){
    let params = new URLSearchParams();
    params.set('_id',id);
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('filterText', filterText);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));    

    return this.authHttp.get(this.apiUrl + '/ingredient/ingredientinrecipes', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteIngredientIncludedInRecipes(id,recipeId, recipeVersionId, type){
    let params = new URLSearchParams();
    params.set('ingredientId',id);
    params.set('recipeId', recipeId);
    params.set('recipeVersionId', recipeVersionId);
    params.set('type',type)

    return this.authHttp.delete(this.apiUrl + '/ingredient/ingredientinrecipes', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteAllIngredientIncludedInRecipes(id,recipe, type){
    let params = new URLSearchParams();
    params.set('ingredientId',id);
    params.set('recipeId', recipe._id);
    params.set('type',type)

    return this.authHttp.delete(this.apiUrl + '/ingredient/all', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  uploadFileToUrl(files, restObj) {
    // Note that setting a content-type header
    // for mutlipart forms breaks some built in
    // request parsers like multer in express.
    console.log(files, 'files')
    const options = new RequestOptions();
    const formData = new FormData();

    // Append files to the virtual form.
    formData.append(files.name, files)
    

    // Optional, append other kev:val rest data to the form.
    Object.keys(restObj).forEach(key => {
      formData.append(key, restObj[key]);
    });
    // Send it.
    return this.authHttp.post(this.apiUrl + '/gallery', formData)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
      //.toPromise()
      //.catch(this.handleError);
  }
}