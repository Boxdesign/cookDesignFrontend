import { Input, Output, Component, OnInit, ViewContainerRef, EventEmitter} from '@angular/core';
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { UserService } from "../user.service";
import { LocationService } from "../../../global-utils/services/location.service";
import { AccountService } from "../../../global-utils/services/account.service";
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { User } from '../../../global-utils/models/user.model'
import { Subject, Observable} from 'rxjs/Rx'



@Component({
  selector: 'user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})
export class UserMainComponent implements OnInit {
  
  public mode;
  public id: string;
  public userLocations;
  public selectedLocations = [];
  public account;
  public userCreatedTitle;
  public userCreatedContent;
  public userUpdatedTitle;
  public userUpdatedContent;
  public user;
  public apiUrl;
  public uploadUrl;
  public passwordsDoNotMatch;

  public options = {
     timeOut: 1500,
    position: ["top", "right"]
   }

  public repeat_password='';
  public languages;
  public upload = new Subject();

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

    if (this.mode == 'new') {
      this.user = new User();
    }
    else {
      this.getUser();
    }
    this.getLanguages();
    this.translation();
    this.getUserLocations();
    
  }

  public translation(){
    this.translate.get('admin.user.notifications.userCreatedTitle').subscribe((res: string) => {
      this.userCreatedTitle = res;
    });

    this.translate.get('admin.user.notifications.userCreatedContent').subscribe((res: string) => {
      this.userCreatedContent = res;
    });

    this.translate.get('admin.user.notifications.userUpdatedTitle').subscribe((res: string) => {
      this.userUpdatedTitle = res;
    });

    this.translate.get('admin.user.notifications.userUpdatedContent').subscribe((res: string) => {
      this.userUpdatedContent = res;
    }); 

     this.translate.get('admin.user.notifications.passwordsDoNotMatch').subscribe((res: string) => {
      this.passwordsDoNotMatch = res;
    });
  }  

  public uploadImage(){
    //When saving, first send a notification to the crop and upload component to upload the image.
    this.upload.next(true);
  }

  public imageUploadFinished(){
    //Called by the crop and upload component after finishing upload
    this.saveUser();
  }

  public getUserLocations() {
    this.locationService.getUserLocations().subscribe(
      (data: any)=> {
        this.userLocations = data;
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

   public languageSelected(i){
    this.user.language=this.languages[i].langCode;
  }

  public getLanguages(){
    this.appConfig.getAppLanguages().subscribe(
      (data) => {
        this.languages=data.languages;
        if(this.mode == 'new') this.user.language=this.languages[0].langCode;
      })
  }

  public getAccountInfo(){
     this.accountService.getAccountInfo(this.user.last_account).subscribe(
      (data: any)=> {
        this.account = data;
        this.getLanguages();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getUser() {
    this.userService.getUser(this.id).subscribe(
      (data) => {
        this.user=data;

        this.getAccountInfo();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      });
  }

  public saveUser() {

    if (this.mode == 'new') {

    	if(this.user.password == this.repeat_password){
		      this.userService.addUser(this.user).subscribe(
		        (data) => {        
		          this.notification.success(this.userCreatedTitle, this.userCreatedContent);
		        },
		        (err) => {
		            this.notification.error('Error', err || 'Error');
		        })

		} else {

        this.notification.error('Error', this.passwordsDoNotMatch);

  		} 
    } else if (this.mode == 'edit') {

      this.userService.editUser(this.user).subscribe(
        (data) => {        
          this.notification.success(this.userUpdatedTitle, this.userUpdatedContent);
        },
        (err) => {
            this.notification.error('Error', err || 'Error');
        })
  	}
 }

  
  public activeSelected(value){
    value=='yes'? this.user.active=true : this.user.active=false;
  }

  // public updateSelectedLocations(e) {
  //   this.provider.location=e;
  // }

  public notificationDestroyed(e){
    if(e.type!="error"){
      //this.router.navigate(['/admin/user']);
      // if (this.mode == 'new') 
      // this.router.navigate(['/admin/user']);
      // else  if (this.mode == 'edit') {
      // this.router.navigate(['/admin/user']);
  	  //}
	  }
  }

  public editUser() {
    this.router.navigate(['./admin/user/edit/',this.id]);
  }

  public deleteImage(){}
}