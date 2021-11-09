import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from "@angular/http";
import { AppConfig } from "../../global-utils/services/appConfig.service";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MeasurementUnitService {

  private apiUrl: string;

  constructor(public authHttp: Http, public appConfig: AppConfig) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  getUnits(perPage, page, orderBy, filterText) {
    return this.authHttp.get(this.apiUrl + '/measurementUnit?perPage=' + perPage + '&page=' + page + '&orderBy=' + orderBy + '&filterText=' + filterText)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));

  }

  getBaseUnits() {
    return this.authHttp.get(this.apiUrl + '/measurementUnit/base')
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getLangsUnidades(id) {
    return this.authHttp.get(this.apiUrl + '/measurementUnit/details?_id=' + id)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));

  }

  addUnit(unidad) {
    return this.authHttp.post(this.apiUrl + '/measurementUnit', unidad)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  editUnit(unidad) {
    return this.authHttp.put(this.apiUrl + '/measurementUnit', unidad)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteUnit(id) {
    return this.authHttp.delete(this.apiUrl + '/measurementUnit?_id=' + id)
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));

  }

  deleteConversionUnit(parentUnitId, conversionUnitId) {
    
    let params = new URLSearchParams();
    params.set('parentUnitId', parentUnitId);
    params.set('conversionUnitId', conversionUnitId);

    return this.authHttp.delete(this.apiUrl + '/measurementUnit/conversion', {search: params})
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }  

  getConversionTable() {
    return this.authHttp.get(this.apiUrl + '/measurementUnit/conversion')
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  fetchIsoCodes(){
    return this.authHttp.get(this.apiUrl + '/config/isoCodes')
    .map(request => <any> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }
}
