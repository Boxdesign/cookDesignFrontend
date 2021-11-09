import { Component, OnInit, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AuthService } from './global-utils/services/auth.service'
import { UserService } from './global-utils/services/user.service';
import { AccountService } from "./global-utils/services/account.service";
import { SessionService } from "./global-utils/services/session.service";
import { IdleTimeoutService } from "./global-utils/services/idleTimeout.service";
import { SocketService } from "./global-utils/services/socket.service";
import { AppConfig } from "./global-utils/services/appConfig.service";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { CostFilterService } from "./global-utils/services/cost-filter.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [
		'./app.component.css']
})
export class AppComponent implements OnInit {

  public accountSubject: any = new ReplaySubject(1);
  public taxSubject: any = new ReplaySubject(1);
  public organizationSubject: any = new ReplaySubject(1);
  public loggedIn:boolean = false;

  @HostListener('document:click', ['$event'])
	onDocumentClick(e){
		if(this.loggedIn) {
			this.idleTimeoutService.resetTimer();
		}
	}

	constructor(
		public translate:TranslateService, 
		public auth: AuthService, 
		public user: UserService,
		public accountService: AccountService, 
		public sessionService:SessionService, 
		public router: Router,
  	public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
		public appConfig: AppConfig,
		public socketService: SocketService,
		public idleTimeoutService: IdleTimeoutService,
		public costFilterService: CostFilterService
	) 
	{}

	ngOnInit() {

		this.auth.isLoggedIn().subscribe((loggedIn:boolean) => { this.loggedIn = loggedIn})

		this.accountSubject.subscribe((res: any) => {
			//Get account info
	    	this.accountService.getAccountInfo(res.account).subscribe(
		      (data: any) => {
		        this.sessionService.saveAccount(data);	
		      },(err) => { //the request did not complete 

		      });  
		})

		this.taxSubject.subscribe((res: any) => {
	    	this.appConfig.fetchTaxes().subscribe((salesTax: any) => {
	    		this.appConfig.saveTax(salesTax);
	    	});
		});

		this.organizationSubject.subscribe((res: any) => {
	  	this.appConfig.fetchOrganization().subscribe((organizationName: any) => {
	  		this.appConfig.saveOrganization(organizationName);
	  	});
		});

		this.costFilterService.saveCostLocation([]);

		// this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    /*if(localStorage.getItem('language')) {     	
    	this.translate.use(localStorage.getItem('language')); //use language defined in local storage if available
    } else {
    	// use navigator lang if available	    	
			var userLang = navigator.language.split('-')[0]; 
			userLang = /(es|en)/gi.test(userLang) ? userLang : 'es';
			this.translate.use(userLang);
		}*/

    if(localStorage.getItem('token')) {  //there's a token

    	this.auth.setLoggedIn(true); //Assume, for the time being until it is confirmed with the API request below, that the user is authenticated.
    	
    	//API request to check whether user is authenticated.
	    this.auth.initialLoginCheck().subscribe((res: any) => {
		    if(res.isLoggedIn){
		    	this.auth.setLoggedIn(true);
		    	this.socketService.authenticate();
		    	this.translate.use(res.user.language);
		    	this.accountSubject.next(res); //get and save account info
		    	this.taxSubject.next(res); //get and save sales taxes
		    	this.organizationSubject.next(res)
		    	  			
	    	} else { //there is no valid auth associated with token
	    		this.auth.setLoggedIn(false);
	        this.router.navigate(['/login']);
	    	} 		
	    })

    } else { //no token, user is not authenticated
    	this.auth.setLoggedIn(false);
      this.router.navigate(['/login']);
    }

	}

 }	
