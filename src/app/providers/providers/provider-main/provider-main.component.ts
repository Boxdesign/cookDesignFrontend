import { Input, Output, Component, OnInit, ViewContainerRef, EventEmitter, ViewChild} from '@angular/core';
import { FileUploader} from 'ng2-file-upload';
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { ProviderService } from "../provider.service";
import { LocationService } from "../../../global-utils/services/location.service";
import { AccountService } from "../../../global-utils/services/account.service";
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Provider } from '../../../global-utils/models/provider.model';
import { CompassService } from '../../../global-utils/services/compass.service';
import { Subject } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'provider-main',
  templateUrl: './provider-main.component.html',
  styleUrls: ['./provider-main.component.scss']
})
export class ProviderMainComponent implements OnInit {
  
  @Output() passRedirectOn = new EventEmitter();
  @ViewChild('confirmDeleteLocationsModal') confirmDeleteLocationsModal;
  public mode;
  public id: string;
  public userLocations;
  public selectedLocations = [];
  public account;
  public providerCreatedTitle;
  public providerCreatedContent;
  public providerUpdatedTitle;
  public providerUpdatedContent;
  public alertHeader;
  public alertMessage;
  public provider;
  public apiUrl;
  public uploadUrl;
  public redirectData;
  public newLocations;
  public deletedLocations;
  public savedProviderLocation;
  public saving: boolean = false;
  public deactivate: Subject<boolean> = new Subject();

  public options = {
     timeOut: 1500,
    position: ["top", "right"]
   }

  public uploader: FileUploader;

  constructor(
  	public router: Router, 
  	public appConfig: AppConfig, 
  	public locationService: LocationService,
    public providerService: ProviderService, 
    public accountService: AccountService, 
    public route: ActivatedRoute,
    public notification: NotificationsService, 
    public translate: TranslateService, 
    public compassService: CompassService,
    public confirmationService: ConfirmationService
  ) {}

  ngOnInit() {

    this.apiUrl = this.appConfig.apiUrl;
    this.uploadUrl = this.apiUrl + '/document?destination=docs/providers';

    this.route.params.subscribe(params => {this.id=params['id'];});

    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });
    this.translation();
    this.getUserLocations();
    this.redirectData = this.compassService.getRedirectData();
    
    if (this.mode == 'new') {
      this.provider = new Provider();
    }
    else {
      this.getProvider();
    }
  }

  public translation(){
    this.translate.get('provider.provider.notifications.providerCreatedTitle').subscribe((res: string) => {
      this.providerCreatedTitle = res;
    });

    this.translate.get('provider.provider.notifications.providerCreatedContent').subscribe((res: string) => {
      this.providerCreatedContent = res;
    });

    this.translate.get('provider.provider.notifications.providerUpdatedTitle').subscribe((res: string) => {
      this.providerUpdatedTitle = res;
    });

    this.translate.get('provider.provider.notifications.providerUpdatedContent').subscribe((res: string) => {
      this.providerUpdatedContent = res;
    }); 

    this.translate.get('messageGeneric.alert').subscribe((res: string) => {
      this.alertHeader = res;
    });  

    this.translate.get('messageGeneric.alertMessage').subscribe((res: string) => {
      this.alertMessage = res;
    });

  }

  public getUserLocations() {
    this.locationService.getUserLocations().subscribe(
      (data: any)=> {
        this.userLocations = data;
        //console.log(this.userLocations, 'this.userLocations')
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getAccountInfo(){
     this.accountService.getAccountInfo(this.provider.last_account).subscribe(
      (data: any)=> {
        this.account = data;
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getProvider() {
    this.providerService.getProvider(this.id).subscribe(
      (data) => {
        this.savedProviderLocation = JSON.parse(JSON.stringify(data.location));
        this.provider=data;
        this.getAccountInfo();

      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      });
  }

  public saveProvider() {

    if (this.mode == 'new') {

      this.providerService.addProvider(this.provider).subscribe(
        (data) => {    
          this.saving=true; //set saving flag to true in order to bypass candeactivate
          this.notification.success(this.providerCreatedTitle, this.providerCreatedContent);
        	this.router.navigate(['/providers/provider/edit/', data._id]);
        },
        (err) => {
            this.notification.error('Error', err || 'Error');
        })
    } else if (this.mode == 'edit') {
    	
      this.providerService.editProvider(this.provider).subscribe(
        (data) => {        
          this.notification.success(this.providerUpdatedTitle, this.providerUpdatedContent);
        },
        (err) => {
            this.notification.error('Error', err || 'Error');
        })
    }
  }

  public activeSelected(value){
    value=='yes'? this.provider.active=true : this.provider.active=false;
  }

  public updateSelectedLocations(e) {
    this.provider.location=e;
  }

  public notificationDestroyed(e){
  }

  canDeactivate(): Subject<boolean> | boolean {

    if(this.saving) { //It's save redirection, no need to to confirm redirection with a user dialog.
      this.saving=false;
      return true;
    }    

    //Otherwise ask the user with the dialog service and return its
    //promise which resolves to true or false when the user decides
    this.confirmAction();
    return this.deactivate;
  }

  public confirmAction() {

    this.confirmationService.confirm({
        header: this.alertHeader,
        message: this.alertMessage,
        icon: "fa fa-exclamation-triangle",
        accept: () => {
          this.deactivate.next(true);
        },
        reject: () => {
          this.deactivate.next(false);
        }      
      });
  }  

  public redirect() {

    if(this.redirectData && this.redirectData.activated) {



      let _id = this.redirectData.id;
      let _versionId = this.redirectData.versionId;
      let mode = this.redirectData.mode;
      let originPath = this.redirectData.originPath;

       //Pass No delete redirect data to the parent component
      this.passRedirectOn.emit(true);
      
      //Reset redirect data.
      this.compassService.resetRedirectData();

      if (mode == 'edit') {
        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, tab: 'ingredient'}]);
      } else if (mode == 'view') {
        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, tab: 'ingredient'}]);
      } else {
        this.router.navigate(['./' + originPath ]);
      }
     } else {
       this.router.navigate(['./providers/provider']);
     }
  }
}
