import { Component, OnInit, trigger, state, style, transition, animate, ViewChild } from '@angular/core';
import { Router }      from '@angular/router';
import { AuthService } from '../global-utils/services/auth.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { UserService } from '../global-utils/services/user.service';
import { AccountService } from '../global-utils/services/account.service';
import { SessionService } from "../global-utils/services/session.service";
import { AppConfig } from '../global-utils/services/appConfig.service'
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { CostFilterService } from "../global-utils/services/cost-filter.service";
import { IdleTimeoutService } from "../global-utils/services/idleTimeout.service";
import { SocketService } from "../global-utils/services/socket.service";


@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('loginState', [
    state('inactive', style({opacity: '0'})),
    state('active',   style({opacity: '1'})),
    transition('inactive => active', animate('300ms ease-in')),
  ]),
    trigger('headlineState', [
    state('inactive', style({opacity: '0'})),
    state('active',   style({opacity: '1'})),
    transition('inactive => active', animate('300ms ease-in')),
  ])
]  
})
export class LoginComponent implements OnInit {

  message: string;
  email: string;
  password: string;
  accounts: any[];
  accountsReady:boolean = false;
  account;
  public taxSubject: any = new ReplaySubject(1);
  public organizationSubject: any = new ReplaySubject(1);
  public loginFormState: boolean = false;
  public headlineBoxState = 'active';
  public viewLogin;
  public filterLocations = [];
  public loginError: boolean = false;
  @ViewChild('loginPassword') loginPassword;	
  @ViewChild('accountsSelector') accountsSelector;	

  constructor(
  	public router: Router, 
  	public authService: AuthService, 
  	public translate: TranslateService, 
    public user: UserService, 
    public accountService: AccountService, 
    public sessionService: SessionService,
    public appConfig: AppConfig,
    public costFilterService: CostFilterService,
    public socketService:SocketService,
    public idleTimeoutService:IdleTimeoutService
  ) 
  {
    translate.setDefaultLang('en');
    translate.use('es');
  }

  ngOnInit() {
    this.setMessage();
    this.taxSubject.subscribe((res: any) => {
        this.appConfig.fetchTaxes().subscribe((salesTax: any) => {
          this.appConfig.saveTax(salesTax);
        });
    })  

		this.organizationSubject.subscribe((res: any) => {
	  	this.appConfig.fetchOrganization().subscribe((organizationName: any) => {
	  		this.appConfig.saveOrganization(organizationName);
	  	});
		});
  }

  setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn() ? 'in' : 'out');
  }

  login() {
    this.message = 'Trying to log in ...';
    this.authService.doLogin(this.email, this.password).subscribe(
      (data: any) => {
        this.authService.saveLogin(data.token);
       	this.loginError=false;

        this.accountService.getUserAccounts(true).subscribe( //Gets user accounts with active filter
          (data: any) => {
            this.accounts = data.account;
            this.account=this.accounts[0]; //set default option
            this.accountsReady = true; 
          })             
      },
      (err) => {
      	this.loginError=true;
      }
    );
  }

  accountSelected(index) {
    this.account = this.accounts[index];
  }

  setAccount(){

    let accountObj = {
      'account' : this.account._id
    }

    this.authService.useAccount(accountObj).subscribe( (data) => {

    	//Check locations if set in account
    	if(data.checkLocOnLogin) {
    		this.filterLocations = data.location.map((loc) => { return loc._id;})
    		this.costFilterService.saveCostLocation(this.filterLocations);
    	}

      //Save account data in session service
      this.sessionService.saveAccount(data);
      this.taxSubject.next(data); //get sales taxes
      this.organizationSubject.next(data); //get org name
      this.authService.setLoggedIn(true);
      this.socketService.authenticate();
      this.idleTimeoutService.startTimer();

      //Set user language
      let language = this.sessionService.userLanguage();
      this.translate.use(language);
      localStorage.setItem('language', language); //save language in local store

      //Redirect user
      let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '';
      // Redirect the user
      this.router.navigate([redirect]);
    },
      (err) => {
        alert('Error seleccionando cuenta.');
      }
    );
  }

  logout() {
    this.authService.doLogout();
    this.setMessage();
  }

	public keytab(event){

		this.loginPassword.nativeElement.focus()
    // let element = event.srcElement.nextElementSibling; // get the sibling element

    // if(element == null)  // check if its null
    //     return;
    // else
    //     element.focus();   // focus if not null
	}  

  public setTranslation(){
      
  }

  public toggleLogin(){
    this.loginFormState = true;
    this.headlineBoxState = 'inactive';
  }

}