import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import {AppConfig} from "../../global-utils/services/appConfig.service";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AllergenService {

  private apiUrl:string;

  constructor(public authHttp:Http, public appConfig:AppConfig) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  getAllergens(perPage?, page?, sortField?, sortOrder?,filterText?) {
    let params = new URLSearchParams();
    params.set('perPage', perPage);
    params.set('page', page);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if(filterText)params.set('filterText', filterText);

    return this.authHttp.get(this.apiUrl + '/allergen', {search: params}).map(request => <string[]> request.json());
    //return Promise.resolve(AllergenES);
  }

  getLangsAllergen(id) {
    return this.authHttp.get(this.apiUrl + '/allergen/details?_id=' + id).map(request => <string[]> request.json());
  }


  addAllergen(allergen) {
    return this.authHttp.post(this.apiUrl + '/allergen', allergen).map(request => <string[]> request.json());
  }

  editAllergen(allergen) {
    return this.authHttp.put(this.apiUrl + '/allergen', allergen).map(request => <string[]> request.json());
  }

  deleteAllergen(id) {
    return this.authHttp.delete(this.apiUrl + '/allergen?_id=' + id).map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));

  }

}
