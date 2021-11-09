import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { LocationService } from "../../../global-utils/services/location.service";
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { AppConfig } from '../../../global-utils/services/appConfig.service';
import { GalleryService } from '../../../global-utils/services/gallery.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Subject, Observable} from 'rxjs/Rx'


@Component({
  selector: 'location-tree',
  templateUrl: './location-tree.component.html',
  styleUrls: ['./location-tree.component.scss']
})
export class LocationTreeComponent implements OnInit {

  public forceRefresh = new EventEmitter();
	public userLocations;
	public mode;
	public name;
	public addOrganization = false;
	public canAddOrganization = false;
	public id;
  public account;
  public user;

	public options = {
    timeOut: 1500,
    position: ["top", "right"]
  }

  public imageObject;
  public location;
  public lang = {
     description: ''
   };
  public timeOut;
  public updatedLang;
  public locationTitle;
  public locationContent;
  public status;
  public upload = new Subject();
  public languages = [];
  public cropperOptions = {aspectRatio: 1.5}

  constructor(
  	public locationService: LocationService, 
  	public route: ActivatedRoute, 
  	public router: Router,
  	public notification: NotificationsService, 
  	public appConfig: AppConfig, 
  	public translate: TranslateService, 
  	public galleryService: GalleryService
  ) { 
  }

  ngOnInit() {
    this.getUserLocations();
    this.translation();
    this.getLanguages();
  }

  public translation(){ 

    this.translate.get('admin.location.locationTitle').subscribe((res: string) => {
      this.locationTitle = res;
    });

    this.translate.get('admin.location.locationContent').subscribe((res: string) => {
      this.locationContent = res;
    });
  }

  public langObjRefreshed(e) {
    //Don't ask why this has to be commented. Fact of the matter is otherwise it doesn't work.
    this.updatedLang = e.langsObj;
  }

  public getUserLocations() {
    this.locationService.getUserLocations().subscribe(
      (data: any)=> {
        this.userLocations = data;
        if(this.userLocations.length==0) this.canAddOrganization=true;
        this.expandTree()
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public expandTree(){
  	 this.userLocations.forEach((organization, index) => {
       organization.expanded=true;
       organization.companies.forEach((company, index) => {
					company.expanded=true;
         	company.businessUnits.forEach((businessUnit, index) => {
            businessUnit.expanded=true;
         });
       });
     });
  } 


  public selectLocation(location){
    
  	this.id=location._id;
  	this.name=location.name;
    this.location = JSON.parse(JSON.stringify(location)); //COPY WITHOUT REFERENCE

    this.locationService.getLangsLocation(this.id).subscribe(
      (data: any) => {

      	let langObject = data.lang;
      	if(!langObject.length){
      		langObject =[{langCode:'es', description:''}]
      	}       
        this.forceRefresh.emit(langObject);
      }
    )

    if(location.gallery){
      this.galleryService.getGallery(location.gallery).subscribe((gallery) => {
        this.location.gallery = gallery;
        this.imageObject = gallery;
      })
    }   
    else
   	{
	    this.imageObject = null;
   	}  
  }

  public saveLocation() {
   this.forceRefresh.emit(true);
   this.location.lang = this.updatedLang;
   this.location.gallery = this.imageObject;

    this.locationService.editLocation(this.location).subscribe(
      (data: any)=> {
        this.getUserLocations();
        this.notification.success(this.locationTitle, this.locationContent);

		    this.locationService.getLangsLocation(this.id).subscribe(
		      (data: any) => {

		      	let langObject = data.lang;
		      	if(!langObject.length){
		      		langObject =[{langCode:'es', description:''}]
		      	}       
		        this.forceRefresh.emit(langObject);
		      }
		    )
      },
      (err) => {
        this.status = 'view'
        this.notification.error('Error', err || 'Server error');
      })
  }

  public addLocation(type, organization, company){
  	this.forceRefresh.emit(this.lang);

  	let data = {
  		"name" : this.name,
  		"location_type" : type,
  		"parent_company" : company?  company._id : null,
  		"parent_organization" : organization? organization._id : null
  	}

  	this.name =''; //reset name
  	this.locationService.addLocation(data).subscribe(
      (data: any)=> {
      	this.getUserLocations();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })  	
  }

  public deleteLocation(){
  	this.locationService.deleteLocation(this.id).subscribe(
      (data: any)=> {
      	this.getUserLocations();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public cleanFields(){
  	this.lang.description = ''
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

  public getLanguages() {
    this.languages.length || this.appConfig.fetchAppLanguages().subscribe(
      (data) => {
        this.languages = data.languages;
        console.log(this.languages, 'languages')
      }
    );
  }
}
