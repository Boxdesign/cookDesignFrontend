import { Input, Output, Component, OnInit, ViewContainerRef, EventEmitter, ViewChild} from '@angular/core';
import { FileUploader} from 'ng2-file-upload';
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { ArticleService } from "../article.service";
import { LocationService } from "../../../global-utils/services/location.service";
import { AccountService } from "../../../global-utils/services/account.service";
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Article } from '../../../global-utils/models/article.model'
import { ProviderService } from "../../providers/provider.service";
import { IngredientsService } from "../../../articles/ingredients/ingredients.service";
import { Observable, Subject } from "rxjs/Rx";
import { PackagingsService } from '../../../articles/packagings/packagings.service'
import { PackFormatService } from '../../../libraries/pack-format/pack-format.service'
import { MeasurementUnitService } from '../../../libraries/measurement-unit/measurement-unit.service';
import { CompassService } from '../../../global-utils/services/compass.service';
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";
import { ConfirmationService } from 'primeng/primeng';


@Component({
  selector: 'article-main',
  templateUrl: './article-main.component.html',
  styleUrls: ['./article-main.component.scss']
})
export class ArticleMainComponent implements OnInit {
  @ViewChild('selectProvider') selectProvider;
  @ViewChild('selectIngredient') selectIngredient;
  @ViewChild('selectPackaging') selectPackaging;
  @ViewChild('selectPackFormat') selectPackFormat;
  mode;
  id: string;
  userLocations;
  selectedLocations = [];
  account;
  articleCreatedTitle;
  articleCreatedContent;
  articleUpdatedTitle;
  articleUpdatedContent;
  public alertHeader;
  public alertMessage;
  article = undefined;
  apiUrl;
  uploadUrl;
  providers;
  providersSelector;
  selectedProvider;
  providersPopulated=false;
  articleCategories
  selectedCategory='ingredient';
  ingredientSelector=[];
  ingredientSelectorPopulated=true
  packagingSelector
  packagingSelectorPopulated=true
  ingredients;
  packagings;
  activeProvider;
  activeIngredient;
  activePackaging;
  activePackFormat;
  redirectData;
  ingredientSubject: Subject<any> = new Subject();
  packagingSubject: Subject<any> = new Subject();
  providerSubject: Subject<any> = new Subject();
  packFormatSubject: Subject<any> = new Subject();
  measUnitPopulated=false;
  packFormats;
  packFormatSelector;
  compassRedirectData;
  public priceCalc = {
    packFormat : null, 
    packPrice : null, 
    packUnits : null, 
    grossWeightPerUnit : null, 
    grossPrice : null, 
    netWeightPerUnit : null, 
    netPrice : null

  };
  public saving: boolean = false;
  public deactivate: Subject<boolean> = new Subject();

  articleLang = {
    name: '',
    description: ''
  };

  articleUpdatedLang;

  forceRefresh = new EventEmitter();

  options = {
     timeOut: 1500,
    position: ["top", "right"]
   }

  public uploader: FileUploader;
  public _ingredientSearch: string = null;
  public _packagingSearch: string = null;
  public _packFormatSearch: string = null;
  public providerSearch: string = null;
  public observerLocation;
  public filterLocations = [];
  public savedLocations = [];

  constructor(
  	public router: Router, 
  	public appConfig: AppConfig, 
  	public locationService: LocationService,
    public articleService: ArticleService, 
    public accountService: AccountService, 
    public route: ActivatedRoute,
    public notification: NotificationsService, 
    public translate: TranslateService, 
    public providerService: ProviderService,
    public ingredientService: IngredientsService, 
    public packagingService: PackagingsService, 
    public measurementUnitService: MeasurementUnitService, 
    public packFormatService:PackFormatService, 
    public compassService: CompassService,
    public costFilterService: CostFilterService,
    public confirmationService: ConfirmationService
 ) {
  }

  ngOnInit() {

    this.apiUrl = this.appConfig.apiUrl;
    this.uploadUrl = this.apiUrl + '/document?destination=docs/articles';

    this.route.params.subscribe(params => {this.id=params['id'];});

    //Get mode from route path
    this.route.data.subscribe((data: {mode: string, providerId: string}) => {
      if(data.mode) this.mode = data.mode;
    });

    //In case the user is coming from the articles tab in providers, redirectData contains the info to be able to redirect the user back
    //to providers. We know whether the user is coming from providers with the flag activated in redirectData.
    this.compassRedirectData = this.compassService.getRedirectData();

    this.articleCategories = [{label: 'ingredient', value: 'ingredient'}, {label: 'packaging', value: 'packaging'}];

    this.translation();
    this.getUserLocations();
    //this.getProviders();
    //this.getIngredients();
    //this.getPackagings();
    this.getPackFormats();
    //this.selectIngredient.items=[];

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocations = [];
        this.savedLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.savedLocations = this.savedLocations.concat(data); 
        this.getProviders();
    }) 


    if (this.mode == 'new') {
      this.article = new Article();
      if(this.compassRedirectData && this.compassRedirectData.id) { //provider id is passed by the providers -> articles component
        this.providerService.getProvider(this.compassRedirectData.id).subscribe(
            (data:any) => { 
              this.article.provider=data;
              //Set activeProvider
              this.activeProvider=[]
              let providerObj = {
                id: this.article.provider,
                text: this.article.provider.commercialName
              }
              this.activeProvider.push(providerObj);
              console.log(this.article, 'article')
            })
       }
              console.log(this.article, 'article')
    }
    else {
      this.getArticle();
    }

    this.ingredientSubject
      .debounceTime(300)
      .subscribe((searchString) => {
        if (searchString === this._ingredientSearch) {
            // string was deleted so assign empty array to ng-select items
            this.selectIngredient.items = []
            // force the ng-select to update and show the new list
            this.selectIngredient.open()
            this._ingredientSearch = ''
        } else {
          this._ingredientSearch = searchString;
          this.articleService.getIngredients(50, 0, searchString, '', 1, null, true, true).subscribe(
            (data:any) => {
              this.ingredients = data.ingredients;
              if(this.ingredients.length == 0){
              let object = [{
                    id: 1,
                    text: 'No results'
                  }]

                this.selectIngredient.items = object;
                this.selectIngredient.open();

              } else {              
                //this.ingredientSelector = [];
                let ingData = this.ingredients.map((ingredient, index) => { 
                  let object = {
                    id: ingredient,
                    text: ingredient.lang.name
                  }
                  return object;
                })
                this.selectIngredient.items = ingData;
                this.selectIngredient.open();
               }
            },
            (err) => {
              this.notification.error('Error', err || 'Error');
            });
        }
      });

    this.packagingSubject
      .debounceTime(300)
      .subscribe((searchString) => {
        if (searchString === this._packagingSearch) {
            // string was deleted so assign empty array to ng-select items
            this.selectPackaging.items = []
            // force the ng-select to update and show the new list
            this.selectPackaging.open()
            this._packagingSearch = ''

        } else {

            this._packagingSearch = searchString;
            this.packagingService.getPackagings(50, 0, searchString, '', 1, null, true).subscribe(
              (data:any) => {
                this.packagings = data.packagings;

                if(this.packagings.length == 0){
                  let object = [{
                      id: 1,
                      text: 'No results'
                    }]

                  this.selectPackaging.items = object;
                  this.selectPackaging.open();

                } else {                 
                  //this.packagingSelector = [];
                  let packData = this.packagings.map((packaging, index) =>{ 
                    let object = {
                      id: packaging,
                      text: packaging.lang.name
                    }
                    return object;
                  })
                  this.selectPackaging.items = packData;
                   this.selectPackaging.open();
                 }
              },
              (err) => {
                this.notification.error('Error', err || 'Error');
              })
        }
      });

    this.packFormatSubject
      .debounceTime(300)
      .subscribe((searchString) => {
        if (searchString === this._packFormatSearch) {
            // string was deleted so assign empty array to ng-select items
            this.selectPackFormat.items = []
            // force the ng-select to update and show the new list
            this.selectPackFormat.open()
            this._packFormatSearch = ''

        } else {

          this._packFormatSearch = searchString

          this.packFormatService.getPackagings(50, 0, 'lang.name', 1 ,searchString).subscribe(
            (data:any) => {
              this.packFormats = data.packagings;
              if(this.packFormats.length == 0){

                  let object = [{
                      id: 1,
                      text: 'No results'
                    }]

                  this.selectPackFormat.items = object;
                  this.selectPackFormat.open();

                } else {
              //this.packFormatSelector = [];
                  let packfData = this.packFormats.map((packFormat, index) =>{ 
                    let object = {
                      id: packFormat,
                      text: packFormat.lang[0].name
                    }
                    return object;
                  })
                  this.selectPackFormat.items=packfData;
                  this.selectPackFormat.open();
                }

            },
            (err) => {
              this.notification.error('Error', err || 'Error');
          })
          
        }
      });

    this.providerSubject
      .debounceTime(300)
      .subscribe((searchString) => {
        if (searchString === this.providerSearch) {
            // string was deleted so assign empty array to ng-select items
            this.selectProvider.items = []
            // force the ng-select to update and show the new list
            this.selectProvider.open()
            this.providerSearch = ''

        } else {

            this.providerSearch = searchString
            this.providerService.getProviders(50, 0, searchString, this.filterLocations, 'commercialName', 1).subscribe(
              (data:any) => {
                this.providers = data.providers;

                if(this.providers.length == 0){

                  let object = [{
                      id: 1,
                      text: 'No results'
                    }]

                  this.selectProvider.items = object;
                  this.selectProvider.open();

                } else {
                  //this.providersSelector = [];
                  let providerData = this.providers.map((provider, index) =>{ 
                    let object = {
                      id: provider,
                      text: provider.commercialName
                    }
                    return object;
                  })
                  this.selectProvider.items = providerData;
                  this.selectProvider.open();
                }
              },
              (err) => {
                this.notification.error('Error', err || 'Error');
              })
        }

      });
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public langObjRefreshed(e) {
    this.articleUpdatedLang = e.langsObj;
  }

  public translation(){
    this.translate.get('provider.article.notifications.articleCreatedTitle').subscribe((res: string) => {
      this.articleCreatedTitle = res;
    });

    this.translate.get('provider.article.notifications.articleCreatedContent').subscribe((res: string) => {
      this.articleCreatedContent = res;
    });

    this.translate.get('provider.article.notifications.articleUpdatedTitle').subscribe((res: string) => {
      this.articleUpdatedTitle = res;
    });

    this.translate.get('provider.article.notifications.articleUpdatedContent').subscribe((res: string) => {
      this.articleUpdatedContent = res;
    }); 

    this.translate.get('messageGeneric.alert').subscribe((res: string) => {
      this.alertHeader = res;
    });  

    this.translate.get('messageGeneric.alertMessage').subscribe((res: string) => {
      this.alertMessage = res;
    });

  }

  public getProviders(){
    this.providerService.getProviders(50, 0, '', this.filterLocations, 'commercialName', 1).subscribe(
      (data:any) => {
        this.providers = data.providers;
        this.providersSelector = this.providers.map((provider, index) =>{ 
					let object = {
						id: provider,
						text: provider.commercialName
					}
    			return object;
    		})
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })
  }       

  public getPackFormats(){
    this.packFormatService.getPackagings(50, 0, 'lang.name', 1,  '').subscribe(
      (data:any) => {
        this.packFormats = data.packagings;
        this.packFormatSelector = this.packFormats.map((packFormat, index) =>{ 
          let object = {
            id: packFormat,
            text: packFormat.lang[0].name
          }
          return object;
        })
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })
  }

  providerRemoved(){
  	this.article.provider=null;
  }

  providerSelected(value){
  	this.article.provider=value.id;
  }

  ingredientSelected(value){
  	this.article.category.item=value.id;

  }

  ingredientRemoved(){
  	this.article.category.item=null;
  }

  packagingSelected(value){
  	this.article.category.item=value.id;
  }

  packagingRemoved(){
  	this.article.category.item=null;
  }

  packFormatSelected(value){
    this.priceCalc.packFormat=value.id;
  }

  ingredientSearchChanged(value) {
    this.ingredientSubject.next(value);
  }

  packagingSearchChanged(value) {
    this.packagingSubject.next(value);  	
  }

  packFormatSearchChanged(value) {
    this.packFormatSubject.next(value);    
  }

  providerSearchChanged(value) {
    this.providerSubject.next(value);    
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
     this.accountService.getAccountInfo(this.article.last_account).subscribe(
      (data: any)=> {
        this.account = data;
        this.forceRefresh.emit(this.article.lang);
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getArticle() {
    this.articleService.getArticle(this.id).subscribe(
      (data) => {
        this.article = data;

      ( { grossPrice: this.priceCalc.grossPrice, 
          grossWeightPerUnit: this.priceCalc.grossWeightPerUnit,
          netPrice: this.priceCalc.netPrice, 
          netWeightPerUnit: this.priceCalc.netWeightPerUnit, 
          packFormat: this.priceCalc.packFormat, 
          packPrice: this.priceCalc.packPrice, 
          packUnits: this.priceCalc.packUnits } = this.article );

        //Set activeProvider
        this.activeProvider=[]
        let providerObj = {
          id: this.article.provider,
          text: this.article.provider.commercialName
        }
        this.activeProvider.push(providerObj);
        //Set activeIngredient or activePackaging
        if(this.article.category.kind == 'ingredient') {
          this.activeIngredient=[]
          let ingredientObj = {
            id: this.article.category.item,
            text: this.article.category.item? this.article.category.item.lang[0].name : ''
          }
          this.activeIngredient.push(ingredientObj)

        } else if (this.article.category.kind == 'packaging') {
            this.activePackaging=[]
            let packagingObj = {
              id: this.article.category.item,
              text: this.article.category.item? this.article.category.item.lang[0].name : ''
            }
            this.activePackaging.push(packagingObj)
        }

        if(this.article.packFormat) {
          //Set packFormat
          this.activePackFormat=[]
          let packFormatObj = {
            id: this.article.packFormat,
            text: this.article.packFormat.lang[0].name
          }
          this.activePackFormat.push(packFormatObj);
        }
        
        //Populate measurement unit
        this.measurementUnitService.getLangsUnidades(this.article.category.item? this.article.category.item.measurementUnit : null).subscribe(
          (data) => {
             this.article.category.item.measurementUnit = data;
             this.measUnitPopulated = true;

             //Get account info
             this.getAccountInfo();
          })       
        
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      });
  }

  public updateGrossPrice(){

    ( { grossPrice: this.article.grossPrice, 
        grossWeightPerUnit: this.article.grossWeightPerUnit,
        packFormat: this.article.packFormat, 
        packPrice: this.article.packPrice, 
        packUnits: this.article.packUnits } = this.priceCalc );
  }
  public updateNetPrice(){

    ( { netPrice: this.article.netPrice, 
        netWeightPerUnit: this.article.netWeightPerUnit } = this.priceCalc );
  }

  public saveArticle() {

    this.forceRefresh.emit(true);

    if(this.article.packPrice && this.article.packUnits && this.article.grossWeightPerUnit)
      this.article.grossPrice = this.article.packPrice / (this.article.packUnits * this.article.grossWeightPerUnit);

    if(this.article.packPrice && this.article.packUnits && this.article.grossWeightPerUnit && this.article.netWeightPerUnit && this.article.grossPrice)
      this.article.netPrice = (this.article.packPrice / (this.article.packUnits * this.article.grossWeightPerUnit)) / (this.article.netWeightPerUnit / this.article.grossWeightPerUnit);
    if (this.mode == 'new') {
      
      this.article.setLang(this.articleUpdatedLang);

      this.articleService.addArticle(this.article).subscribe(
          (data) => {
             this.saving=true; //set saving flag to true in order to bypass candeactivate
            this.notification.success(this.articleCreatedTitle, this.articleCreatedContent);
            this.router.navigate(['/providers/article/edit/', data._id]);
          },
          (err) => {
              this.notification.error('Error', err || 'Error');
          })

    } else if (this.mode == 'edit') {

        this.article.lang = this.articleUpdatedLang;

        this.articleService.editArticle(this.article).subscribe(
          (data) => {        
            this.notification.success(this.articleUpdatedTitle, this.articleUpdatedContent);
          },
          (err) => {
              this.notification.error('Error', err || 'Error');
          })
    }
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

  public redirect() {

    if(this.compassRedirectData && this.compassRedirectData.activated) { //user came from articles tab in providers, need to redirect back to providers
      let _id = this.compassRedirectData.id;
      let _versionId = this.compassRedirectData.versionId;
      let mode = this.compassRedirectData.mode;
      let originPath = this.compassRedirectData.originPath;
      //Reset redirect data.
      this.compassService.resetRedirectData();

      if (mode == 'edit') {
        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, tab: 'menu'}]);
      } else if (this.compassRedirectData.mode == 'view') {
        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, tab: 'menu'}]);
      } else {
        this.router.navigate(['./' + originPath ]);
      }
      return;
    } else { //user came from articles
       this.router.navigate(['./providers/article/']);
     }
  }

  public activeSelected(value){
    value=='yes'? this.article.active=true : this.article.active=false;
  }

  public updateSelectedLocations(e) {
    this.article.location=e;
  }

  public notificationDestroyed(e){
  }
  public selectButton(){
    this.article.category.item=null;    
  }
}

