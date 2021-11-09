import { Input, Output, Component, OnInit, ViewContainerRef, EventEmitter} from '@angular/core';
import { FileUploader} from 'ng2-file-upload';
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { ProviderService } from "../provider.service";
import { LocationService } from "../../../global-utils/services/location.service";
import { AccountService } from "../../../global-utils/services/account.service";
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Provider } from '../../../global-utils/models/provider.model'
import { CompassService } from '../../../global-utils/services/compass.service';


@Component({
  selector: 'provider-quality',
  templateUrl: './provider-quality.component.html',
  styleUrls: ['./provider-quality.component.scss']
})
export class ProviderQualityComponent implements OnInit {
  @Output() passRedirectOn = new EventEmitter();
  public mode;
  public id: string;
  public userLocations;
  public selectedLocations = [];
  public account;
  public providerQualityCreatedTitle;
  public providerQualityCreatedContent;
  public providerQualityUpdatedTitle;
  public providerQualityUpdatedContent;
  public providerQuality;
  public provider;
  public apiUrl;
  public uploadUrl;
  public approved;
  public document;
  public redirectData;

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
    public compassService: CompassService
  ) {}

  ngOnInit() {
  	this.apiUrl = this.appConfig.apiUrl;
    this.uploadUrl = this.apiUrl + '/document?destination=docs/providers';
    this.redirectData = this.compassService.getRedirectData();

    this.route.params.subscribe(params => {this.id=params['id'];});

    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });
    this.translation();
    this.getProviderQuality();
    //this.getAccountInfo(); 
  }

  public translation(){

    this.translate.get('provider.provider.notifications.providerUpdatedTitle').subscribe((res: string) => {
      this.providerQualityUpdatedTitle = res;
    });

    this.translate.get('provider.provider.notifications.providerUpdatedContent').subscribe((res: string) => {
      this.providerQualityUpdatedContent = res;
    }); 
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

  public getProviderQuality() {
    this.providerService.getProvider(this.id).subscribe(
      (data) => {
      	this.provider=data;
        this.getAccountInfo();

      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      });
  }

   public saveProvider() {

      this.providerService.editProvider(this.provider).subscribe(
        (data) => {        
          this.notification.success(this.providerQualityUpdatedTitle, this.providerQualityUpdatedContent);
        },
        (err) => {
            this.notification.error('Error', err || 'Error');
        })
   }


  public notificationDestroyed(e){
    if(e.type!="error"){ 
      //this.router.navigate(['/providers/provider']);
    } 
  }

  public editProvider() {
    this.router.navigate(['./providers/provider/edit/',this.id]);
  }

  public redirect() {
    if(this.redirectData && this.redirectData.activated) {

      let _id = this.redirectData.id;
      let _versionId = this.redirectData.versionId;
      let mode = this.redirectData.mode;
      let originPath = this.redirectData.originPath;

       //Pass No delete redirect data to the parent component
      //this.passRedirectOn.emit(true);
      
      //Reset redirect data.
      this.compassService.resetRedirectData();

      if (mode == 'edit') {
        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, tab: 'ingredient'}]);
      } else if (mode == 'view') {
        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, tab: 'ingredient'}]);
      }
     } else {
       this.router.navigate(['./providers/provider']);
     }
  }
}
