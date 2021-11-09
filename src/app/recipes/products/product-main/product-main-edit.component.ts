 import { Input, Output, Component, ViewContainerRef, EventEmitter, OnInit} from '@angular/core';
 import { MeasurementUnitService } from "../../../libraries/measurement-unit/measurement-unit.service";
 import { AppConfig } from "../../../global-utils/services/appConfig.service";
 import { ProductsService } from "../products.service";
 import { FamilyService } from "../../../libraries/family/family.service";
 import { LocationService } from "../../../global-utils/services/location.service";
 import { AccountService } from "../../../global-utils/services/account.service";
 import { ActivatedRoute, Router } from '@angular/router';
 import { NotificationsService } from 'angular2-notifications';
 import { Product } from '../../../global-utils/models/product.model'
 import { TranslateService } from 'ng2-translate/ng2-translate';
 import { Subject, Observable} from 'rxjs/Rx'
 import { ConfirmationService } from 'primeng/primeng'
 import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'product-main-edit',
  templateUrl: './product-main-edit.component.html',
  styleUrls: ['./product-main-edit.component.scss']
})
export class ProductMainEditComponent implements OnInit {
	@Input() public product: any;  
   @Input() public forceRefresh = new EventEmitter();
   @Output() public productMainEditForm: any;
   @Input() savingProduct = new Subject();
   @Output() savingProductFinished = new EventEmitter<boolean>();

   
   public selectedMu;
   public editMode: boolean = true;

   public id: string;
   public versionId: string;

   public productLang = {
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
  public mode

  public productUpdatedLang: any[] = [];

  public productLangOnEdit: any;

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public saving: boolean = false;
  public timeOut;
  public deactivate: Subject<boolean> = new Subject();
  public alertHeader;
  public alertMessage;
  public timeIntervals = []
  public totalItemsWork: number;
  public workRooms;
  public workRoom;
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
    public productService: ProductsService, 
    public familyService: FamilyService, 
    public accountService: AccountService, 
    public route: ActivatedRoute, 
    public router: Router, 
    public notification: NotificationsService, 
    public translate: TranslateService, 
    public confirmationService: ConfirmationService,
    public costFilterService: CostFilterService
    ) {
  }

  ngOnInit() {

    this.savingProduct.subscribe((data) => {
      this.upload.next(true);      
    })

    if (!this.product.caducityFresh){

        this.product.caducityFresh = {
          value :0,
          timeUnit : 'd.'
        }
    }    

    if(!this.product.kitchens) this.product.kitchens = [];

    if (!this.product.caducityFreeze){

      this.product.caducityFreeze = {
        value:0,
        timeUnit: 'd.'
      }

    }
    if (!this.product.daysToUse){

      this.product.daysToUse = {
        value: 0,
        timeUnit: 'd.'
      }

    }

    this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId'];});

    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
      //console.log(this.mode,'mode')
    });
    //console.log(this.product,'product')
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
    this.savingProductFinished.emit(true);
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
	}

  public langObjRefreshed(e) {

    if (this.mode == 'new'){
      this.product.lang=e.langsObj;
    }
    //Don't ask why this has to be commented. Fact of the matter is otherwise it doesn't work.
    //this.productOnEdit.lang = e.langsObj;
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

  public getProduct() {
    this.productService.getProduct(this.id, this.versionId).subscribe(
      (data) => {
        this.product=data;
        //console.log(this.product,'getProduct')
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
        if(this.mode=='new') {this.product.measurementUnit=this.measurementUnits[0];} // comprobar
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
      )
  }

  public fetchTimeIntervals(){
    this.productService.fetchTimeIntervals().subscribe(
      (res)=>{

        res.forEach((time)=>{
          this.timeIntervals.push(time)
        })
        ////console.log(this.timeIntervals,'timeIntervalsSubproduct')
      })

  }

  public getFamilies() {
    //Get all subfamilies available for the ingredient's family
    this.familyService.getFamily('recipe', 10000, 0, '','','','',this.filterLocations).subscribe(
      (familyData: any) => {
        this.families = familyData.families;
        this.families.find((e, i) => {
          if (e._id == this.product.family) {
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
        //console.log(this.userLocations,'locations!')
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getAccountInfo(){
     this.accountService.getAccountInfo(this.product.last_account).subscribe(
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
    //this.productLangOnEdit=this.productOnEdit.lang;
    ////console.log(this.productLangOnEdit)
    //A timeout is necessary for LangTab having time to subscribe to the ForceRefresh event. Otherwise forceRefreshForEdit emits before LangTab
    //has subscribed. In other components it's not necessary because there is already a delay caused by Angular fetching lang data from the API.
    this.timeOut = setTimeout(() => {
        this.forceRefresh.emit(this.product.lang);
      }, 10);
    }

  public familySelected(i) {
    if (i != '') {
      //A family has been selected
      //load subfamilies for the family selected
      this.subfamilies = this.families[i].subfamilies;
      //Store the updated family selection in the productOnEdit object and reset subfamily selection
      this.product.family = this.families[i]._id;;
      this.product.subfamily = null;
    } else {
      //No family selected thus we first reset subfamilies to zero
      this.subfamilies = [];
      //then reset family and subfamily selections
      this.product.family = null;
      this.product.subfamily = null;
    }
  }

  public subFamilySelected(i){
    if(i=='') { 
      this.product.subfamily= null; 
    }
    else {
      //Family selected and value is the _id. Set the subfamily value
      this.product.subfamily = this.subfamilies[i]._id; 
    }
  }

  public timeIntervalFreshSelected(i){
    if (i != '') {
      this.product.caducityFresh.timeUnit = this.timeIntervals[i].value; // mirar si podemos pasar el objeto entero
    }
    else {
      this.product.caducityFresh.timeUnit = null;
    }
  }

  public timeIntervalFreezeSelected(i){
    if (i != '') {
      this.product.caducityFreeze.timeUnit = this.timeIntervals[i].value; // mirar si podemos pasar el objeto entero
    }
    else {
      this.product.caducityFreeze.timeUnit = null;
    }
  }

  public timeIntervalDaysToUseSelected(i){
    if (i != '') {
      this.product.daysToUse.timeUnit = this.timeIntervals[i].value; // mirar si podemos pasar el objeto entero
    }
    else {
      this.product.daysToUse.timeUnit = null;
    }
  }

  public measuringUnitSelected(i){
    this.product.measurementUnit=this.measurementUnits[i];
  }

  public activeSelected(value){
    value=='yes'? this.product.active=true : this.product.active=false;
    //In edit mode we store the updated value in the productOnEdit object
    if (this.product) this.product.active=this.product.active;
  }

  public updateSelectedLocations(e) {
    this.product.location=e;
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
    console.log(label,'label',this.gastroCommentLabel,'GSL',this.dietLabel,'DL',this.tastingLabel,'TL')
  }

  public cleanAndResetFields(){

    this.gastroCommentLabel = false;
    this.dietLabel = false;
    this.tastingLabel = false;

  }

  public deleteImage(){}
}
