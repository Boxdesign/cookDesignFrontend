import { Component, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LocationService } from "../../services/location.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications'

@Component({
  selector: 'location-cost-filter',
  templateUrl: './location-cost-filter.component.html',
  styleUrls: ['./location-cost-filter.component.scss'],
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
export class LocationCostFilterComponent implements OnInit {

  @Output() onLocationChecked: EventEmitter<any>;
  @Input() savedLocation;
	public allLocations;
  public expanded: boolean;
  public checked: boolean;
  public selectedLocation;
  public previousLocation;
  public locationsChecked;
  public notificationOptions = {
       timeOut: 1500,
      position: ["top", "right"]
    }
    
  constructor(public locationService: LocationService,  public translate: TranslateService, public notification: NotificationsService) { 
    this.onLocationChecked = new EventEmitter();
  }

  ngOnInit() {
  	this.getUserLocations();
  }

  public getUserLocations() {
    this.locationService.getUserLocations().subscribe(
      (data: any)=> {
        this.allLocations = data;
        this.expandTree();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public expandTree(){
    this.allLocations.forEach((organization, index) => {
      organization.expanded=true;
      organization.companies.forEach((company, index) => {
        company.expanded=true;
        company.businessUnits.forEach((businessUnit, index) => {
          businessUnit.expanded=true;
        });
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur  = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      if (propName == 'savedLocation' && cur!=prev){
        this.clearChecks();
        this.checkSavedLocation();
      }
     }
  }  

  public clearChecks(){
    if(this.allLocations) {
      this.allLocations.find((organization, index) => {
        organization.checked=false;
        organization.companies.find((company, index) => {
          company.checked=false;
          company.businessUnits.find((businessUnit, index) => {
            businessUnit.checked=false;
          });
        });
      });
    }
  }

  public checkSavedLocation(){
    //console.log('check locations');
    if(this.savedLocation && this.allLocations) {
      this.allLocations.find((organization, index) => {
        if(organization._id==this.savedLocation) organization.checked=true;
        organization.companies.find((company, index) => {
          if(company._id==this.savedLocation) company.checked=true;
          company.businessUnits.find((businessUnit, index) => {
            if(businessUnit._id==this.savedLocation) businessUnit.checked=true;
          });
        });
      });
    }
    this.locationsChecked=true;
  }


  public onClick(event, organization, company, businessUnit){

    this.uncheckPreviousLocation();

    //Adds or removes the location and its upper path when user clicks on a location. As a result, there can be duplicates in the location
    //list but this does not impact the location check in the API.
    if(organization&&company&&businessUnit) {
      //Clicked on a businessUnit
      if (!businessUnit.checked) {
        this.selectedLocation = businessUnit._id;
        this.previousLocation = businessUnit;
      }
      
    } else
    {
      //Clicked on a company
      if(organization&&company) {
        if (!company.checked) { 
          this.selectedLocation = company._id;
          this.previousLocation = company;
        }
        
      } else {
        //Clicked on an organization
        if (!organization.checked){
          this.selectedLocation = organization._id;
          this.previousLocation = organization;

        } 
      }
    }
    this.onLocationChecked.emit(this.selectedLocation);
  }

  public uncheckPreviousLocation() {
    if(this.previousLocation) this.previousLocation.checked=false;
  }

}
