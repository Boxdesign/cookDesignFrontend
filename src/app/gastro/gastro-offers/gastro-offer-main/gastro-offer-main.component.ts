 import { Input, Output, Component, OnInit, ViewContainerRef, EventEmitter} from '@angular/core';
 import { FileUploader} from 'ng2-file-upload';
 import { MeasurementUnitService } from "../../../libraries/measurement-unit/measurement-unit.service";
 import { AppConfig } from "../../../global-utils/services/appConfig.service";
 import { GastroOfferService } from "../gastro-offer.service";
 import { FamilyService } from "../../../libraries/family/family.service";
 import { LocationService } from "../../../global-utils/services/location.service";
 import { AccountService } from "../../../global-utils/services/account.service";
 import { NotificationsService } from 'angular2-notifications';
 import { ActivatedRoute, Router } from '@angular/router';
 import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'gastro-offer-main',
  templateUrl: './gastro-offer-main.component.html',
  styleUrls: ['./gastro-offer-main.component.scss']
})
export class GastroOfferMainComponent implements OnInit {
   @Input() public menuOnEdit: any;  
   @Input() public forceRefreshForEdit = new EventEmitter();
   public selectedMu;
   public editMode: boolean = true;
   public viewMode:boolean=false;

   public id: string;
   public versionId: string;

   public menuLang = {
     name: '',
     description: '',
   }

  public menuTypes;
  public menuType;
  public menuSeasons;

  public families;
  public subfamilies;
  public measurementUnits;
  public userLocations;
  public selectedLocations;
  public account;

  public menuUpdatedLang: any[] = [];

  public imageObject;
  public menuLangOnEdit: any;

  public forceRefresh = new EventEmitter();

  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public timeOut;
 	public observerLocation;
  public filterLocations = [];

  constructor(
  	public router: Router, 
  	public mUnitsService: MeasurementUnitService, 
  	public appConfig: AppConfig, 
  	public locationService: LocationService,
    public menuService: GastroOfferService, 
    public familyService: FamilyService, 
    public accountService: AccountService, 
    public route: ActivatedRoute,
    public notification: NotificationsService,
    public costFilterService: CostFilterService
   ) 
  {}

  ngOnInit() {

    this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId'];});

    this.route.data.subscribe((data: {menuType: String, viewMode:boolean}) => {
        this.menuType = data.menuType;
        if(data.viewMode) this.viewMode = data.viewMode;
      });
    //console.log(this.menuOnEdit,'menuOnEdit MAIN COMPONENT')
    this.getLangs(); 
    this.getUserLocations();
    this.getAccountInfo();
    //console.log(this.menuOnEdit,'menuWEBMAIN')

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
      	if(!data || data === undefined) {}
      	else 
      	{
	      	this.filterLocations = [];
	        this.filterLocations = this.filterLocations.concat(data);
	        console.log(this.filterLocations, 'filter locations!!!!')
	    		this.getMenuSeasons();  
	    		this.getMenuTypes();
	    	}
    })
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
	}

  public langObjRefreshed(e) {
    //Don't ask why this has to be commented. Fact of the matter is otherwise it doesn't work.
    //this.menuOnEdit.lang = e.langsObj;
  }

  public getMenuTypes() {
    this.familyService.getFamily('menu', 10000, 0, '','','','',this.filterLocations).subscribe(
      (data: any) => {
        this.menuTypes = data.families;
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getMenuSeasons() {
    this.familyService.getFamily('season', 10000, 0, '','','','',this.filterLocations).subscribe(
      (data: any) => {
        this.menuSeasons = data.families;
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
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

  public getAccountInfo(){
     this.accountService.getAccountInfo(this.menuOnEdit.last_account).subscribe(
      (data: any)=> {
        this.account = data;
        // console.log('account')
        // console.log(this.account);
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getLangs(){
    //A timeout is necessary for LangTab having time to subscribe to the ForceRefresh event. Otherwise forceRefreshForEdit emits before LangTab
    //has subscribed. In other components it's not necessary because there is already a delay caused by Angular fetching lang data from the API.
    this.timeOut = setTimeout(() => {
        this.forceRefreshForEdit.emit(this.menuOnEdit.lang);
      }, 10);
    }

  public menuTypeSelected(i) {
      this.menuOnEdit.type = this.menuTypes[i]._id;
  }

  public menuSeasonSelected(i){
  	  this.menuOnEdit.season = this.menuSeasons[i]._id;
  }

  public activeSelected(value){
    value=='yes'? this.menuOnEdit.active=true : this.menuOnEdit.active=false;
  }

  public updateSelectedLocations(e) {
    this.menuOnEdit.location=e;
  }

}
