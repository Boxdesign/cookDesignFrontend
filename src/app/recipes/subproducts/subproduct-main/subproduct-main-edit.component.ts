 import { Input, Output, Component, ViewContainerRef, EventEmitter} from '@angular/core';
 import { FileUploader} from 'ng2-file-upload';
 import { MeasurementUnitService } from "../../../libraries/measurement-unit/measurement-unit.service";
 import { AppConfig } from "../../../global-utils/services/appConfig.service";
 import { SubproductsService } from "../subproducts.service";
 import { FamilyService } from "../../../libraries/family/family.service";
 import { LocationService } from "../../../global-utils/services/location.service";
 import { AccountService } from "../../../global-utils/services/account.service";
 import { ActivatedRoute, Router } from '@angular/router';
 import { NotificationsService } from 'angular2-notifications'
 import { Subject, Observable} from 'rxjs/Rx'
 import { Subproduct } from '../../../global-utils/models/subproduct.model'
 import { ConfirmationService } from 'primeng/primeng'
 import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

 @Component({
   selector: 'subproduct-main-edit',
   templateUrl: './subproduct-main-edit.template.html'
 })
 export class SubproductMainEditComponent {
   @Input() public subproduct: any;  
   @Input() public forceRefresh = new EventEmitter();
   @Output() public subproductMainEditForm: any;
   @Input() savingSubproduct = new Subject();
   @Output() savingSubproductFinished = new EventEmitter<boolean>();

   
   public timeIntervals = []
   public totalItemsWork: number;
   public selectedMu;


   public kitchens;
   public kitchen;
   public workRooms;
   public workRoom;
   public deactivate: Subject<boolean> = new Subject();
   public alertHeader;
   public alertMessage;
   public saving: boolean = false;
   public id: string;
   public versionId: string;

   public subproductLang = {
     name: '',
     description: '',
     gastroComment:'',
     diet:'',
     tasting:'',
     gastroCommentLabel:'',
     tastingLabel :'',
     dietLabel:''
   }

  public families;
  public subfamilies;
  public measurementUnits;
  public userLocations;
  public selectedLocations;
  public account;
  public mode;

  public subproductUpdatedLang: any[] = [];

  public imageObject;
  public subproductLangOnEdit: any;

  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public gastroCommentLabel: boolean = false
  public dietLabel: boolean = false
  public tastingLabel :boolean = false
  public timeOut;
 	public observerLocation;
  public filterLocations = [];
  public upload = new Subject();

  constructor(
  	public mUnitsService: MeasurementUnitService, 
  	public appConfig: AppConfig, 
  	public locationService: LocationService,
    public subproductService: SubproductsService, 
    public familyService: FamilyService, 
    public accountService: AccountService, 
    public route: ActivatedRoute, 
    public router: Router, 
    public notification: NotificationsService, 
    public confirmationService: ConfirmationService,
    public costFilterService: CostFilterService, 
   ) { 
  }

  ngOnInit() {

    this.savingSubproduct.subscribe((data) => {
      this.upload.next(true);      
    })
 
    this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId'];});

    this.route.data.subscribe((data: {mode: string}) => {
        if(data.mode) this.mode = data.mode;
      });

    if(!this.subproduct.kitchens) this.subproduct.kitchens = [];

    if (!this.subproduct.caducityFresh){

        this.subproduct.caducityFresh = {
          value :0,
          timeUnit : 'd.'
        }
    }    

    if (!this.subproduct.caducityFreeze){

      this.subproduct.caducityFreeze = {
        value:0,
        timeUnit: 'd.'
      }

    }
    if (!this.subproduct.daysToUse){

      this.subproduct.daysToUse = {
        value: 0,
        timeUnit: 'd.'
      }

    }
    
    this.getUnidadesDeMedida();
    this.buildUploader();
    this.getLangs(); 
    this.getUserLocations();
    this.getAccountInfo();
    this.fetchTimeIntervals();
    //console.log(this.subproduct,'subproduct')

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
      	this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.getFamilies();
    })	

  }

  public imageUploadFinished(){
    //Called by the crop and upload component after finishing upload
    this.savingSubproductFinished.emit(true);
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
	}

  public langObjRefreshed(e) {
    if (this.mode == 'new'){
      this.subproduct.lang=e.langsObj;
    }
    //Don't ask why this has to be commented. Fact of the matter is otherwise it doesn't work.
    //this.subproductOnEdit.lang = e.langsObj;
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
      this.subproduct.gallery = this.imageObject;
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
 
    
  public getUnidadesDeMedida() {
    this.mUnitsService.getBaseUnits().subscribe(
      (data: any)=> {
        this.measurementUnits = data.measurementUnits;
        if(this.mode=='new') {this.subproduct.measurementUnit=this.measurementUnits[0];}
        //console.log(this.subproduct,'subproduct')
      },
      (err) => {
       this.notification.error('Error', err || 'Server error');
      })
  }

  public fetchTimeIntervals(){
    this.subproductService.fetchTimeIntervals().subscribe(
      (res)=>{

        res.forEach((time)=>{
          this.timeIntervals.push(time)
        })
        //console.log(this.timeIntervals,'timeIntervalsSubproduct')
      })

  }

  public getFamilies() {
    //Get all subfamilies available for the ingredient's family
    console.log(this.filterLocations, 'get subproduct families')
    this.familyService.getFamily('recipe', 10000, 0, '','','','',this.filterLocations).subscribe(
      (familyData: any) => {
        this.families = familyData.families;
        this.families.find((e, i) => {
          if (e._id == this.subproduct.family) {
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
     this.accountService.getAccountInfo(this.subproduct.last_account).subscribe(
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
    //this.subproductLangOnEdit=this.subproductOnEdit.lang;
    ////console.log(this.subproductLangOnEdit)
    //A timeout is necessary for LangTab having time to subscribe to the ForceRefresh event. Otherwise forceRefreshForEdit emits before LangTab
    //has subscribed. In other components it's not necessary because there is already a delay caused by Angular fetching lang data from the API.
    this.timeOut = setTimeout(() => {
        this.forceRefresh.emit(this.subproduct.lang);
      }, 10);

    }

  public familySelected(i) {
    if (i != '') {
      //A family has been selected
      //load subfamilies for the family selected
      this.subfamilies = this.families[i].subfamilies;
      //Store the updated family selection in the subproductOnEdit object and reset subfamily selection
      this.subproduct.family = this.families[i]._id;;
      this.subproduct.subfamily = null;
    } else {
      //No family selected thus we first reset subfamilies to zero
      this.subfamilies = [];
      //then reset family and subfamily selections
      this.subproduct.family = null;
      this.subproduct.subfamily = null;
    }
  }

  public subFamilySelected(i){

    if(i=='') { 
      this.subproduct.subfamily= null; 
    }
    else {
      //Family selected, set subfamily value
      this.subproduct.subfamily = this.subfamilies[i]._id; 
    }
  }

  public timeIntervalFreshSelected(i){
    if (i != '') {
      this.subproduct.caducityFresh.timeUnit = this.timeIntervals[i].value; // mirar si podemos pasar el objeto entero
    }
    else {
      this.subproduct.caducityFresh.timeUnit = null;
    }
  }

  public timeIntervalFreezeSelected(i){
    if (i != '') {
      this.subproduct.caducityFreeze.timeUnit = this.timeIntervals[i].value; // mirar si podemos pasar el objeto entero
    }
    else {
      this.subproduct.caducityFreeze.timeUnit = null;
    }
  }

  public timeIntervalDaysToUseSelected(i){
    if (i != '') {
      this.subproduct.daysToUse.timeUnit = this.timeIntervals[i].value; // mirar si podemos pasar el objeto entero
    }
    else {
      this.subproduct.daysToUse.timeUnit = null;
    }
  }

  public measuringUnitSelected(i){
    this.subproduct.measurementUnit=this.measurementUnits[i];
  }

  public activeSelected(value){
    value=='yes'? this.subproduct.active=true : this.subproduct.active=false;
    //In edit mode we store the updated value in the subproductOnEdit object
    if (this.subproduct) this.subproduct.active=this.subproduct.active;
  }

  public updateSelectedLocations(e) {
    this.subproduct.location=e;
  }

  // public uniq(a) { //remove duplicate items from array
  //   var seen = {};
  //   return a.filter(function(item) {
  //     return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  //   });
  // }

  public editableLabel(label){

    if(label == 'gastroComment'){

      this.gastroCommentLabel = true;

    } else if(label == 'diet'){

      this.dietLabel = true;

    } else {

      this.tastingLabel = true;

    }
  }

  public cleanAndResetFields(){

    this.gastroCommentLabel = false;
    this.dietLabel = false;
    this.tastingLabel = false;

  }
  public deleteImage() {
      this.subproduct.gallery=null;
      this.imageObject=null;
    }
  
}

