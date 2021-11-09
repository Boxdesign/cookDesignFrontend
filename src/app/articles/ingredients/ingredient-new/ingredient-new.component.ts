/**
 * Created by odin on 12/08/16.
 */
import {Component, ViewContainerRef, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { IngredientsService } from '../ingredients.service'
import { FamilyService } from '../../../libraries/family/family.service'
import { AppConfig } from '../../../global-utils/services/appConfig.service'
import { AllergenService } from '../../../libraries/allergen/allergen.service'
import { MeasurementUnitService } from '../../../libraries/measurement-unit/measurement-unit.service'
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from '../../../global-utils/services/compass.service';
import { Subject, Observable} from 'rxjs/Rx';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'ingredient-new',
  templateUrl: './ingredient-new.template.html'
})
export class IngredientNewComponent {
  public selectedMu;

  public id: string;
  public action: string;

  public ingredientLang = {
    name: '',
    description: '',
    equivalenceUnitName:'',
    tastingNote:'',
    region:'',
    alcoholPercentage:'',
    
  }

  public options = {
     timeOut: 1500,
    position: ["top", "right"]
   }
   public ingredientCreatedTitle;
   public ingredientCreatedContent;

  public ingredient = {
    family: null,
    subfamily: null,
    active: true, //default value is true
    measuringUnit: '',
    equivalenceUnit: '',
    referencePrice:0,
    averagePrice:'',
    equivalenceQty:'',
    temporality: {
      isActive: false,
      month : {
        january: false,
        february: false,
        march: false,
        april: false,
        may: false,
        june: false,
        july: false,
        august: false,
        september: false,
        october: false,
        november: false,
        december: false
      }
    }
  }

  public families;
  public subfamilies;
  public allergens;
  public measurementUnits;

  public ingredientUpdatedLang: any[] = [];
  public ingredients;

  public imageObject;
  public editedIngredient: any[] = [];
  public ingredientOnEdit: any;
  public ingredientLangOnEdit: any;

  public forceRefresh = new EventEmitter();
  public forceRefreshForEdit = new EventEmitter();

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public redirectData;
  public saving: boolean = false;
  public discardChanges: Subject<boolean> = new Subject();
  public deactivate: Subject<boolean> = new Subject();
  public alertHeader;
  public alertMessage;
  public upload = new Subject();
  public months = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'
        ];

  constructor(
  	public measurementUnitService: MeasurementUnitService, 
  	public familyService: FamilyService,
    public allergensService: AllergenService, 
    public appConfig: AppConfig,
    public  ingredientService: IngredientsService, 
    public confirmationService: ConfirmationService, 
    public router: Router, 
    public notification: NotificationsService, 
    public translate: TranslateService,
    public compassService: CompassService
  ) {}

   ngOnInit() {
    this.translation();
    this.getUnidadesDeMedida();
    this.getFamilies();
    this.getAllergens();
    this.redirectData = this.compassService.getRedirectData();
    // console.log('action:',this.action);
    // console.log('id',this.id);
  }
  public translation(){

    this.translate.get('articles.ingredients.notifications.ingredientCreatedTitle').subscribe((res: string) => {
      this.ingredientCreatedTitle = res;
    });

    this.translate.get('articles.ingredients.notifications.ingredientCreatedContent').subscribe((res: string) => {
      this.ingredientCreatedContent = res;
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
    this.addIngredient();
  }

  public langObjRefreshed(e) {
    this.ingredientUpdatedLang = e.langsObj;
  }   

  public addIngredient() {
    this.forceRefresh.emit(true);
    let allergens=this.preSubmitGetAllergens();


    let ingredientObj = {
      gallery: this.imageObject? this.imageObject._id : null,
      lang: this.ingredientUpdatedLang,
      equivalenceQty: this.ingredient.equivalenceQty,
      active: this.ingredient.active,
      family: this.ingredient.family,
      subfamily: this.ingredient.subfamily,
      referencePrice: this.ingredient.referencePrice || 0, //set reference price to zero if no price defined
      averagePrice: this.ingredient.averagePrice,
      measurementUnit: this.ingredient.measuringUnit,
      temporality: this.ingredient.temporality,
      allergens: allergens
    };

    //console.log('ingredientObj');
    // console.log(ingredientObj);

    this.ingredientService.addIngredient(ingredientObj).subscribe(
      (data:any) => {
       
       this.notification.success(this.ingredientCreatedTitle, this.ingredientCreatedContent);
       this.saving=true; //set saving flag to true in order to bypass candeactivate

        this.ingredientLang = {
          name: '',
          description: '',
          equivalenceUnitName:'',
          tastingNote:'',
          region:'',
          alcoholPercentage:''
        }
        this.router.navigate(['/articles/ingredients/edit/', data._id]);
       
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
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
          this.router.navigate(['/articles/ingredients']);
        }
  }   

  public getUnidadesDeMedida() {
    this.measurementUnitService.getBaseUnits().subscribe(
      (data: any)=> {
        this.measurementUnits = data.measurementUnits;
         this.ingredient.measuringUnit=this.measurementUnits[0];
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    )
  }

  public getFamilies() {
    this.familyService.getFamily('ingredient', 10000, 0, '','').subscribe(
      (data: any) => {
        this.families = data.families;
        //Set family and subfamilies 
        if(this.families.length) {
        	this.ingredient.family = this.families[0]._id;
	        this.subfamilies=this.families[0].subfamilies;
        }
        else 
        {
        	this.ingredient.family = null;
        	this.subfamilies = [];
        }
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getAllergens() {
    this.allergensService.getAllergens(10000,0,'','').subscribe(
      (data: any) => {
        this.allergens = data.allergens;
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    )
  }

  public preSubmitGetAllergens() {
    //Antes de enviar el ingrediente a la api, cogeremos todos los alergenos que tengan algun nivel y los devolveremos.

    let importantAllgergens = [];

    this.allergens.forEach((e, i) => {
        if (e.level && e.level != 0) {

          var iAllergen = {
            'allergen': e._id,
            'level': e.level
          };

          importantAllgergens.push(iAllergen);
        }
      }
    );

    return importantAllgergens;
  }

  public allergenSelected(allergen, index) {
    //Si no tiene nivel de gravedad le asignamos uno
    allergen.level = !allergen.level ? 0 : allergen.level;

    //Garantizamos que el nivel de gravedad maximo es 2
    allergen.level = allergen.level + 1 > 2 ? 0 : allergen.level + 1;

    //Modifying allergen implies modifying the allergen object in the view (2-way bindig) as well as the allergens array, this.allergens.
  }

  public familySelected(i) {
    if (i != '') {
      this.subfamilies = this.families[i].subfamilies;
      this.ingredient.family = this.families[i]._id;
      this.ingredient.subfamily = null;
    } else {
      //No family selected thus we first reset subfamilies to zero
      this.subfamilies = [];
      //then reset family and subfamily selections
      this.ingredient.subfamily=null;
      this.ingredient.family=null;
    }
  }

  public subFamilySelected(value){
    if(value=='') { 
      //No subfamily selected thus we set subfamily to undefined
      this.ingredient.subfamily = null; 
    }
    else {
      //Family selected and value is the _id. Set the subfamily value both for new and edit mode
      this.ingredient.subfamily = value; 
      }
  }

  public measuringUnitSelected(i){
    if (i != '') {
      this.ingredient.measuringUnit=this.measurementUnits[i];
     }
     else {
      this.ingredient.measuringUnit = '';
    }
  }

  public activeSelected(value){
    value=='yes'? this.ingredient.active=true : this.ingredient.active=false;
  }

  public deleteImage() {}

  public redirect() {

    if(this.redirectData && this.redirectData.activated) { //user came from articles tab in providers, need to redirect back to providers
      let _id = this.redirectData.id;
      let _versionId = this.redirectData.versionId;
      let mode = this.redirectData.mode;
      let originPath = this.redirectData.originPath;
      
      //Reset redirect data.
      this.compassService.resetRedirectData();

      if (mode == 'edit') {
        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, tab: 'menu'}]);
      } else if (this.redirectData.mode == 'view') {
        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, tab: 'menu'}]);
      } else {
        this.router.navigate(['./' + originPath]);
      }
     } else { //user came from recipes
       this.router.navigate(['./articles/ingredients']);
     }
  }  
}

