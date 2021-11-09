import { Input, Output, Component, OnInit, ViewContainerRef, EventEmitter} from '@angular/core';
import { FileUploader} from 'ng2-file-upload';
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { UserService } from "../user.service";
import { LocationService } from "../../../global-utils/services/location.service";
import { AccountService } from "../../../global-utils/services/account.service";
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { User } from '../../../global-utils/models/user.model'

@Component({
  selector: 'user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss']
})
export class UserPasswordComponent implements OnInit {
	public mode;
  public id: string;
  public userCreatedTitle;
  public userCreatedContent;
  public userUpdatedTitle;
  public userUpdatedContent;
  public user;
  public apiUrl;
  public password;
  public repeatPassword;
  public passwordChangedTitle;
  public passwordChangedContent;
  public passwordsDoNotMatch;

  public options = {
     timeOut: 1500,
    position: ["top", "right"]
   }
  
  constructor(public router: Router, public appConfig: AppConfig, public locationService: LocationService,
    public userService: UserService, public accountService: AccountService, public route: ActivatedRoute,
    public notification: NotificationsService, public translate: TranslateService) { 

	}

  ngOnInit() {
  	this.apiUrl = this.appConfig.apiUrl;
    this.route.params.subscribe(params => {this.id=params['id'];});

    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });

  	this.translation();
  }

  public translation(){
    this.translate.get('admin.user.notifications.passwordChangedTitle').subscribe((res: string) => {
      this.passwordChangedTitle = res;
    });

    this.translate.get('admin.user.notifications.passwordChangedContent').subscribe((res: string) => {
      this.passwordChangedContent = res;
    });

    this.translate.get('admin.user.notifications.passwordsDoNotMatch').subscribe((res: string) => {
      this.passwordsDoNotMatch = res;
    });
  }

  public changePassword() {

  	if (this.password == this.repeatPassword) {
	  	let data = {
	  		_id: this.id,
	  		'password' : this.password
	  	}

	    this.userService.changePassword(data).subscribe(
	      (data) => {
	        this.notification.success(this.passwordChangedTitle, this.passwordChangedContent);
	      },
	      (err) => {
	        this.notification.error('Error', err || 'Server error');
	      });
  	} else {
  			//console.log('passwords do not match')
        this.notification.error('Error', this.passwordsDoNotMatch);
  	}
  }
}
