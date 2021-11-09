 import { Input, Output, Component, ViewContainerRef, EventEmitter} from '@angular/core';
 import { MeasurementUnitService } from "../../../libraries/measurement-unit/measurement-unit.service";
 import { AppConfig } from "../../../global-utils/services/appConfig.service";
 import { DishService } from "../dish.service";
 import { FamilyService } from "../../../libraries/family/family.service";
 import { LocationService } from "../../../global-utils/services/location.service";
 import { AccountService } from "../../../global-utils/services/account.service";
 import { ActivatedRoute, Router } from '@angular/router';
 import { NotificationsService } from 'angular2-notifications';
 import { Dish } from '../../../global-utils/models/dish.model'
 import { TranslateService } from 'ng2-translate/ng2-translate';
 import { Subject, Observable} from 'rxjs/Rx'
 import { ConfirmationService } from 'primeng/primeng'
 import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

 @Component({
   selector: 'dish-main-edit',
   templateUrl: './dish-main-edit.template.html'
 })
 export class DishMainEditComponent {
   @Input() public dish: any;  
   @Input() public forceRefresh = new EventEmitter();
   @Output() public dishMainEditForm: any;
   @Input() savingDish = new Subject();
   @Output() savingDishFinished = new EventEmitter<boolean>();


   public selectedMu;
   public editMode: boolean = true;

   public id: string;
   public versionId: string;


   public dishLang = {
     name: '',
     description: '',
     gastroComment:'',
     diet:'',
     tasting:'',
     gastroCommentLabel:'',
     dietLabel:'',
     tastingLabel:''
   }

    public families;
    public subfamilies;
    public measurementUnits;
    public userLocations;
    public selectedLocations;
    public account;

    public dishUpdatedLang: any[] = [];

    public dishLangOnEdit: any;

    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public timeOut;
    public mode
    public saving: boolean = false;
    public deactivate: Subject<boolean> = new Subject();
    public alertHeader;
    public alertMessage;
    public timeIntervals = []
    public totalItemsWork: number;
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
    	public dishService: DishService, 
    	public familyService: FamilyService, 
    	public accountService: AccountService, 
    	public route : ActivatedRoute, 
    	public router: Router, 
    	public notification: NotificationsService, 
    	public translate: TranslateService, 
    	public confirmationService: ConfirmationService,
    	public costFilterService: CostFilterService, 
    	) {}

  ngOnInit() {

    this.savingDish.subscribe((data) => {
      this.upload.next(true);      
    })

    if(!this.dish.kitchens) this.dish.kitchens = [];

    if (!this.dish.caducityFresh){

        this.dish.caducityFresh = {
          value :0,
          timeUnit : 'd.'
        }
    }    

    if (!this.dish.caducityFreeze){

      this.dish.caducityFreeze = {
        value:0,
        timeUnit: 'd.'
      }

    }
    if (!this.dish.daysToUse){

      this.dish.daysToUse = {
        value: 0,
        timeUnit: 'd.'
      }

    }

    this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId'];});

    this.route.data.subscribe((data: {mode:string}) => {
        if(data.mode) this.mode = data.mode;
      });
    //console.log(this.dish,'dish')
    this.getUnidadesDeMedida();
    this.getLangs(); 
    this.getUserLocations();
    this.getAccountInfo();
    this.fetchTimeIntervals();

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
      	this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.getFamilies();
    })	

  }

  public imageUploadFinished(){
    //Called by the crop and upload component after finishing upload
    this.savingDishFinished.emit(true);
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
	}

  public langObjRefreshed(e) {

     if (this.mode == 'new'){
      this.dish.lang=e.langsObj;
    }
    //Don't ask why this has to be commented. Fact of the matter is otherwise it doesn't work.
    //this.dishOnEdit.lang = e.langsObj;
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
         if(this.mode=='new') {this.dish.measurementUnit=this.measurementUnits[0];}
         //console.log(this.dish,'dishMEASUNIT')
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
          if (e._id == this.dish.family) {
            this.subfamilies = this.families[i].subfamilies;
            ////console.log(this.families);
          }
        })
      });
  }

  private fetchTimeIntervals(){
    this.dishService.fetchTimeIntervals().subscribe(
      (res)=>{

        res.forEach((time)=>{
          this.timeIntervals.push(time)
        })
        ////console.log(this.timeIntervals,'timeIntervalsSubproduct')
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
     this.accountService.getAccountInfo(this.dish.last_account).subscribe(
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
    //this.dishLangOnEdit=this.dishOnEdit.lang;
    ////console.log(this.dishLangOnEdit)
    //A timeout is necessary for LangTab having time to subscribe to the ForceRefresh event. Otherwise forceRefreshForEdit emits before LangTab
    //has subscribed. In other components it's not necessary because there is already a delay caused by Angular fetching lang data from the API.
    this.timeOut = setTimeout(() => {
        this.forceRefresh.emit(this.dish.lang);
      }, 10);
    }

  public familySelected(i) {
    if (i != '') {
      //A family has been selected
      //load subfamilies for the family selected
      this.subfamilies = this.families[i].subfamilies;
      //Store the updated family selection in the dishOnEdit object and reset subfamily selection
      this.dish.family = this.families[i]._id;;
      this.dish.subfamily = null;
    } else {
      //No family selected thus we first reset subfamilies to zero
      this.subfamilies = [];
      //then reset family and subfamily selections
      this.dish.family = null;
      this.dish.subfamily = null;
    }
  }

  public subFamilySelected(i){
    if(i=='') { 
      this.dish.subfamily= null; 
    }
    else {
      //Family selected, set subfamily value
      this.dish.subfamily = this.subfamilies[i]._id; 
    }
  }

  public timeIntervalFreshSelected(i){
    if (i != '') {
      this.dish.caducityFresh.timeUnit = this.timeIntervals[i].value; // mirar si podemos pasar el objeto entero
    }
    else {
      this.dish.caducityFresh.timeUnit = null;
    }
  }

  public timeIntervalFreezeSelected(i){
    if (i != '') {
      this.dish.caducityFreeze.timeUnit = this.timeIntervals[i].value; // mirar si podemos pasar el objeto entero
    }
    else {
      this.dish.caducityFreeze.timeUnit = null;
    }
  }

  public timeIntervalDaysToUseSelected(i){
    if (i != '') {
      this.dish.daysToUse.timeUnit = this.timeIntervals[i].value; // mirar si podemos pasar el objeto entero
    }
    else {
      this.dish.daysToUse.timeUnit = null;
    }
  }

  public measuringUnitSelected(i){
    this.dish.measurementUnit=this.measurementUnits[i];
    //console.log(this.dish,'dishMeasUnitSelected')
  }

  public activeSelected(value){
    value=='yes'? this.dish.active=true : this.dish.active=false;
    //In edit mode we store the updated value in the dishOnEdit object
    if (this.dish) this.dish.active=this.dish.active;
  }

  public updateSelectedLocations(e) {
    this.dish.location=e;
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
    //console.log(label,'label',this.gastroCommentLabel,'GSL',this.dietLabel,'DL',this.tastingLabel,'TL')
  }

  public cleanAndResetFields(){

    this.gastroCommentLabel = false;
    this.dietLabel = false;
    this.tastingLabel = false;

  }

  public deleteImage() {}
}

