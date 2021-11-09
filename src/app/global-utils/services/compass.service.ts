import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from "@angular/http";
import { AppConfig } from "../../global-utils/services/appConfig.service";
import { Observable } from 'rxjs/Observable';
import { Redirect } from '../models/redirect.model'

@Injectable()
export class CompassService {

  private apiUrl:string;
  private itemsPerPage: number=10;
  private filterLocations = [];
  private filterText = ''; 
  private currentPage = 1;
  private redirectData = [];

  constructor(public authHttp:Http, public appConfig:AppConfig) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  public saveRedirectData(originPath, id, versionId, mode){
  	this.redirectData.push(new Redirect(originPath, id, versionId, mode, true));
  }

  public getRedirectData() {
    return this.redirectData[this.redirectData.length-1];
  }

  public resetRedirectData(){
    this.redirectData.pop();
  }

  public deleteRedirectData() {
    this.redirectData = [];
  }

}