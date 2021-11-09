import { Input, Output, Component, ViewContainerRef, EventEmitter} from '@angular/core';
 import { FileUploader} from 'ng2-file-upload';
 import { MeasurementUnitService } from "../../../libraries/measurement-unit/measurement-unit.service";
 import { AppConfig } from "../../../global-utils/services/appConfig.service";
 import { DrinkService } from "../drink.service";
 import { FamilyService } from "../../../libraries/family/family.service";
 import { LocationService } from "../../../global-utils/services/location.service";
 import { AccountService } from "../../../global-utils/services/account.service";
 import { ActivatedRoute, Router } from '@angular/router';
 import { NotificationsService } from 'angular2-notifications';
 import { Drink } from '../../../global-utils/models/drink.model'
 import { TranslateService } from 'ng2-translate/ng2-translate';
 import { Subject, Observable} from 'rxjs/Rx'
 import { ConfirmationService } from 'primeng/primeng'
 import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

 @Component({
   selector: 'drink-main',
   templateUrl: './drink-main.component.html'
 })
 export class DrinkMainComponent {
   @Input() public drink: any;  
   @Input() public forceRefresh = new EventEmitter();
   @Input() savingDrink = new Subject();
   @Output() savingDrinkFinished = new EventEmitter<boolean>();

   public selectedMu;
   //public editMode: boolean = true;
   public id: string;
   public versionId: string;
   public drinkLang = {
     name: '',
     description: '',  
     gastroComment:'',
     diet:'',
     tasting:'',
     gastroCommentLabel:'',
     tastingLabel:'',
     dietLabel:''
   }
  
  public families;
  public subfamilies;
  public measurementUnits;
  public userLocations;
  public selectedLocations;
  public account;
  public mode;
  public drinkUpdatedLang: any[] = [];
  public imageObject;
  public drinkLangOnEdit: any;
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public timeOut;
  public drinkCreatedTitle
  public drinkCreatedContent
  public drinkUpdatedTitle
  public drinkUpdatedContent
  //public viewMode: boolean=false;
  public saving: boolean = false;
  public alertHeader;
  public alertMessage;
  public deactivate: Subject<boolean> = new Subject();
  public gastroCommentLabel: boolean = false
  public dietLabel: boolean = false
  public tastingLabel :boolean = false
 	public observerLocation;
  public filterLocations = [];  
  public upload = new Subject();

  
  constructor(
  	public mUnitsService: MeasurementUnitService, 
  	public appConfig: AppConfig, 
  	public locationService: LocationService,
    public drinkService: DrinkService, 
    public familyService: FamilyService, 
    public accountService: AccountService, 
    public route : ActivatedRoute, 
    public router: Router, 
    public notification: NotificationsService, 
    public translate: TranslateService, 
    public confirmationService: ConfirmationService,
    public costFilterService: CostFilterService
    ) 
   { }

  ngOnInit() {

    this.savingDrink.subscribe((data) => {
      this.upload.next(true);      
    })

    if(!this.drink.kitchens) this.drink.kitchens = [];

  	this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId'];});

    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });

  	this.getUserLocations();
  	this.getUnidadesDeMedida();
  	this.buildUploader();
    this.translation();
    this.getLangs(); 
		this.getAccountInfo();

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
      	this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.getFamilies();
    })	

  }

  public imageUploadFinished(){
    //Called by the crop and upload component after finishing upload
    this.savingDrinkFinished.emit(true);
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
	}

  public translation(){
    this.translate.get('recipes.drink.notifications.drinkCreatedTitle').subscribe((res: string) => {
      this.drinkCreatedTitle = res;
    });

    this.translate.get('recipes.drink.notifications.drinkCreatedContent').subscribe((res: string) => {
      this.drinkCreatedContent = res;
    });

    this.translate.get('recipes.drink.notifications.drinkUpdatedTitle').subscribe((res: string) => {
      this.drinkUpdatedTitle = res;
    });

    this.translate.get('recipes.drink.notifications.drinkUpdatedContent').subscribe((res: string) => {
      this.drinkCreatedContent = res;
    }); 
  }

  public langObjRefreshed(e) {
  	if (this.mode == 'new'){
  		this.drink.lang=e.langsObj;
  	}
    //Don't ask why this has to be commented. Fact of the matter is otherwise it doesn't work.
    //this.drinkLang = e.langsObj;
  }

  public buildUploader() {
    this.uploader = null;
    this.uploader = new FileUploader({
      url: this.appConfig.apiUrl + '/gallery',
      authToken: localStorage.getItem('token'),
      removeAfterUpload: true,
      autoUpload: true
    });

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.imageObject = JSON.parse(response);
      this.drink.gallery = this.imageObject;
    };
  }

  public cleanFields(){
    // this.allergenTmp = {
    //       name: '',
    //       description:''
    //     };
    if(this.imageObject) { this.imageObject=null;}
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


  public getDrink() {
    this.drinkService.getDrink(this.id, this.versionId).subscribe(
      (data) => {
        this.drink=data;
        //this.getAccountInfo();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      });
  }

  public getUnidadesDeMedida() {
    this.mUnitsService.getBaseUnits().subscribe(
      (data: any)=> {
        this.measurementUnits = data.measurementUnits;
        if(this.mode=='new') {this.drink.measurementUnit=this.measurementUnits[0];}
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
      )
  }

  public getFamilies() {
    //Get all subfamilies available for the ingredient's family
    this.familyService.getFamily('recipe', 10000, 0, '','','','',this.filterLocations).subscribe(
      (familyData: any) => {
        this.families = familyData.families;
        this.families.find((e, i) => {
          if (e._id == this.drink.family) {
            this.subfamilies = this.families[i].subfamilies;
            ////console.log(this.families);
          }
        })
      });
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
     this.accountService.getAccountInfo(this.drink.last_account).subscribe(
      (data: any)=> {
        this.account = data;
        // //console.log('account')
        // //console.log(this.account);
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getLangs(){
    //A timeout is necessary for LangTab having time to subscribe to the ForceRefresh event. Otherwise forceRefreshForEdit emits before LangTab
    //has subscribed. In other components it's not necessary because there is already a delay caused by Angular fetching lang data from the API.
    this.timeOut = setTimeout(() => {
        this.forceRefresh.emit(this.drink.lang);
      }, 10);
    }

  public familySelected(i) {
  	
    if (i != '') {
      //A family has been selected
      //load subfamilies for the family selected
      this.subfamilies = this.families[i].subfamilies;
      //Store the updated family selection in the drinkOnEdit object and reset subfamily selection
      this.drink.family = this.families[i]._id;;
      this.drink.subfamily = null;
    } else {
      //No family selected thus we first reset subfamilies to zero
      this.subfamilies = [];
      //then reset family and subfamily selections
      this.drink.family = null;
      this.drink.subfamily = null;
    }
  }

  public subFamilySelected(i){
    if(i=='') { 
      this.drink.subfamily= null; 
    }
    else {
      //Family selected, set subfamily value
      this.drink.subfamily = this.subfamilies[i]._id; 
    }
  }

  public measuringUnitSelected(i){
  	
    this.drink.measurementUnit=this.measurementUnits[i];
  }

  public activeSelected(value){
    value=='yes'? this.drink.active=true : this.drink.active=false;
    //In edit mode we store the updated value in the drinkOnEdit object
    if (this.drink) this.drink.active=this.drink.active;
  }

  public updateSelectedLocations(e) {
    this.drink.location=e;
  }

  // public uniq(a) { //remove duplicate items from array
  //   var seen = {};
  //   return a.filter(function(item) {
  //     return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  //   });
  // }
  public editDrink() {
    this.router.navigate(['./recipes/drink/edit/',this.id]);
  }

  public editableLabel(label){

    if(label == 'gastroComment'){

      this.gastroCommentLabel = true;

    } else if(label == 'diet'){

      this.dietLabel = true;

    } else {

      this.tastingLabel = true;

    }
    console.log(label,'label',this.gastroCommentLabel,'GSL',this.dietLabel,'DL',this.tastingLabel,'TL')
  }

  public cleanAndResetFields(){

    this.gastroCommentLabel = false;
    this.dietLabel = false;
    this.tastingLabel = false;

  }
  public deleteImage() {
      this.drink.gallery=null;
      this.imageObject=null;
    }
}
