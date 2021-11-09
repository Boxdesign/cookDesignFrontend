import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LocationService } from "../../services/location.service";
import { NotificationsService } from 'angular2-notifications'

@Component({
  selector: 'location-view',
  templateUrl: './location-view.template.html',
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
export class LocationViewComponent {
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
  @Input() savedLocations; //resource (subproduct, recipe, etc) locations. Array of location _ids.
  public userLocations;
  public locationsChecked=false;
  public notificationOptions = {
       timeOut: 1500,
      position: ["top", "right"]
    }
    
  constructor(public locationService: LocationService, public notification: NotificationsService){
  }

  ngOnInit(){
    this.getUserLocations();
  }

  public clearChecks(){
    if(this.savedLocations && this.userLocations) {
     this.userLocations.find((organization, index) => {
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

  public getUserLocations() {
    this.locationService.getUserLocations().subscribe(
      (data: any)=> {
        this.userLocations = data;
        this.checkSavedLocations();
      },
      (err) => {
       this.notification.error('Error', err || 'Server error');
      })
  }

  public checkSavedLocations(){
    //console.log('check locations');
    if(this.savedLocations && this.userLocations) {
     this.userLocations.find((organization, index) => {
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