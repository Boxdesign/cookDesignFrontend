/**
 * Created by odin on 4/08/16.
 */
import {Injectable} from '@angular/core';
import {AppConfig} from "../../global-utils/services/appConfig.service";
import { Http, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FamilyService {

  private apiUrl: string;
  private itemsPerPage: number=10;
  private filterLocations = [];
  private filterText = ''; 
  private currentPage = 1; 

  constructor(public authHttp: Http, public appConfig: AppConfig) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  getFamily(category, perPage, page, sortField, sortOrder, filterText?, externalFamilies?, filterLocation?) {
   
    let params = new URLSearchParams();
    params.set('category', category);
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterText) params.set('filterText', filterText);
    if(externalFamilies) params.set('externalFamilies', externalFamilies);
    if(filterLocation) params.set('filterLocation', JSON.stringify(filterLocation));

    return this.authHttp.get(this.apiUrl + '/family', {search: params}).map(request => <string[]> request.json());
    //return Promise.resolve(familyES);
  }

  getLangsFamily(id) {
    return this.authHttp.get(this.apiUrl + '/family/details?_id=' + id).map(request => <string[]> request.json());
  }

  getLangsSubFamily(id) {
    return this.authHttp.get(this.apiUrl + '/family/details/subfamily?_id=' + id).map(request => <string[]> request.json());
  }

  getFamilyCategories() {
    return this.authHttp.get(this.apiUrl + '/family/categories').map(request => <string[]> request.json());
  }

  addFamily(family) {
    return this.authHttp.post(this.apiUrl + '/family', family).map(request => <string[]> request.json());
  }

  addSubfamily(subFam) {
    return this.authHttp.post(this.apiUrl + '/family/subfamily', subFam).map(request => <string[]> request.json());

  }

  editFamily(family) {
    return this.authHttp.put(this.apiUrl + '/family', family).map(request => <string[]> request.json());
  }

  editSubFamily(subfamily) {
    return this.authHttp.put(this.apiUrl + '/family/subfamily', subfamily).map(request => <string[]> request.json());
  }

  deleteFamily(id) {
    return this.authHttp.delete(this.apiUrl + '/family?_id=' + id)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteSubfamily(id) {
    return this.authHttp.delete(this.apiUrl + '/family/subfamily?_id=' + id)
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

}
