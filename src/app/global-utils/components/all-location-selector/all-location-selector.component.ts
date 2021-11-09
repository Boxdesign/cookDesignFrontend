import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LocationService } from "../../services/location.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications'

@Component({
  selector: 'all-location-selector',
  templateUrl: './all-location-selector.component.html',
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
export class AllLocationSelectorComponent implements OnChanges {
  @Input() locations;
//   [
//   {
//     "_id": "57e53fabf9475a721f6e2c6f",
//     "name": "Expo Hoteles",
//     "active": false,
//     "companies": [
//       {
//         "_id": "57e5573f87ae842825ae6d1f",
//         "name": "Mare Nostrum",
//         "active": true,
//         "businessUnits": [
//           {
//             "_id": "57e5578487ae842825ae6d20",
//             "name": "Windsor Restaurant",
//             "active": true
//           },
//           {
//             "_id": "57e5579f87ae842825ae6d21",
//             "name": "Cleopatra Palace Restaurant",
//             "active": true
//           },
//           {
//             "_id": "57e557b687ae842825ae6d22",
//             "name": "La Palapa Beach Club",
//             "active": true
//           }
//         ]
//       },
//       {
//         "_id": "57e544857a399ab92067f2e2",
//         "name": "Princesa Sofia",
//         "active": false,
//         "businessUnits": [
//           {
//             "_id": "57e54e557a399ab92067f2e5",
//             "name": "Restaurante Gastro",
//             "active": true
//           }
//         ]
//       }
//     ]
//   }
// ]
  @Input() editMode: boolean;
  @Input() savedLocations; //resource (subproduct, recipe, etc) locations. Array of location _ids.
  @Output() onLocationChecked: EventEmitter<any>;
  public expanded: boolean;
  public checked: boolean;
  public selectedLocations = [];
  public allLocations;
  public notificationOptions = {
       timeOut: 1500,
      position: ["top", "right"]
    }

  constructor(public locationService: LocationService, public translate: TranslateService, public notification: NotificationsService){
    this.onLocationChecked = new EventEmitter();
  }

  ngOnInit(){
    if(this.savedLocations) this.selectedLocations=this.savedLocations;
    this.getAllLocations();
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

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur  = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      if (propName == 'savedLocations' && cur!=prev){
        this.clearChecks();
        this.checkSavedLocations();
        this.selectedLocations=this.savedLocations;
      }
    }
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
  }


  public uniq(a) { //remove duplicate items from array
    var seen = {};
    return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }
}
