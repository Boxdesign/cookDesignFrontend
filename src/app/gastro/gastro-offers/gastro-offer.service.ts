 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { AppConfig } from "../../global-utils/services/appConfig.service";
 import  {Http, URLSearchParams, Response, ResponseContentType  } from "@angular/http";

 @Injectable()
 export class GastroOfferService {

   private apiUrl:string;
   private itemsPerPage: number=10;
   private itemsPerPageMenu: number=10;
   private itemsPerPageDailyMenuCarte: number=10;
   private itemsPerPageBufet: number=10;
   private itemsPerPageCarte: number=10;
   private itemsPerPageFixedPriceCarte: number=10;
   private itemsPerPageCatalog: number=10;
   private filterLocationMenu = []
   private filterLocationDailyMenuCarte = []
   private filterLocationBufet = []
   private filterLocationCarte = []
   private filterLocationFixedPriceCarte = []
   private filterLocationCatalog = []
   private filterTextMenu = '';
   private filterTextDailyMenuCarte = '';
   private filterTextBufet = '';
   private filterTextCarte = '';
   private filterTextFixedPriceCarte = '';
   private filterTextCatalog = '';
    private currentPageMenu = 1;
   private currentPageDailyMenuCarte= 1;
   private currentPageBufet= 1;
   private currentPageCarte= 1;
   private currentPageFixedPriceCarte= 1;
   private currentPageCatalog= 1;
   
   private savedFiltersMenu = {
     sortField:'versions.lang.name', 
     sortOrder:1,
     active: true,
     filterActive: false
   };
   private savedFiltersDailyMenuCarte = {
     sortField:'versions.lang.name', 
     sortOrder:1,
     active: true,
     filterActive: false
   };
   private savedFiltersBufet = {
     sortField:'versions.lang.name', 
     sortOrder:1,
     active: true,
     filterActive: false
   };
   private savedFiltersCarte = {
     sortField:'versions.lang.name', 
     sortOrder:1,
     active: true,
     filterActive: false
   };
   private savedFiltersFixedPriceCarte = {
     sortField:'versions.lang.name', 
     sortOrder:1,
     active: true,
     filterActive: false
   };
   private savedFiltersCatalog = {
     sortField:'versions.lang.name', 
     sortOrder:1,
     active: true,
     filterActive: false
   };

   constructor(public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;
   }  

   getMenus(perPage, page, filterText, sortField, sortOrder, filterLocation, filterType, filterSeason, menuType, active?) {
     let params = new URLSearchParams();

     params.set('perPage', perPage);
     params.set('page', page);
     params.set('filterText', filterText);
     params.set('sortField', sortField);
     params.set('sortOrder', sortOrder);
     params.set('filterLocation', JSON.stringify(filterLocation));
     params.set('filterType', filterType);
     params.set('filterSeason', filterSeason);
     params.set('menuType', menuType);
     if(active != null) params.set('active', active);

     return this.authHttp.get(this.apiUrl + '/gastro-offer', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getMenu(id, versionId, filterLocation?) {

     let params = new URLSearchParams();
  
     params.set('_id', id);
     params.set('_versionId', versionId);
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

     return this.authHttp.get(this.apiUrl + '/gastro-offer/version', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getUserLang(id, versionId) {
     return this.authHttp.get(this.apiUrl + '/gastro-offer/lang?_id=' + id + '&_versionId=' + versionId)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getLocCost(id, versionId, menuType) {
     let params = new URLSearchParams();

     params.set('_id', id);
     params.set('versionId', versionId);
     params.set('menuType', menuType);

     return this.authHttp.get(this.apiUrl + '/gastro-offer/locationcost', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getMenuVersions(id, perPage, page, orderBy, filterText, filterLocation?) {
     
     let params = new URLSearchParams();
     params.set('_id', id);    
     params.set('perPage', perPage);    
     params.set('page', page);    
     params.set('orderBy', orderBy);    
     params.set('filterText', filterText);    
     if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));    

     return this.authHttp.get(this.apiUrl + '/gastro-offer/versions', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addMenu(gastroOffer) {
     return this.authHttp.post(this.apiUrl + '/gastro-offer', gastroOffer)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   addVersion(gastroOffer) {
     return this.authHttp.post(this.apiUrl + '/gastro-offer/version', gastroOffer)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteMenu(id) {
     return this.authHttp.delete(this.apiUrl + '/gastro-offer?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteMenuVersion(id, versionId) {
     return this.authHttp.delete(this.apiUrl + '/gastro-offer/version?_id=' + id + '&&_versionId=' + versionId)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   setAsActiveVersion(id, versionId, menuType) {

     let params = new URLSearchParams();

     params.set('_id', id);
     params.set('versionId', versionId);
     params.set('menuType', menuType);

     return this.authHttp.get(this.apiUrl + '/gastro-offer/version/active', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getElements() {
     return this.authHttp.get(this.apiUrl + '/gastro-offer/elements')
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getCookingSteps(id, versionId) {
     return this.authHttp.get(this.apiUrl + '/gastro-offer/version/cooksteps?_id=' + id + '&_versionId=' + versionId)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getActiveVersion(id) {
     return this.authHttp.get(this.apiUrl + '/gastro-offer/activeversion?_id=' + id)
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   public saveItemsPerPage(itemsPerPage, menuType){
     switch (menuType) {
       case 'menu':
         this.itemsPerPageMenu=itemsPerPage;
         break;
       case 'dailyMenuCarte':
         this.itemsPerPageDailyMenuCarte=itemsPerPage;
         break;
       case 'buffet':
         this.itemsPerPageBufet=itemsPerPage;
         break;
       case 'carte':
         this.itemsPerPageCarte=itemsPerPage;
         break;
       case 'fixedPriceCarte': 
         this.itemsPerPageFixedPriceCarte=itemsPerPage;
         break;
       case 'catalog':
         this.itemsPerPageCatalog=itemsPerPage;
         break;  
       } 
    }   
  
    public getItemsPerPage(menuType){
      switch (menuType) {
        case 'menu':
            return this.itemsPerPageMenu;

        case 'dailyMenuCarte':
            return this.itemsPerPageDailyMenuCarte;
            
        case 'buffet':
            return this.itemsPerPageBufet;
            
        case 'carte':
            return this.itemsPerPageCarte;
            
        case 'fixedPriceCarte':
            return this.itemsPerPageFixedPriceCarte;
           
        case 'catalog':
            return this.itemsPerPageCatalog;
            
      }
    }

  public saveLocationFilter(location, menuType){

     switch (menuType) {
       case 'menu':
         this.filterLocationMenu=location;
         break;
       case 'dailyMenuCarte':
         this.filterLocationDailyMenuCarte=location;
         break;
       case 'buffet':
         this.filterLocationBufet=location;
         break;
       case 'carte':
         this.filterLocationCarte=location;
         break;
       case 'fixedPriceCarte': 
         this.filterLocationFixedPriceCarte=location;
         break;
       case 'catalog':
         this.filterLocationCatalog=location;
         break;  
       } 
  } 

  public getLocationFilter(menuType){
      switch (menuType) {
        case 'menu':
            return this.filterLocationMenu;

        case 'dailyMenuCarte':
            return this.filterLocationDailyMenuCarte;
            
        case 'buffet':
            return this.filterLocationBufet;
            
        case 'carte':
            return this.filterLocationCarte;
            
        case 'fixedPriceCarte':
            return this.filterLocationFixedPriceCarte;
           
        case 'catalog':
            return this.filterLocationCatalog;
            
      }
    }


  public saveSearchFilter(text, menuType){
     switch (menuType) {
       case 'menu':
         this.filterTextMenu=text;
         break;
       case 'dailyMenuCarte':
         this.filterTextDailyMenuCarte=text;
         break;
       case 'buffet':
         this.filterTextBufet=text;
         break;
       case 'carte':
         this.filterTextCarte=text;
         break;
       case 'fixedPriceCarte': 
         this.filterTextFixedPriceCarte=text;
         break;
       case 'catalog':
         this.filterTextCatalog=text;
         break;  
       } 
  }
  
  public getSearchFilter(menuType){
      
      switch (menuType) {
        case 'menu':
            return this.filterTextMenu;

        case 'dailyMenuCarte':
            return this.filterTextDailyMenuCarte;
            
        case 'buffet':
            return this.filterTextBufet;
            
        case 'carte':
            return this.filterTextCarte;
            
        case 'fixedPriceCarte':
            return this.filterTextFixedPriceCarte;
           
        case 'catalog':
            return this.filterTextCatalog;
            
      }
  }

  public saveCurrentPage(currentPage, menuType){
     switch (menuType) {
       case 'menu':
         this.currentPageMenu=currentPage;
         break;
       case 'dailyMenuCarte':
         this.currentPageDailyMenuCarte=currentPage;
         break;
       case 'buffet':
         this.currentPageBufet=currentPage;
         break;
       case 'carte':
         this.currentPageCarte=currentPage;
         break;
       case 'fixedPriceCarte': 
         this.currentPageFixedPriceCarte=currentPage;
         break;
       case 'catalog':
         this.currentPageCatalog=currentPage;
         break;  
       } 
  }
  
  public getCurrentPage(menuType){
      
      switch (menuType) {
        case 'menu':
            return this.currentPageMenu;

        case 'dailyMenuCarte':
            return this.currentPageDailyMenuCarte;
            
        case 'buffet':
            return this.currentPageBufet;
            
        case 'carte':
            return this.currentPageCarte;
            
        case 'fixedPriceCarte':
            return this.currentPageFixedPriceCarte;
           
        case 'catalog':
            return this.currentPageCatalog;
            
      }
  }

  public saveFilters(sortField, sortOrder, menuType, active, filterActive){
     switch (menuType) {
       case 'menu':
         this.savedFiltersMenu={
           sortField, 
           sortOrder,
           active,
           filterActive
         };
         break;
       case 'dailyMenuCarte':
         this.savedFiltersDailyMenuCarte={
           sortField, 
           sortOrder,
           active,
           filterActive
         }
         break;
       case 'buffet':
         this.savedFiltersBufet={
           sortField, 
           sortOrder,
           active,
           filterActive
         }
         break;
       case 'carte':
         this.savedFiltersCarte={
           sortField, 
           sortOrder,
           active,
           filterActive
         }
         break;
       case 'fixedPriceCarte': 
         this.savedFiltersFixedPriceCarte={
           sortField, 
           sortOrder,
           active,
           filterActive
         }
         break;
       case 'catalog':
         this.savedFiltersCatalog={
           sortField, 
           sortOrder,
           active,
           filterActive
         }
         break;  
       } 
  }

    public getSavedFilters(menuType){
      
      switch (menuType) {
        case 'menu':
            return this.savedFiltersMenu;

        case 'dailyMenuCarte':
            return this.savedFiltersDailyMenuCarte;
            
        case 'buffet':
            return this.savedFiltersBufet;
            
        case 'carte':
            return this.savedFiltersCarte;
            
        case 'fixedPriceCarte':
            return this.savedFiltersFixedPriceCarte;
           
        case 'catalog':
            return this.savedFiltersCatalog;
            
      }
  }

  duplicateGastroOffer(id, name, location) {

     let params = new URLSearchParams();
  
     params.set('_id', id);
     params.set('name', name);
     params.set('location', JSON.stringify(location));

     return this.authHttp.get(this.apiUrl + '/gastro-offer/duplicate', {search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));   
   }

}
