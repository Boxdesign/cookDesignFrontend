import {Component, ViewContainerRef, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { FamilyService } from '../../../libraries/family/family.service'
import { AppConfig } from '../../../global-utils/services/appConfig.service'
import { MeasurementUnitService } from '../../../libraries/measurement-unit/measurement-unit.service'
import { PackagingsService } from '../packagings.service'
import { TranslateService } from 'ng2-translate/ng2-translate'
import { NotificationsService } from 'angular2-notifications'
import { Subject, Observable} from 'rxjs/Rx';
import { ConfirmationService } from 'primeng/primeng';


@Component({
  selector: 'packaging-new',
  templateUrl: './packaging-new.template.html'
})
export class PackagingNewComponent {
  public selectedMu;

  public id: string;
  public action: string;

  public packagingLang = {
    name: '',
    description: '',
  }

  public packaging = {
    family: null,
    subfamily: null,
    active: true, //default value is true
    measuringUnit: null,
    referencePrice:'',
    averagePrice:'',
  }

  public families;
  public subfamilies;
  public allergens;
  public measurementUnits;
  public packagingCreatedTitle;
  public packagingCreatedContent;
  
  public notificationOptions={
    timeOut: 1500,
    position: ["top", "right"]
  }

  public packagingUpdatedLang: any[] = [];
  public packagings;

  public imageObject;
  public editedPackaging: any[] = [];
  public packagingOnEdit: any;
  public packagingLangOnEdit: any;

  public forceRefresh = new EventEmitter();
  public forceRefreshForEdit = new EventEmitter();

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public saving: boolean = false;
  public discardChanges: Subject<boolean> = new Subject();
  public deactivate: Subject<boolean> = new Subject();
  public alertHeader;
  public alertMessage;  
  public upload = new Subject();


  constructor(
  	public measurementUnitService: MeasurementUnitService, 
  	public familyService: FamilyService,
    public appConfig: AppConfig, 
    public confirmationService: ConfirmationService, 
    public  packagingService: PackagingsService, 
    public router: Router, 
    public translate: TranslateService, 
    public notification: NotificationsService) {  
  }

  ngOnInit() {
    this.translation();
    this.getUnidadesDeMedida();
    this.getFamilies();
    // console.log('action:',this.action);
    // console.log('id',this.id);
  }
public translation(){

     this.translate.get('articles.packagings.notifications.packagingCreatedTitle').subscribe((res: string) => {
      this.packagingCreatedTitle = res;
    });

     this.translate.get('articles.packagings.notifications.packagingCreatedContent').subscribe((res: string) => {
      this.packagingCreatedContent = res;
    });

    this.translate.get('messageGeneric.alert').subscribe((res: string) => {
      this.alertHeader = res;
    });  

    this.translate.get('messageGeneric.alertMessage').subscribe((res: string) => {
      this.alertMessage = res;
    });
  }

  public uploadImage(){
    //When saving, first send a notification to the crop and upload component to upload the image.
    this.upload.next(true);
  }

  public imageUploadFinished(){
    //Called by the crop and upload component after finishing upload
    this.addPackaging();
  }


  public langObjRefreshed(e) {
    this.packagingUpdatedLang = e.langsObj;
  }  

  public addPackaging() {
    this.forceRefresh.emit(true);

    let packagingObj = {
      gallery: this.imageObject? this.imageObject._id: null,
      lang: this.packagingUpdatedLang,
      active: this.packaging.active,
      family: this.packaging.family,
      subfamily: this.packaging.subfamily,
      referencePrice: this.packaging.referencePrice || 0,
      averagePrice: this.packaging.averagePrice,
      measurementUnit: this.packaging.measuringUnit,
    };

    // console.log('packagingObj');
    // console.log(packagingObj);

    this.packagingService.addPackaging(packagingObj).subscribe(
      (data:any) => {
        this.notification.success(this.packagingCreatedTitle,this.packagingCreatedContent);
        this.saving=true; //set saving flag to true in order to bypass candeactivate

        //console.log(this.notification,'notification')
        this.packagingLang = {
          name: '',
          description: '',
        }
        this.router.navigate(['/articles/packagings/edit/', data._id]);
      },
      (err) => {
          this.notification.error('Error', err || 'Error');
        }); 
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

  public notificationDestroyed(e){
    if(e.type!="error"){
           this.router.navigate(['/articles/packagings']);
        }
  }

  public getUnidadesDeMedida() {
    this.measurementUnitService.getBaseUnits().subscribe(
      (data: any)=> {
        this.measurementUnits = data.measurementUnits;
         this.packaging.measuringUnit=this.measurementUnits[0];
      },
      (err) => {
          this.notification.error('Error', err || 'Error');
        })
  }

  public getFamilies() {
    this.familyService.getFamily('packaging', 10000, 0, '','').subscribe(
      (data: any) => {
        this.families = data.families;
        //Set family and subfamilies 

        if(this.families.length) {
        	this.packaging.family = this.families[0]._id;
	        this.subfamilies=this.families[0].subfamilies;
        }
        else 
        {
        	this.packaging.family = null;
        	this.subfamilies = [];
        }
      },
      (err) => {
          this.notification.error('Error', err || 'Error');
        })
  }

  public familySelected(i) {
    if (i != '') {
      this.subfamilies = this.families[i].subfamilies;
      this.packaging.family = this.families[i]._id;
      this.packaging.subfamily = null;
    } else {
      //No family selected thus we first reset subfamilies to zero
      this.subfamilies = [];
      //then reset family and subfamily selections
      this.packaging.subfamily=null;
      this.packaging.family=null;
    }
  }

  public subFamilySelected(value){
    if(value=='') { 
      //No subfamily selected thus we set subfamily to undefined
      this.packaging.subfamily = null; 
    }
    else {
      //Family selected and value is the _id. Set the subfamily value both for new and edit mode
      this.packaging.subfamily = value; 
      }
  }

  public measuringUnitSelected(i){
    if (i != null) {
      this.packaging.measuringUnit=this.measurementUnits[i];
     }
     else {
      this.packaging.measuringUnit = null;
    }
  }

  public activeSelected(value){
    value=='yes'? this.packaging.active=true : this.packaging.active=false;
  }

  public deleteImage(){}
}

