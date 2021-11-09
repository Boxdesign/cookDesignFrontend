import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { AppConfig } from "../../global-utils/services/appConfig.service";
import { Http, URLSearchParams } from "@angular/http";


@Injectable()
export class UploadService {
    private progress;
    public progress$;
    private progressObserver;
    private apiUrl:string;
    private itemsPerPage: number=10;
    private currentPage = 1;



  constructor (public authHttp:Http, public appConfig:AppConfig) {
     this.apiUrl = this.appConfig.apiUrl;      
  }
  
  public makeFileRequest (url: string, params: any[], file: File, folderPath: string): Observable<any> {
    return Observable.create(observer => {

        let formData: FormData = new FormData(),
            xhr: XMLHttpRequest = new XMLHttpRequest();

        formData.append("file", file, file.name);
        formData.append("folderPath", folderPath)
        params.forEach((param) => {
            formData.append(param.key, param.value)
        })   
       
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    observer.next(JSON.parse(xhr.response));
                    observer.complete();
                } else {
                    observer.error(xhr.response);
                }
            }
        };        
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
        xhr.send(formData);
    });
  }

  listFiles(prefix) {
     let params = new URLSearchParams();
     params.set('prefix', prefix);
     return this.authHttp.get(this.apiUrl + '/document/listFiles',{search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   getFile(key) {
     let params = new URLSearchParams();
     params.set('key', key);
     return this.authHttp.get(this.apiUrl + '/document/getFile',{search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

   deleteFile(key) {
     let params = new URLSearchParams();
     params.set('key', key);
     return this.authHttp.delete(this.apiUrl + '/document/deleteFile',{search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
   }

  changeName(file) {
     let params = new URLSearchParams();
     params.set('newName', file.newName);
     params.set('key', file.Key);
     params.set('name', file.name);
     return this.authHttp.get(this.apiUrl + '/document/changeName',{search: params})
     .map(request => <string[]> request.json())
     .catch((error:any) => Observable.throw(error.json() || 'Server error'));
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