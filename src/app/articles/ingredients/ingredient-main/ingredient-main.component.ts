 import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
 import { Router, ActivatedRoute } from '@angular/router';
 import { Subject, Observable} from 'rxjs/Rx'
 import { IngredientsService } from '../ingredients.service'
 import { FamilyService } from '../../../libraries/family/family.service'
 import { AllergenService } from '../../../libraries/allergen/allergen.service'
 import { MeasurementUnitService } from '../../../libraries/measurement-unit/measurement-unit.service'
 import { NotificationsService } from 'angular2-notifications'
 import { TranslateService } from 'ng2-translate/ng2-translate'
 import { CompassService } from '../../../global-utils/services/compass.service';
 import { CostFilterService } from '../../../global-utils/services/cost-filter.service'


@Component({
  selector: 'ingredient-main',
  templateUrl: './ingredient-main.component.html',
  styleUrls: ['./ingredient-main.component.scss']
})
export class IngredientMainComponent implements OnInit {
  @Input() id: string;
  @Output() passRedirectOn = new EventEmitter();
   public selectedMu;

   public ingredientLang = {
    name: '',
    description: '',
    equivalenceUnitName:'',
    tastingNote:'',
    region:'',
    alcoholPercentage:''
  }

   public ingredient = {
     family: '',
     subfamily: '',
    active: true, //default value is true
    measuringUnit: ''
  }

  public families;
  public subfamilies;
  public allergens;
  public measurementUnits;

  public ingredientUpdatedLang: any[] = [];
  public ingredients;

  public ingredientOnEdit: any;
  public ingredientLangOnEdit: any;

  public forceRefresh = new EventEmitter();
  public forceRefreshForEdit = new EventEmitter();
  public ingredientEditedTitle;
  public ingredientEditedContent;
  public mode;
  public redirectData;
  public filterLocation;
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

  public options = {
    timeOut: 1500,
    position: ["top", "right"]
  };

  public observerLocation;
  public upload = new Subject();

  constructor(
  	public  ingredientService: IngredientsService, 
  	public allergensService: AllergenService,
    public familyService: FamilyService, 
    public router: Router,
    public measurementUnitService: MeasurementUnitService, 
    public notification: NotificationsService, 
    public translate: TranslateService, 
    public route: ActivatedRoute, 
    public compassService: CompassService, 
    public costFilterService: CostFilterService
  ) {}

  ngOnInit() {    
    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });

    this.redirectData = this.compassService.getRedirectData();

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocation = data;
        //console.log(this.filterLocation, 'cost location');      
        //this.getEditedIngredient();
    })
 
    this.translation();
    this.getUnidadesDeMedida();
    // this.getFamilies();
    // this.getAllergens();
    this.getEditedIngredient();
    //this.mergeAllergens();
    // console.log('action:',this.action);
    // console.log('id',this.id);    
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public translation(){ 

    this.translate.get('articles.ingredients.notifications.ingredientEditedTitle').subscribe((res: string) => {
      this.ingredientEditedTitle = res;
    });

    this.translate.get('articles.ingredients.notifications.ingredientEditedContent').subscribe((res: string) => {
      this.ingredientEditedContent = res;
    });
  }

  public uploadImage(){
  	//When saving, first send a notification to the crop and upload component to upload the image.
  	this.upload.next(true);
  }

  public imageUploadFinished(){
  	//Called by the crop and upload component after finishing upload
  	this.editIngredient();
  }

  public langObjRefreshed(e) {
    this.ingredientUpdatedLang = e.langsObj;
  }

  public onChange (event) {
    console.log(event, 'event')
  }

  public getEditedIngredient(){
    //Get the ingredient being edited. Only includes the active language of multilingual fields
    this.ingredientService.getIngredient(this.id, this.filterLocation).subscribe(
      (data: any) => {

      this.ingredientOnEdit = data;

      if(!this.ingredientOnEdit.temporality) {
        this.ingredientOnEdit.temporality = {month:{}};
        this.ingredientOnEdit.temporality.isActive = false;
        this.ingredientOnEdit.temporality.month.january = false;
        this.ingredientOnEdit.temporality.month.february = false;
        this.ingredientOnEdit.temporality.month.march = false;
        this.ingredientOnEdit.temporality.month.april = false;
        this.ingredientOnEdit.temporality.month.may = false;
        this.ingredientOnEdit.temporality.month.june = false;
        this.ingredientOnEdit.temporality.month.july = false;
        this.ingredientOnEdit.temporality.month.august = false;
        this.ingredientOnEdit.temporality.month.september = false;
        this.ingredientOnEdit.temporality.month.october = false;
        this.ingredientOnEdit.temporality.month.november = false;
        this.ingredientOnEdit.temporality.month.december = false;
        }

      //Get all subfamilies available for the ingredient's family
      this.familyService.getFamily('ingredient', 10000, 0, '','').subscribe(
        (familyData: any) => {
          this.families = familyData.families;
          this.families.find((e, i) => {
            if (e._id == this.ingredientOnEdit.family) {
              this.subfamilies = this.families[i].subfamilies;
              // console.log('this.subfamilies');
              // console.log(this.subfamilies);
            }
          })            
      });
      
      this.allergensService.getAllergens(10000,0,'','').subscribe(
        (data: any) => {
          this.allergens = data.allergens;
          // console.log('this.allergens');
          // console.log(this.allergens);
          //recorreremos los alergenos, para cada alergeno buscaremos si tiene registro en el ingrediente, si es así, los mezclaremos
          this.allergens.forEach((allergen, index) => {
            this.ingredientOnEdit.allergens.forEach((e, i) => {
              if(e.allergen == allergen._id){
                allergen.level=e.level;
              }
            })

          })
        })
    })

    //Get all languages for multilingual fields
    this.ingredientService.getLangsIngredient(this.id).subscribe(
      (data: any) => {
        this.ingredientLangOnEdit = data.lang;
        // console.log('this.ingredientLangOnEdit');
        // console.log(this.ingredientLangOnEdit);
        this.forceRefreshForEdit.emit(this.ingredientLangOnEdit);
      })
   
  }

  public editIngredient() {

    //Pass No delete redirect data to the parent component
    this.passRedirectOn.emit(true);

    this.forceRefreshForEdit.emit(true);
    let allergens=this.preSubmitGetAllergens();   
    
    let ingredientObj = {
      _id: this.ingredientOnEdit._id,
      gallery: this.ingredientOnEdit.gallery,
      lang: this.ingredientUpdatedLang,
      equivalenceQty: this.ingredientOnEdit.equivalenceQty,
      active: this.ingredientOnEdit.active,
      family: this.ingredientOnEdit.family,
      subfamily: this.ingredientOnEdit.subfamily,
      measurementUnit: this.ingredientOnEdit.measurementUnit,
      referencePrice: this.ingredientOnEdit.referencePrice,
      averagePrice: this.ingredientOnEdit.averagePrice,
      temporality: this.ingredientOnEdit.temporality,
      allergens: allergens
    };

    this.ingredientService.editIngredient(ingredientObj).subscribe(
      (data) => {
        this.notification.success(this.ingredientEditedTitle, this.ingredientEditedContent);
        // this.ingredientLang = {
        //   name: '',
        //   description: '',
        //   equivalenceUnitName:''
        // }; 
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      }
      )      
  }

  public notificationDestroyed(e){
    if(e.type!="error"){
       //this.router.navigate(['/articles/ingredients']);
        }
  }
  
  public getUnidadesDeMedida() {
    this.measurementUnitService.getBaseUnits().subscribe(
      (data: any)=> {
        this.measurementUnits = data.measurementUnits;
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      }
      )
  }

  public getAllergens() {
    this.allergensService.getAllergens(10000,0,'','').subscribe(
      (data: any) => {
        this.allergens = data.allergens;
        // console.log('this.allergens');
        // console.log(this.allergens);
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
     })
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
      //A family has been selected
      //console.log('A family has been selected');
      //load subfamilies for the family selected
      this.subfamilies = this.families[i].subfamilies;
      //Store the updated family selection in the ingredientOnEdit object and reset subfamily selection
      this.ingredientOnEdit.family = this.families[i]._id;;
      this.ingredientOnEdit.subfamily = null;
    } else {
      //No family selected thus we first reset subfamilies to zero
      //console.log('No family selected');
      this.subfamilies = [];
      //then reset family and subfamily selections
      this.ingredientOnEdit.family = null;
      this.ingredientOnEdit.subfamily = null;
    }
  }

  public subFamilySelected(value){
    if(value=='') { 
       this.ingredientOnEdit.subfamily= null; 
    }
    else {
      //Family selected and value is the _id. Set the subfamily value
      this.ingredientOnEdit.subfamily = value; 
    }
  }

  public measuringUnitSelected(i){
    this.ingredientOnEdit.measurementUnit=this.measurementUnits[i];
  }

  public activeSelected(value){
    if(this.mode == 'new') {
      if(value == 'yes') this.ingredient.active=true
      else this.ingredient.active=false
    } else {
      if(value == 'yes') this.ingredientOnEdit.active=true
      else this.ingredientOnEdit.active=false
    }
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
      } else {
        this.router.navigate(['./' + originPath]);
      }
     } else { //user came from recipes
       this.router.navigate(['./articles/ingredients']);
     }
  }   

}

