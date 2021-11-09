/**
 * Created by odin on 4/08/16.
 */
import {Component, ViewContainerRef, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {PackFormatService} from "./pack-format.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import {AppConfig} from "../../global-utils/services/appConfig.service";
import { PrintService } from '../../global-utils/services/print.service'
import { TemplateService } from '../../global-utils/services/template.service'
import * as FileSaver from "file-saver";
import { NotificationsService } from 'angular2-notifications'
import { Subject, Observable} from 'rxjs/Rx'


@Component({
  templateUrl: './pack-format.component.html'
})
export class PackFormatComponent {
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;

  public packagings;

  public packagingsLangs: any[] = [];

  public packagingTmp = {
    name: '',
    description: ''
  };
  
  public editedPackaging: any[] = [];
  public numPages:number;

  public packaging:any;

  public forceRefresh = new EventEmitter();

  public imageObject;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public options = {
    position: ["top", "right"],
    timeOut: 1500,
    lastOnBottom: true
  }
  public packFormatCreatedTitle;
  public packFormatCreatedContent;
  public packFormatEditedTitle;
  public packFormatEditedContent;
  public packFormatDeletedTitle;
  public packFormatDeletedContent;
  public status;
  public upload = new Subject();


  constructor(
  		public packFormatService: PackFormatService, 
  		public translate: TranslateService, 
  		public appConfig: AppConfig, 
  		public printService : PrintService,
   		public templateService : TemplateService, 
   		public notification: NotificationsService, 
   		public router: Router
   ) {

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });
  }

  ngOnInit() {
    this.translation();
    this.getPackaging();
  }

  public translation(){

    this.translate.get('library.packformat.notifications.packFormatCrectedTitle').subscribe((res: string) => {
        this.packFormatCreatedTitle = res;
        //console.log('translation: '+ res);
      });

    this.translate.get('library.packformat.notifications.packFormatCreatedContent').subscribe((res: string) => {
        this.packFormatCreatedContent = res;
        //console.log('translation: '+ res);
      });

    this.translate.get('library.packformat.notifications.packFormatEditedTitle').subscribe((res: string) => {
        this.packFormatEditedTitle = res;
        //console.log('translation: '+ res);
      });

    this.translate.get('library.packformat.notifications.packFormatEditedContent').subscribe((res: string) => {
        this.packFormatEditedContent = res;
        //console.log('translation: '+ res);
      });

    this.translate.get('library.packformat.notifications.packFormatDeletedTitle').subscribe((res: string) => {
        this.packFormatDeletedTitle = res;
        //console.log('translation: '+ res);
      });

    this.translate.get('library.packformat.notifications.packFormatDeletedContent').subscribe((res: string) => {
        this.packFormatDeletedContent = res;
        //console.log('translation: '+ res);
      });
  }

   public langObjRefreshed(e) {
    this.packagingsLangs = e.langsObj;
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

  public getPackaging() {
    this.packFormatService.getPackagings(
      this.itemsPerPage, 
      this.currentPage-1, 
      this.sortField,
      this.sortOrder, 
      this.filterText
      ).subscribe(
      (data: any) => {
        this.packagings = data.packagings;
        this.totalItems = data.totalElements;
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    );
  }

  public savePackaging() {
    if(this.status == 'new'){
        this.forceRefresh.emit(true);

        let packagingObj = {
          lang: this.packagingsLangs,
          gallery: this.imageObject
        };
        this.packFormatService.addPackaging(packagingObj).subscribe(
          (data) => {
            this.cleanFields();
            this.getPackaging();
            this.notification.success(this.packFormatCreatedTitle,this.packFormatCreatedContent);
          },
          (err) => {
            this.notification.error('Error', err || 'Server error');
          }
        )     
      } else if(this.status == 'edit') {
        this.forceRefresh.emit(true);

        let packagingObj = {
          _id: this.packaging._id,
          gallery: this.imageObject,
          referenceNumber: this.packaging.referenceNumber,
          lang: this.packagingsLangs
        };           

        this.packFormatService.editPackaging(packagingObj).subscribe(
          (data) => {
            this.cleanFields();
            this.getPackaging();
            this.notification.success(this.packFormatEditedTitle,this.packFormatEditedContent);
          },
          (err) => {
            this.notification.error('Error', err || 'Server error');
          })      
      }    
  }

  public selectPackagingToEdit(packaging) {
    this.imageObject = packaging.gallery;
    this.packaging = JSON.parse(JSON.stringify(packaging));
    this.packFormatService.getLangsPackaging(packaging._id).subscribe(
      (data:any) => {
        this.editedPackaging= data.lang;
        this.forceRefresh.emit(this.editedPackaging);
      }
    )
  }

  public deletePackaging(_id) {
    this.packFormatService.deletePackaging(_id).subscribe(
      (data) => {
        this.getPackaging();
        this.notification.success(this.packFormatDeletedTitle,this.packFormatDeletedContent);
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');

      }
    )
  }

  public deleteImage() {}

  public cleanFields() {
    this.packagingTmp = {
      name: '',
      description: ''
    };
    if (this.imageObject) {
      this.imageObject = null;
    }
  }

   public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.getPackaging();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.getPackaging();
  }

  public searchPackagings(value: string){
    this.filterText=value;
    this.currentPage=1;
    this.getPackaging();
    this.filterText='';
  }
  
  public notificationDestroyed(e){
    if(e.type!="error"){
          this.router.navigate(['/libraries/packformat']);
        }
  }
}

