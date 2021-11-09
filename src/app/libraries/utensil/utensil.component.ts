/**
 * Created by odin on 4/08/16.
 */
import {Component, ViewContainerRef, EventEmitter} from '@angular/core';
import { NotificationsService } from 'angular2-notifications'
import {ActivatedRoute} from '@angular/router';
import {UtensilService} from "./utensil.service";
import {AppConfig} from "../../global-utils/services/appConfig.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import {FamilyService} from "../../libraries/family/family.service";
import {Utensil} from '../../global-utils/models/utensil.model'
import { Subject, Observable} from 'rxjs/Rx'

@Component({
  templateUrl: './utensil.component.html',
})
export class UtensilComponent {
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public orderBy: string = '';
  public filterText: string = '';
  public searchBoxLabel: string;
  public numPages:number;
  public sortField:string='';
  public sortOrder:number=1;

  public utensils;
  public families;
  public subfamilies;

  public utensilsLangs: any[] = [];

  public utensilTmp = {
    name: '',
    accessories: ''
  };

  public imageObject;

  public utensil: any;

  public forceRefresh = new EventEmitter();
  public forceRefreshForEdit = new EventEmitter();

  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }
  public externalFamilies;
  public externalFamily;
  public crockery
  public resource
  public uten
  public noExternalFamily
  public utensilCreatedTitle
  public utensilCreatedContent
  public utensilEditedTitle
  public utensilEditedContent
  public utensilDeletedTitle
  public utensilDeletedContent
  public status
  public externalSubfamilies
  public upload = new Subject();


  constructor(public utensilService: UtensilService, public appConfig: AppConfig, public translate: TranslateService, public familyService: FamilyService, public notification : NotificationsService) {

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });
  }

  ngOnInit() {
    this.translation();
    this.getUtensil();
    this.getFamilies();
    this.getExternalFamilies();    
  }

  public translation(){

    this.translate.get('library.utensil.crockery').subscribe((res: string) => {
      this.crockery = res;
      //console.log(this.crockery,'crockery')

      this.translate.get('library.utensil.resource').subscribe((res: string) => {
        this.resource = res;
        //console.log(this.resource,'resource')

        this.translate.get('library.utensil.uten').subscribe((res: string) => {
          this.uten = res;
          //console.log(this.uten,'uten')

          this.translate.get('library.utensil.noExternalFamily').subscribe((res:string)=>{
            
            this.noExternalFamily = res;

          })

        });

      });

    });

    this.translate.get('library.utensil.notifications.utensilCreatedTitle').subscribe((res:string)=>{
      this.utensilCreatedTitle = res
    })
    
    this.translate.get('library.utensil.notifications.utensilCreatedContent').subscribe((res:string)=>{
      this.utensilCreatedContent = res
    })

    this.translate.get('library.utensil.notifications.utensilEditedTitle').subscribe((res:string)=>{
      this.utensilEditedTitle = res
    })

    this.translate.get('library.utensil.notifications.utensilEditedContent').subscribe((res:string)=>{
      this.utensilEditedContent = res
    })

    this.translate.get('library.utensil.notifications.utensilDeletedTitle').subscribe((res:string)=>{
      this.utensilDeletedTitle = res
    })

    this.translate.get('library.utensil.notifications.utensilDeletedContent').subscribe((res:string)=>{
      this.utensilDeletedContent = res
    })
  }
  public uploadImage(){
    //When saving, first send a notification to the crop and upload component to upload the image.
    this.upload.next(true);
  }

  public langObjRefreshed(e) {
    this.utensilsLangs = e.langsObj;
  }

  public getUtensil() {

    this.utensilService.getUtensil(this.itemsPerPage, this.currentPage - 1, this.sortField, this.sortOrder, this.filterText).subscribe(
      (data: any) => {
        this.utensils = data.utensils;
        console.log('utensils', this.utensils);
        this.totalItems = data.totalElements;
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    );
  }

  public getFamilies() {
    this.familyService.getFamily('utensil', 10000000, 0, '', '', '').subscribe(
      (data: any) => {
        this.families = data.families;
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    )
  }

	public getExternalFamilies() {
    this.familyService.getFamily('utensil', 10000000, 0, '', '', '', true).subscribe(
      (data: any) => {
        this.externalFamilies = data.families;
        console.log(this.externalFamilies,'externalFamilies')
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    )
  }

  // public fileSelected(e) {
  //   //Cargamos el archivo
  //   this.uploader.uploadAll();
  // }
  public addClick(){

    this.utensil = new Utensil();
    this.status = 'new';
    this.cleanFields();
  }

  public editClick(){
    this.status = 'edit';
  }

  public viewClick(){
    this.status = 'view'
  }


  public saveUtensil() {

  	if(this.utensil.family._id == null) this.utensil.family = null;
  	if(this.utensil.externalFamily._id == null) this.utensil.externalFamily = null;

    if(this.status == 'new'){

      this.forceRefresh.emit(true);
      //console.log(this.utensilFamilies,'utensilFamnilies')
      this.utensil.gallery = this.imageObject
      this.utensil.lang = this.utensilsLangs

      this.utensilService.addUtensil(this.utensil).subscribe(
        (data) => {
          this.cleanFields();
          this.getUtensil();
          //this.externalFamily = ''
          this.notification.success(this.utensilCreatedTitle,this.utensilCreatedContent);
        },
        (err) => {
          this.notification.error('Error', err || 'Server Error');
        })

      } else {

        this.forceRefresh.emit(true);

        this.utensil.lang = this.utensilsLangs
        this.utensil.gallery = this.imageObject

        this.utensilService.editUtensil(this.utensil).subscribe(

          (data) => {
            this.cleanFields();
            this.getUtensil();
            //this.externalFamily = '';
            this.notification.success(this.utensilEditedTitle,this.utensilEditedContent);
          },
          (err) => {
            this.notification.error('Error', err || 'Server Error');
          })

      }
    
  }

  public selectUtensilToEdit(utensil) {

    this.imageObject = utensil.gallery;    
    this.utensil = JSON.parse(JSON.stringify(utensil));

    if(!this.utensil.family) this.utensil.family = {_id: null}
    if(!this.utensil.externalFamily) this.utensil.externalFamily = {_id: null}

		this.subfamilies = [];

    this.families.forEach((family, i) => {

      if (family._id == this.utensil.family._id) {
        this.subfamilies = this.families[i].subfamilies;
      }
    });

    this.externalSubfamilies =[];
    
    this.externalFamilies.forEach((externalFamily, i) => {

      if (externalFamily._id == this.utensil.externalFamily._id) {
        this.externalSubfamilies = this.externalFamilies[i].subfamilies;
      }
    });

    this.utensilService.getLangsUtensil(this.utensil._id).subscribe(
      (data: any) => {
        this.utensilsLangs = data.lang;
        this.forceRefresh.emit(this.utensilsLangs);
      }
    )
  }

  public deleteUtensil(_id, confirm) {

    this.utensilService.deleteUtensil(_id).subscribe(
      (data) => {
        this.notification.success(this.utensilDeletedTitle,this.utensilDeletedContent);
        this.getUtensil();
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');

      }
    )
  }

  public cleanFields() {
    
    this.utensilTmp = {
      name: '',
      accessories: ''
    };

    if (this.imageObject) {
      this.imageObject = null;
    }

    this.utensil = new Utensil();

  }

  public familySelected(id) {

  	if(id == "null") { 
  		this.utensil.family = {_id: null};
  		this.subfamilies = []; 
  	}
  	else 
  	{
  		let family = this.families.filter((fam) => { return fam._id == id})
  		if(family && family.length)
  				this.subfamilies = family[0].subfamilies;
  		else
  			 this.subfamilies = []
  	}
  }

  public subFamilySelected(id) {

  	if(id=="null")
			this.utensil.subfamily=null;
		else 
			this.utensil.subfamily=id;
    //console.log(this.utensil.subfamily,'uteSubfamily')
  }

  public externalFamilySelected(id) {

  	if(id == "null") { 
  		this.utensil.externalFamily = {_id: null};
  		this.externalSubfamilies = []; 
  	}
  	else 
  	{
  		let externalFamily = this.externalFamilies.filter((extFam) => { return extFam._id == id})
  		if(externalFamily && externalFamily.length)
  				this.externalSubfamilies = externalFamily[0].subfamilies;
  		else
  			 this.externalSubfamilies = []
  	}
  }

  public externalSubFamilySelected(id) {

  	if(id=="null")
			this.utensil.externalSubfamily=null;
		else 
			this.utensil.externalSubfamily=id;
    //console.log(this.utensil.subfamily,'uteSubfamily')
  }  

  public deleteImage() {}

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.getUtensil();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.getUtensil();
  }

  public searchUtensils(value: string) {
    this.filterText = value;
    this.currentPage = 1;
    this.getUtensil();
    this.filterText = '';
  }

  sortColumn(e, column: string) {
    this.filterText = '';
    this.orderBy = e + 'lang.' + column;
    //console.log(this.orderBy);
    this.getUtensil();
  }
}
