
import {Injectable} from '@angular/core';
import {
  Http,
  Request,
  RequestOptionsArgs,
  Response,
  XHRBackend,
  RequestOptions,
  ConnectionBackend,
  Headers
} from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from "./auth.service";
import { IdleTimeoutService } from "./idleTimeout.service";
import { SocketService } from "./socket.service";
import 'rxjs/Rx';

/*
 Este archivo se encarga de manipular los headers de las peticiones http
 Tambien se encargara de capturar los errores del servidor y los  401 para redirigir al login
 */

@Injectable()
export class AuthHttp extends Http {
  constructor(
  	backend:ConnectionBackend, 
  	defaultOptions:RequestOptions, 
  	private _router:Router,
  	private idleTimeoutService: IdleTimeoutService,
  	private socketService: SocketService
  ) {
    super(backend, defaultOptions);
  //console.log('using authhttp');
  }

  request(url:string | Request, options?:RequestOptionsArgs):Observable<Response> {
    return this.intercept(super.request(url, this.getRequestOptionArgs(options)));
  }

  get(url:string, options?:RequestOptionsArgs):Observable<Response> {
    return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
  }

  post(url:string, body:string, options?:RequestOptionsArgs):Observable<Response> {
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }

  put(url:string, body:string, options?:RequestOptionsArgs):Observable<Response> {
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }

  delete(url:string, options?:RequestOptionsArgs):Observable<Response> {
    return this.intercept(super.delete(url, this.getRequestOptionArgs(options)));
  }

  getRequestOptionArgs(options?:RequestOptionsArgs):RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.set('Authorization', localStorage.getItem('token'));

    options.headers.append('Content-Type', 'application/json');
    //console.log(options);
    return options;
  }

  intercept(observable:Observable<Response>):Observable<Response> {
    return observable.catch((err, source) => {
      
      if (err.status == 401) {

        localStorage.removeItem('token');
        this._router.navigate(['/login']);
        return Observable.empty();

      } else {

        return Observable.throw(err);

      }

    });

  }
}

