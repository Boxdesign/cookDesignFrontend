
import {Component, ViewContainerRef, EventEmitter} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import {AllergenService} from "./allergen.service";
import {AppConfig} from "../../global-utils/services/appConfig.service";
import { TranslateService } from 'ng2-translate/ng2-translate'
import { NotificationsService } from 'angular2-notifications'
import { CompassService } from './../../global-utils/services/compass.service';
import { PrintService } from '../../global-utils/services/print.service'
import { TemplateService } from '../../global-utils/services/template.service'
import * as FileSaver from "file-saver";
import { Subject, Observable} from 'rxjs/Rx'

//import {SimpleNotificationsModule, NotificationsService} from "angular2-notifications"

@Component({
  templateUrl: './allergen.component.html'
})
export class AllergenComponent {
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public sortField:string='';
  public sortOrder:number=1;
  public filterText: string = '';
  public searchBoxLabel: string;

  public allergens: any[];
  public allergenImage: string;

  public allergensLangs: any[] = [];

  public allergenTmp = {
    name: '',
    description: ''
  };
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
   }

  public imageObject;
  public redirectData;

  public editedAllergen: any[] = [];

  public allergenOnEdit: any;

  public forceRefresh = new EventEmitter();

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  
  
  public allergenCreateTitle:string;
  public allergenCreateContent: string;
  public allergenEditedTitle:string;
  public allergenEditedContent:string;
  public allergenDeletedTitle: string;
  public allergenDeletedContent: string;
  public numPages:number;
  public status;
  public upload = new Subject();

  

  constructor(public allergenService: AllergenService, public compassService: CompassService, public router: Router, public appConfig: AppConfig, public translate: TranslateService, public notification: NotificationsService, public printService: PrintService, public templateService: TemplateService) {

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
      //console.log('translation: '+ res);
    });

    this.translate.get('reports.allergens.notifications.allergenCreatedTitle').subscribe((res: string) => {
      this.allergenCreateTitle = res;
      //console.log('translation: '+ res);
    });
    this.translate.get('reports.allergens.notifications.allergenCreatedContent').subscribe((res: string) => {
      this.allergenCreateContent = res;
      //console.log('translation: '+ res);
    });
    this.translate.get('reports.allergens.notifications.allergenEditedTitle').subscribe((res: string) => {
      this.allergenEditedTitle = res;
      //console.log('translation: '+ res);
    });
    this.translate.get('reports.allergens.notifications.allergenEditedContent').subscribe((res: string) => {
      this.allergenEditedContent = res;
      //console.log('translation: '+ res);
    });
    this.translate.get('reports.allergens.notifications.allergenDeletedTitle').subscribe((res: string) => {
      this.allergenDeletedTitle = res;
      //console.log('translation: '+ res);
    });
    this.translate.get('reports.allergens.notifications.allergenDeletedContent').subscribe((res: string) => {
      this.allergenDeletedContent = res;
      //console.log('translation: '+ res);
    });
    
  }

  ngOnInit() {
    this.getAllergens();
    this.redirectData = this.compassService.getRedirectData();
  }

  public langObjRefreshed(e) {
    this.allergensLangs = e.langsObj;
  }

  public getAllergens() {
    //console.log('GetAllergens---> itemsPerPage:'+this.itemsPerPage+' currentPage:'+this.currentPage+' orderBy:'+this.orderBy+' filterText:',this.filterText);
    this.allergenService.getAllergens(
      this.itemsPerPage, 
      this.currentPage - 1, 
      this.sortField, 
      this.sortOrder, 
      this.filterText
      ).subscribe(
      (data: any) => {
        this.allergens = data.allergens;
        //console.log(this.allergens,'allergens')
        this.totalItems = data.totalElements;
        //console.log(this.totalItems,'totalItems')
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    );
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

  public saveAllergen() {
    if(this.status == 'new'){
        this.forceRefresh.emit(true);

        let allergenObj = {
          gallery: this.imageObject,
          lang: this.allergensLangs
        };
        this.allergenService.addAllergen(allergenObj).subscribe(
          (data) => {
            this.cleanFields();
            this.getAllergens();

            this.notification.success(this.allergenCreateTitle,this.allergenCreateContent);
          },
          (err) => {
            this.notification.error('Error', err || 'Server error');
          }
        );
           
      } else if(this.status == 'edit') {
        this.forceRefresh.emit(true);

        let allergenObj = {
          _id: this.allergenOnEdit._id,
          referenceNumber: this.allergenOnEdit.referenceNumber,
          gallery: this.allergenOnEdit.gallery,
          lang: this.allergensLangs
        };

        allergenObj.gallery = this.imageObject;

        this.allergenService.editAllergen(allergenObj).subscribe(
          (data) => {
            this.cleanFields();
            this.getAllergens();
            this.notification.success(this.allergenEditedTitle,this.allergenEditedContent);
          },
          (err) => {
           this.notification.error('Error', err || 'Server error');
          }
        )
             
      }    
  }

  // public prepareUploader(data) {
  //   //Añadimos el objeto a los datos de subida
  //   this.uploader.onBuildItemForm = (item, form) => {
  //     form.append("obj", JSON.stringify(data));
  //   };
  // }

  public selectAllergenToEdit(allergen) {
    this.imageObject = allergen.gallery
    this.allergenOnEdit = JSON.parse(JSON.stringify(allergen));
    
    this.allergenService.getLangsAllergen(allergen._id).subscribe(
      (data: any) => {
        this.editedAllergen = data.lang;
        console.log(this.editedAllergen, 'edited allergen')
        this.forceRefresh.emit(this.editedAllergen);
      }
    )
  }

  public deleteAllergen() {

    this.allergenService.deleteAllergen(this.allergenOnEdit._id).subscribe(
      (data) => {
        this.notification.success(this.allergenDeletedTitle,this.allergenDeletedContent);
        this.getAllergens();

      },
      (err) => {
       this.notification.error('Error', err || 'Server error');
      }
    )
  }

  public cleanFields(){
    this.allergenTmp = {
          name: '',
          description:''
        };
    if(this.imageObject) { this.imageObject=null;}
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.getAllergens();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.getAllergens();
  }

  public searchAllergens(value: string) {
    this.filterText = value;
    this.currentPage = 1;
    this.getAllergens();
    this.filterText = '';
  }

  public notificationDestroyed(e){
    if(e.type!="error"){
          this.router.navigate(['/libraries/allergen']);
        }
  }


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
       this.router.navigate(['./libraries/allergen']);
     }
  }

  public cleanAndResetFields(){

  }

  public deleteImage() {
    this.imageObject=null;
    this.allergenOnEdit.gallery=null;
    }
}

