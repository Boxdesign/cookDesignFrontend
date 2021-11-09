import {Injectable, Inject} from '@angular/core';
import {Http, Response} from '@angular/http';
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {AppConfig} from "./appConfig.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import { SessionService } from './session.service'

@Injectable()
export class AuthService {
  public loggedIn = new ReplaySubject(1);
  public loggingOut = new Subject;
  private userRole;
  private apiUrl:String;

  // store the URL so we can redirect after logging in
  redirectUrl:string;

  constructor(
  	private http:Http, 
  	private router : Router, 
  	public appConfig: AppConfig,
    private sessionService: SessionService
  ) {}

  doLogin(email, password) {
    return this.http.post(this.appConfig.apiUrl + '/auth/login', {
      'email': email,
      'password': password
    })
    .map(request => <string[]> request.json())
    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  useAccount(account) {
    return this.http.post(this.appConfig.apiUrl + '/auth/account', account)
      .map(request => <string[]> request.json())
      .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  saveLogin (token){
    localStorage.setItem('token', token);
  }

  saveRole (role){
    this.userRole = role;
  }

  getPermissions () {
    return this.userRole.entities;
  }

  isLoggedIn(){
    return this.loggedIn;
  }

  initialLoginCheck() {
    return this.http.get(this.appConfig.apiUrl + '/auth/loggedin')
      .map(request => <string[]> request.json())
      .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  setLoggedIn(status){
    this.loggedIn.next(status);
  }

  //Used in ca-deactivate service to bypass canDeactivate function in component
  isLoggingOut(){
  	return this.loggingOut
  }

  doLogout() {
  	this.loggingOut.next(true)
    localStorage.removeItem('token');
    localStorage.removeItem('language');
    this.router.navigate(['login']);
  }

}
