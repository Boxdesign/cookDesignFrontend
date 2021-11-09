import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LocationService } from "../../services/location.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications'

@Component({
  selector: 'all-location-view',
  templateUrl: './all-location-view.component.html',
  styles: [`
  .location-selector {
    width: 100%;
    border: 1px solid rgba(161, 162, 4, 0.31);
    font-weight: 400;
    font-family: "Lato" !important;
    color: #606051;
    background: rgba(255, 255, 255, 0.64);
    padding: 12px;
    font-size: 14px;
  }
  .li-selector {
    margin-top: 5px;
  }
  input[type='checkbox'] {
    width:15px;
    height:15px;
  }
  `]
 })
export class AllLocationViewComponent implements OnChanges {

	 @Input() savedLocations; //resource (subproduct, recipe, etc) locations. Array of location _ids.
  public allLocations;
  public locationsChecked=false;
  public notificationOptions = {
       timeOut: 1500,
      position: ["top", "right"]
    }

  constructor(public locationService: LocationService, public translate: TranslateService, public notification: NotificationsService){
  }

  ngOnInit() {
	    this.getAllLocations();
  }

  ngOnChanges(changes: SimpleChanges) {
	  for (let propName in changes) {
	    let chng = changes[propName];
	    let cur  = JSON.stringify(chng.currentValue);
	    let prev = JSON.stringify(chng.previousValue);
	    if (propName == 'savedLocations' && cur!=prev){
	    	this.clearChecks();
        this.checkSavedLocations();
	    }
		 }
	}

	public getAllLocations() {
    this.locationService.getAllLocations().subscribe(
      (data: any)=> {
        this.allLocations = data;
        this.checkSavedLocations();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public clearChecks(){
  	if(this.savedLocations && this.allLocations) {
     this.allLocations.find((organization, index) => {
       for (var i=0; i < this.savedLocations.length; i++){
         organization.checked=false;
         organization.expanded=false;
       }
       organization.companies.find((company, index) => {
         for (var i=0; i < this.savedLocations.length; i++){
           company.checked=false;
           company.expanded=false;
         }
         company.businessUnits.find((businessUnit, index) => {
         for (var i=0; i < this.savedLocations.length; i++){
           businessUnit.checked=false;
           businessUnit.expanded=false;
         }
         });
       });
     });
    }
  }

  public checkSavedLocations(){
    if(this.savedLocations && this.allLocations) {
     this.allLocations.find((organization, index) => {
       for (var i=0; i < this.savedLocations.length; i++){
         if(organization._id==this.savedLocations[i]) organization.checked=true;
       }
       organization.companies.find((company, index) => {
         for (var i=0; i < this.savedLocations.length; i++){
           if(company._id==this.savedLocations[i]) company.checked=true;
         }
         company.businessUnits.find((businessUnit, index) => {
         for (var i=0; i < this.savedLocations.length; i++){
           if(businessUnit._id==this.savedLocations[i]) businessUnit.checked=true;
         }
         });
       });
     });
    }
    this.locationsChecked=true;
  }
}
