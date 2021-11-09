import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { LocationService } from "../../services/location.service";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'location-provider',
  templateUrl: './location-provider.component.html',
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
export class LocationProviderComponent {
  @Input() article;
  @Input() editMode: boolean;
  @Input() expandedTree: boolean = false;
  @Input() refresh = new Subject();
  @Output() onLocationChecked: EventEmitter<any>;
  public checked: boolean;
  public selectedLocations = [];
  //public userLocations;
  public providerLocations;
  public clone = require('clone')
  public savedLocations;

  public notificationOptions = {
       timeOut: 1500,
      position: ["top", "right"]
    }

  constructor(public locationService: LocationService, public notification: NotificationsService){
    this.onLocationChecked = new EventEmitter();
  }

  ngOnInit(){
    this.savedLocations = this.article.location;
    this.selectedLocations=this.savedLocations

    this.getProviderLocations();

    this.refresh.subscribe((data:any) => {
        this.savedLocations=[];
        this.savedLocations = this.savedLocations.concat(data) 
        this.selectedLocations=[];
        this.selectedLocations = this.selectedLocations.concat(data)       
        this.clearChecks();
        this.checkSavedLocations();
    })
  }

  public getProviderLocations() {

    this.locationService.getProviderLocations(this.article.provider._id).subscribe(
      (data: any)=> {
        this.providerLocations = data;
        this.checkSavedLocations();
        if(this.expandedTree) this.expandTree();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public expandTree(){
    this.providerLocations.forEach((organization, index) => {
      organization.expanded=true;
      organization.companies.forEach((company, index) => {
        company.expanded=true;
        company.businessUnits.forEach((businessUnit, index) => {
          businessUnit.expanded=true;
        });
      });
    });
  }

  public clearChecks(){
    if(this.providerLocations) {
      this.providerLocations.find((organization, index) => {
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


  public checkSavedLocations(){
    if(this.savedLocations && this.providerLocations) {
     this.providerLocations.find((organization, index) => {
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
  }

  public onClick(event, organization, company, businessUnit){
    //Adds or removes the location and its upper path when user clicks on a location. As a result, there can be duplicates in the location
    //list but this does not impact the location check in the API.
    if(organization&&company&&businessUnit) {
      //Clicked on a businessUnit
      if (!businessUnit.checked) {
        this.selectedLocations.push(businessUnit._id);
      }
      else { 
        //un-checked business unit. Remove business unit from the list.
        //remove bu id from list
        var index = this.selectedLocations.indexOf(businessUnit._id);
        if (index > -1) { this.selectedLocations.splice(index, 1); }
        } 
    } else
    {
      //Clicked on a company
      if(organization&&company) {
          if (!company.checked) { 
            this.selectedLocations.push(company._id);
          }
          else { 
            //un-checked company
            //A company can only be unchecked if none of its business units are checked
            //remove co id from list
            var index = this.selectedLocations.indexOf(company._id);
            if (index > -1) { this.selectedLocations.splice(index, 1); }
          }
      } else {
          //Clicked on an organization
          if (!organization.checked){
           this.selectedLocations.push(organization._id);
         } else {
          var index = this.selectedLocations.indexOf(organization._id);
          if (index > -1) { this.selectedLocations.splice(index, 1); }
         }
        //organization.checked? organization.checked=false: organization.checked=true;
      }
    }
    this.onLocationChecked.emit(this.selectedLocations);
  }

  public uniq(a) { //remove duplicate items from array
    var seen = {};
    return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }
}