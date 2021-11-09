import { Input, Component, ViewContainerRef, EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader} from 'ng2-file-upload';
import { AppConfig } from '../../../global-utils/services/appConfig.service'
import { IngredientsService } from '../ingredients.service'
import { TranslateService } from 'ng2-translate/ng2-translate'
import { AllergenService } from '../../../libraries/allergen/allergen.service'
import { NotificationsService } from 'angular2-notifications';
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'
import { Subject, Observable} from 'rxjs/Rx'
import { CompassService } from "../../../global-utils/services/compass.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'quartering',
  templateUrl: './quartering.component.html',
  styleUrls: ['./quartering.component.scss'],
  inputs: ['ingredientId']
})
export class QuarteringComponent implements OnInit {
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  
  public ingredientId: string;

  public quarteringLang = {
    name: ''
  }

  public quarteringLangs: any[] = [];

  public quartering = {
    _id: null,
    ingredientPercentage: 0,
    netPercentage: 0,
    referencePrice: 0,
    netPercentageCost:0,
    gallery: null,
    quartering: null
  }

  public allergens;
  public netCostWithoutWaste: number;
  public waste: number;
  public quarteringCost;
  public totalNetPercentage: number;
  public totalCost: number;

  public ingredientOnEdit;
  public quarteringUpdatedLang: any[] = [];
  public quarterings;

  public imageObject;
  public editedQuartering: any[] = [];
  public quarteringLangOnEdit: any;

  public forceRefresh = new EventEmitter();

  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public options= {
    timeOut: 1500,
    position: ["top", "right"]
  }
  public quarteringCreatedTitle;
  public quarteringCreatedContent;
  public quarteringEditedTitle;
  public quarteringEditedContent;
  public quarteringDeletedTitle;
  public quarteringDeletedContent;
  public quarterOnEdit: any;
  public mode;
  public filterCost = [];
  public numPages:number;
  public observerLocation;
  public status;
  public upload = new Subject();
  public totalNetPercentageCost;
  public modalRef: BsModalRef;

  constructor(
  	public appConfig: AppConfig, 
  	public ingredientService: IngredientsService, 
  	public translate: TranslateService,
    public allergensService: AllergenService, 
    public notification: NotificationsService, 
    public router: Router,
    public route: ActivatedRoute, 
    public costFilterService: CostFilterService,
		public compassService: CompassService,
		private modalService: BsModalService
  ) {}

  ngOnInit() {

    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    }); 

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterCost = data;     
        this.getEditedIngredient();
        this.getQuarterings();
    })

    this.translation();
    this.getEditedIngredient();
    this.getQuarterings();
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public translation(){
    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
      //console.log('translation: '+ res);
    }); 

    this.translate.get('articles.ingredients.notifications.quarteringCreatedTitle').subscribe((res: string) => {
      this.quarteringCreatedTitle = res;
    });

    this.translate.get('articles.ingredients.notifications.quarteringCreatedContent').subscribe((res: string) => {
      this.quarteringCreatedContent = res;
    });
    this.translate.get('articles.ingredients.notifications.quarteringEditedTitle').subscribe((res: string) => {
      this.quarteringEditedTitle = res;
    });

    this.translate.get('articles.ingredients.notifications.quarteringEditedContent').subscribe((res: string) => {
      this.quarteringEditedContent = res;
    });
    this.translate.get('articles.ingredients.notifications.quarteringDeletedTitle').subscribe((res: string) => {
      this.quarteringDeletedTitle = res;
    });

    this.translate.get('articles.ingredients.notifications.quarteringDeletedContent').subscribe((res: string) => {
      this.quarteringDeletedContent = res;
    });
  }

    public addClick(){
    this.cleanFields();
    this.status = 'new';
  }

  public editClick(){
    this.status = 'edit';
  }

  public viewClick(){
    this.status = 'view'
  }

  public uploadImage(){
    //When saving, first send a notification to the crop and upload component to upload the image.
    this.upload.next(true);
  }
  public langObjRefreshed(e) {
    this.quarteringUpdatedLang = e.langsObj;
  }

  public getEditedIngredient(){
    //Get the quartering ingredient being edited. Only includes the active language of multilingual fields
    this.ingredientService.getIngredient(this.ingredientId, this.filterCost).subscribe(
      (data: any) => {
        this.ingredientOnEdit = data;
        if(this.filterCost.length) this.ingredientOnEdit.referencePrice = this.ingredientOnEdit.averagePrice;
      })
  }

  public getQuarterings(){
    //Get all quarterings for the ingredient
    this.ingredientService.getQuarterings(
      this.ingredientId, 
      this.itemsPerPage, 
      this.currentPage-1,
      this.filterText,
      this.sortField,
      this.sortOrder,
      this.filterCost
    ).subscribe(
      (data: any) => {
        this.quarterings = data.ingredients;
        this.totalItems = data.totalElements;
        this.calculateTotals();
        this.calculateCosts();
      })
  }

  public calculateTotals(){
    this.waste=100;
    this.totalNetPercentage=0;
    this.totalCost=0;
    this.quarterings.forEach((quartering) => {
      this.waste-=quartering.ingredientPercentage;
      this.totalNetPercentage+=quartering.netPercentage;
    })    
   }

  public calculateCosts(){
    this.ingredientService.getIngredient(this.ingredientId, this.filterCost).subscribe(
      (data: any) => {
        let ingredientOnEdit = data;
        if(this.filterCost.length) ingredientOnEdit.referencePrice = ingredientOnEdit.averagePrice;

        if(this.totalItems>0) {
          // let netCost=ingredientOnEdit.referencePrice/((100-this.waste)/100);
          // this.netCostWithoutWaste=Math.round(netCost * 100) / 100;
          this.netCostWithoutWaste=ingredientOnEdit.referencePrice/((100-this.waste)/100);
          
          let cost: number;
          let totalCost=0;
          let totalNetPercentageCost=0;
          this.quarterings.forEach((quartering, i) => {
            // cost=(quartering.netPercentage/100)*this.netCostWithoutWaste;
            // quartering.referencePrice=Math.round(cost * 100) / 100;
            quartering.netPercentageCost=this.netCostWithoutWaste*(quartering.netPercentage/100);
            quartering.referencePrice = quartering.netPercentageCost / ( quartering.ingredientPercentage / 100);
            totalNetPercentageCost+=quartering.netPercentageCost;
            totalCost+=quartering.referencePrice;
          })
          //this.totalCost=Math.round(totalCost * 100) / 100;
          this.totalCost=totalCost;
          this.totalNetPercentageCost=totalNetPercentageCost;
         }
      })
   }

  public calculateQuarteringCost() {
     let newWaste=this.waste-this.quartering.ingredientPercentage;
     let newNetCostWithouWaste=this.ingredientOnEdit.referencePrice/((100-newWaste)/100);
     this.quartering.netPercentageCost=newNetCostWithouWaste*(this.quartering.netPercentage/100);
     this.quartering.referencePrice = this.quartering.netPercentageCost / (this.quartering.ingredientPercentage / 100) ;
   }

  public selectQuarteringToEdit(quarteringIngredient) {
    this.quartering = JSON.parse(JSON.stringify(quarteringIngredient));
    this.ingredientService.getLangsIngredient(quarteringIngredient._id).subscribe(
      (data: any) => {        
        this.quarteringLangs = data.lang;
        this.forceRefresh.emit(this.quarteringLangs);
      })
  } 

  public saveQuartering() {
    if(this.status == 'new'){
      this.forceRefresh.emit(true);
      this.calculateQuarteringCost();

      let quarteringObj = {
        gallery: this.imageObject,
        quartering: this.ingredientId,
        lang: this.quarteringUpdatedLang,
        ingredientPercentage: this.quartering.ingredientPercentage,
        netPercentage: this.quartering.netPercentage,
        active: this.ingredientOnEdit.active,
        referencePrice: this.quartering.referencePrice,
        equivalenceQty: this.ingredientOnEdit.equivalenceQty,
        family: this.ingredientOnEdit.family,
        subfamily: this.ingredientOnEdit.subfamily,
        measurementUnit: this.ingredientOnEdit.measurementUnit,
        averagePrice: this.ingredientOnEdit.averagePrice,
        allergens: this.ingredientOnEdit.allergens        
      };

      this.ingredientService.addQuartering(quarteringObj).subscribe(
        (data) => {
          this.notification.success(this.quarteringCreatedTitle,this.quarteringCreatedContent);
          this.quarteringLang = {
            name: '',
          }
          this.getQuarterings();
        },
        (err) => {
          this.notification.error('Error', err || 'Server error');
        });  

      } else if(this.status == 'edit') {
          this.forceRefresh.emit(true);

          let quarteringIngredientObj = {
            _id: this.quartering._id,
            gallery: this.imageObject,
            lang: this.quarteringUpdatedLang,
            ingredientPercentage: this.quartering.ingredientPercentage,
            netPercentage: this.quartering.netPercentage,
            quartering: this.quartering.quartering
          };

          this.ingredientService.editQuartering(quarteringIngredientObj).subscribe(
            (data) => {
               this.notification.success(this.quarteringEditedTitle, this.quarteringEditedContent);
              this.quarteringLang = {
                name: ''
              };
              this.getQuarterings();
            },
            (err) => {
                this.notification.error('Error', err || 'Server error');
              }); 
              
      }    
  }

  public deleteQuartering() {
    this.ingredientService.deleteQuartering(this.quartering._id).subscribe(
      (data) => {
        this.notification.success(this.quarteringDeletedTitle, this.quarteringDeletedContent)
        this.getQuarterings();
        //For every quartering addition, quartering costs change and must be updated.
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }); 
  }

  public viewQuartering(quartering){

		setTimeout(()=>{
	    		this.router.navigate(['/articles/']);
		}, 100)

		setTimeout(()=>{

  		let mode;
  		//Save redirect data
  		if(this.mode == 'view') mode = 'view'; else mode = 'edit';
	
			this.compassService.saveRedirectData('/articles/ingredients',this.ingredientId, null, mode)
	    this.router.navigate(['/articles/ingredients/',quartering._id]);
		}, 300)  		
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
    	template,
			Object.assign({}, {}, { class: 'modal-lg' })
    );
  }

  public cleanFields(){
    this.quartering.ingredientPercentage=0;
    this.quartering.netPercentage=0;
    this.quartering.referencePrice=0;
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.getQuarterings();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.getQuarterings();
  }

  public searchQuarterings(value: string) {
    this.filterText = value;
    this.currentPage = 1;
    this.getQuarterings();
  }
  public deleteImage() {
      this.quartering.gallery=null;
      this.imageObject=null;
    }
}