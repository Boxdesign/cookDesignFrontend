import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Rx'
import { PackagingsService } from '../packagings.service'
import { FamilyService } from '../../../libraries/family/family.service'
import { AppConfig } from '../../../global-utils/services/appConfig.service'
import { MeasurementUnitService } from '../../../libraries/measurement-unit/measurement-unit.service'
import { TranslateService } from 'ng2-translate/ng2-translate'
import { NotificationsService } from 'angular2-notifications'
import { CompassService } from '../../../global-utils/services/compass.service';
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'

@Component({
  selector: 'packaging-main',
  templateUrl: './packaging-main.component.html',
  styleUrls: ['./packaging-main.component.scss'],
  inputs: ['id']
})
export class PackagingMainComponent implements OnInit {
  @Output() passRedirectOn = new EventEmitter();
  @Input() public packagingOnEdit: any;
   public selectedMu;

   public id: string;

   public packagingLang = {
    name: '',
    description: '',
   }

   public packaging = {
    family: '',
    subfamily: '',
    active: true, //default value is true
    measuringUnit: ''
  }

  public families;
  public subfamilies;
  public allergens;
  public measurementUnits;

  public packagingUpdatedLang: any[] = [];
  public packagings;
  public mode;

  public editedPackaging: any[] = [];
  public packagingLangOnEdit: any;

  public forceRefresh = new EventEmitter();
  public forceRefreshForEdit = new EventEmitter();

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public packagingEditedTitle;
  public packagingEditedContent;
  public redirectData;
  public filterLocation;

  public notificationOptions={
    timeOut:2000,
    position: ["top", "right"]
  } 
  public observerLocation;
  public upload = new Subject();


  constructor(
  	public measurementUnitService: MeasurementUnitService, 
  	public familyService: FamilyService,
    public appConfig: AppConfig, 
    public  packagingService: PackagingsService, 
    public router: Router, 
    public translate: TranslateService, 
    public notification: NotificationsService, 
    public route: ActivatedRoute, 
    public compassService: CompassService,
    public costFilterService: CostFilterService
  ) 
  {
  	//Get mode from route path
    route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });
  }

  ngOnInit() {
    
    this.redirectData = this.compassService.getRedirectData();

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocation = data;
        //console.log(this.filterLocation, 'cost location');      
        //this.getEditedIngredient();
    })

    this.translation();
    this.getUnidadesDeMedida();
    this.getEditedPackaging();
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

	public translation(){

     this.translate.get('articles.packagings.notifications.packagingEditedTitle').subscribe((res: string) => {
      this.packagingEditedTitle = res;
    });

     this.translate.get('articles.packagings.notifications.packagingEditedContent').subscribe((res: string) => {
      this.packagingEditedContent = res;
    });
  }

  public uploadImage(){
    //When saving, first send a notification to the crop and upload component to upload the image.
    this.upload.next(true);
  }

  public imageUploadFinished(){
    //Called by the crop and upload component after finishing upload
    this.editPackaging();
  }

  public langObjRefreshed(e) {
    this.packagingUpdatedLang = e.langsObj;
  }

  public getEditedPackaging(){
    //Get the packaging being edited. Only includes the active language of multilingual fields
    this.packagingService.getPackaging(this.id, this.filterLocation).subscribe(
      (data: any) => {
        this.packagingOnEdit = data;
         // console.log('this.packagingOnEdit');
         // console.log(this.packagingOnEdit);

        //Get all subfamilies available for the ingredient's family
        this.familyService.getFamily('packaging', 10000, 0, '','').subscribe(
          (familyData: any) => {
            this.families = familyData.families;
            this.families.find((e, i) => {
              if (e._id == this.packagingOnEdit.family) {
                this.subfamilies = this.families[i].subfamilies;
                // console.log('this.subfamilies');
                // console.log(this.subfamilies);
              }
            })
          });
      })

    //Get all languages for multilingual fields
    this.packagingService.getLangsPackaging(this.id).subscribe(
      (data: any) => {
        this.packagingLangOnEdit = data.lang;
        // console.log('this.packagingLang');
        // console.log(this.packagingLang);
        this.forceRefreshForEdit.emit(this.packagingLangOnEdit);
      })
  }

  public editPackaging() {
    //Pass No delete redirect data to the parent component
    this.passRedirectOn.emit(true);
    
    this.forceRefreshForEdit.emit(true);

    // console.log('this.packaging.active');
    // console.log(this.packaging.active);

    let packagingObj = {
      _id: this.packagingOnEdit._id,
      gallery: this.packagingOnEdit.gallery,
      lang: this.packagingUpdatedLang,
      active: this.packagingOnEdit.active,
      family: this.packagingOnEdit.family,
      subfamily: this.packagingOnEdit.subfamily,
      referenceNumber:this.packagingOnEdit.referenceNumber,
      measurementUnit: this.packagingOnEdit.measurementUnit,
      referencePrice: this.packagingOnEdit.referencePrice || 0,
      averagePrice: this.packagingOnEdit.averagePrice,
    };

    // console.log('packagingObj');
    // console.log(packagingObj);

    this.packagingService.editPackaging(packagingObj).subscribe(
      (data) => {
        this.notification.success(this.packagingEditedTitle,this.packagingEditedContent);
        //console.log(this.notification,'notification')
        this.packagingLang = {
          name: '',
          description: '',
        }
      },
      (err) => {
          this.notification.error('Error', err || 'Error');
        }); 
  }

  public notificationDestroyed(e){
    if(e.type!="error"){
           //this.router.navigate(['/articles/packagings']);
        }
  }

  public getUnidadesDeMedida() {
    this.measurementUnitService.getBaseUnits().subscribe(
      (data: any)=> {
        this.measurementUnits = data.measurementUnits;
      },
      (err) => {
          this.notification.error('Error', err || 'Error');
        }); 
  }

  public familySelected(i) {
    if (i != '') {
      //A family has been selected
      //load subfamilies for the family selected
      this.subfamilies = this.families[i].subfamilies;
      //Store the updated family selection in the ingredientOnEdit object and reset subfamily selection
      this.packagingOnEdit.family = this.families[i]._id;;
      this.packagingOnEdit.subfamily = null;
    } else {
      //No family selected thus we first reset subfamilies to zero
      this.subfamilies = [];
      this.packagingOnEdit.family = null;
      this.packagingOnEdit.subfamily = null;
    }
  }

  public subFamilySelected(value){
    if(value=='') { 
      //No subfamily selected thus we set subfamily to undefined
      this.packagingOnEdit.subfamily= null; 
      }
    else {
      //Family selected and value is the _id. Set the subfamily value both for new and edit mode
      this.packagingOnEdit.subfamily = value; 
      }
    }

  public measuringUnitSelected(i){
    this.packagingOnEdit.measurementUnit=this.measurementUnits[i];
  }

  public activeSelected(value){
    value=='yes'? this.packaging.active=true : this.packaging.active=false;
    //In edit mode we store the updated value in the packagingOnEdit object
    if (this.packagingOnEdit) this.packagingOnEdit.active=this.packaging.active;
  }

  public redirect() {

    if(this.redirectData && this.redirectData.activated) { //user came from articles tab in providers, need to redirect back to providers
      let _id = this.redirectData.id;
      let _versionId = this.redirectData.versionId;
      let mode = this.redirectData.mode;
      let originPath = this.redirectData.originPath;

       //Pass No delete redirect data to the parent component
      this.passRedirectOn.emit(true);
      
      //Reset redirect data.
      this.compassService.resetRedirectData();

      if (mode == 'edit') {
        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, tab: 'menu'}]);
      } else if (this.redirectData.mode == 'view') {
        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, tab: 'menu'}]);
      }
     } else { 
       this.router.navigate(['./articles/packagings']);
     }
  }

  public deleteImage() {}
}
