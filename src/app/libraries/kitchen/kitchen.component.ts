import {Component, Input, ViewContainerRef, EventEmitter} from '@angular/core';
import {KitchenService} from "./kitchen.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../global-utils/services/appConfig.service";
import { ActivatedRoute, Router } from '@angular/router';
import { PrintService } from '../../global-utils/services/print.service'
import { TemplateService } from '../../global-utils/services/template.service'
import { Kitchen } from '../../global-utils/models/kitchen.model';
import { WorkRoom } from '../../global-utils/models/workRoom.model';
import { LocationService } from "../../global-utils/services/location.service";
import { Subject } from 'rxjs'
import { CostFilterService } from "../../global-utils/services/cost-filter.service";

@Component({
  selector: 'kitchen-table',
  templateUrl: './kitchen.component.html',
})
export class KitchenComponent {
  public totalItems: number;
  @Input() public kitchenCategory;
  @Input() public title;
  @Input() public workRoomsEnabled;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public orderBy: string = '';
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public kitchenExternalCode;  
  public workRoomExternalCode;
  public workRoom;
  public kitchen;
  public status;

  public kitchens: Kitchen[];
  public kitchensLangs: any[] = [];
  public workRoomsLangs: any[] = [];

  public kitchenTmp = {
    name: '',
    description: ''
  };

  public workRoomTmp = {
    name: '',
    description: ''
  };

  public editedKitchen: any[] = [];
  public editedWorkRoom: any[] = [];

  public kitchenOnEdit: any;
  public workRoomIndex: any;
  public workRoomLength: number;

  public forceKitchenRefresh = new EventEmitter();
  public type
  public forceWorkRoomRefresh = new EventEmitter();
  public numPages:number;
  public loading:boolean = true;
  public updating:boolean = false;
  public templateId = null;
  public templateList;
  public filterKitchen;
  public userLocations;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }

  public fold = new Subject();
  public observerLocation;
  public filterLocations = [];

  constructor(
  	public kitchenService: KitchenService, 
  	public translate: TranslateService,
  	public printService: PrintService, 
  	public templateService: TemplateService, 
  	public notification : NotificationsService,
  	public locationService: LocationService,
    public costFilterService: CostFilterService, 
  ){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
      ////console.log('translation: '+ res);
    });
  }

  ngOnInit() {

    this.currentPage = this.kitchenService.getCurrentPage();
    this.itemsPerPage=this.kitchenService.getItemsPerPage();
    this.filterText = this.kitchenService.getSearchFilter();

    this.loading = true;
    this.updating = false;
    this.type = 'kitchen';
    this.getKitchens();

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
      	this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.currentPage = this.kitchenService.getCurrentPage();
        this.itemsPerPage = this.kitchenService.getItemsPerPage();
        this.filterText = this.kitchenService.getSearchFilter();         
        this.getKitchens();
    })
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
	}

  public kitchensLangObjRefreshed(e) {
    //Method invoked whenever the 'true' event is emmitted by forceKitchenRefresh or forceKitchenRefresh. The lang-tab receives this event, refreshes
    //the LabObj with the data in the form and in turn emits a langsObj output which is captured by this method.
    this.kitchensLangs = e.langsObj;
  }

  public workRoomsLangObjRefreshed(e) {
    //Method invoked whenever the 'true' event is emmitted by forceWorkRoomRefresh or forceWorkRoomRefreshForEdit. The lang-tab receives this event and in turn
    //emits a langsObj which is captured by this method.
    this.workRoomsLangs = e.langsObj;
  }

  public getKitchens() {
    this.updating=true;
    this.kitchenService.getKitchens(
     // this.kitchenCategory, 
      this.itemsPerPage, 
      this.currentPage - 1, 
      this.filterText,
      this.sortField,
      this.sortOrder,
      this.filterLocations
    ).subscribe(
      (data: any) => {
        this.kitchens = data.kitchens;
        //console.log(this.kitchens, 'kitchens');
        this.totalItems = data.totalElements;
        this.loading = false;
        this.updating = false;
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');      
      });
  }

  public addKitchenClick() {
    this.kitchenTmp.name = "";
    this.kitchenTmp.description = "";
    this.kitchen = new Kitchen();
    this.fold.next(true)
  }

  public updateSelectedLocations(e) {
    this.kitchen.location=e;
  }

  public saveKitchen() {
    //Force a refresh to make sure kitchensLangs object contains the inputs entered in the new kitchen form for all languages.
    //Emitting a forceKitchenRefresh updates the kitchensLangs object via the lang-tab component.
    this.forceKitchenRefresh.emit(true);
    this.kitchen.lang = this.kitchensLangs;

    //console.log(this.kitchen, 'saveKitchen')
    //Create a new kitchens object called processObj that contains the the lang array and the kitchen category.
    if (this.status=='new') {
      this.kitchen.category = this.kitchenCategory; 
      this.kitchenService.addKitchen(this.kitchen).subscribe(
      (data) => {
        this.getKitchens();
        this.notification.success("Cocina creada","Cocina creada correctamente");
        this.kitchenTmp = {
          name: '',
          description: ''
        };
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    )
    }
      
    if (this.status=='edit') {
      this.kitchenService.editKitchen(this.kitchen).subscribe(
      (data) => {
        this.getKitchens();
        this.notification.success("Cocina editada","Cocina editada correctamente");
        this.kitchenTmp = {
          name: '',
          description: ''
        };
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    )
    }    
  }
  

  public selectKitchenToEdit(kitchen) {
    //Get the reference for the kitchen on edit.
    this.kitchen = JSON.parse(JSON.stringify(kitchen));
    this.fold.next(true)
    //The kitchen object only has one language in the lang array because getKitchens restricts the lang filelds to the current language. We need to show
    //in the form all the languages existing for that kitchen. The method getLangsKitchen obtains the lang array (with all the languages) for the selected
    //kitchen and forces a refresh so that the result is pushed to the view via kitchenTmp
    this.kitchenService.getLangsKitchen(kitchen._id).subscribe(
      (data: any) => {
        this.editedKitchen = data.lang;
        this.forceKitchenRefresh.emit(this.editedKitchen);
      }
    )
    //console.log(this.kitchen, 'selectKitchen')
  }


  public deleteKitchen(_id,confirm) {
    this.kitchenService.deleteKitchen(_id).subscribe(
      (data) => {
        this.getKitchens();
        this.notification.success("Cocina eliminada","Cocina eliminada correctamente");
      },
      (err) => {
       this.notification.error('Error', err || 'Server Error');
      }
    )
  }

  public addWorkRoomClick() {
    //this.kitchen.workRooms = new workRoom;
    this.workRoom = new WorkRoom;   
    //this.kitchen.workRooms[length].referenceNumber = "";
    this.workRoomTmp.name = "";
    this.workRoomTmp.description = "";
  }

  public saveWorkRoom() {
    //Adding a workRoom is done by updating the kitchen object being edited with the new workRoom name fields and invoking the editKitchen method of the API.

    //Force a refresh to make sure the workRoomsLangs object contains the inputs entered in the form for all languages. Emitting a forceWorkRoomRefresh
    //updates the workRoomsLangs object via the lang-tab component.
    //console.log(this.workRoom, 'saveworkRoom1')
    this.forceWorkRoomRefresh.emit(true);

    //Update the current kitchen and send it to the API
    if (this.status=='newWR') {
      this.workRoom.lang = this.workRoomsLangs;
      //console.log(this.workRoom, 'workRoom')
      let object = {
        _id: this.kitchen._id,
        workRoom: this.workRoom
      }
      this.kitchenService.addWorkRoom(object).subscribe(
      (data) => {
        //console.log(data, 'data')
        this.getKitchens();
        this.notification.success("Sala de trabajo añadida", "Sala de trabajo añadida correctamente");
        this.workRoomTmp = {
          name: '',
          description: ''
        };
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      })
    }

    else if (this.status=='editWR') {
       this.workRoom.lang = this.workRoomsLangs;
       //console.log(this.workRoom, 'workRoom')
       this.kitchenService.editWorkRoom(this.workRoom).subscribe(
        (data) => {
          this.getKitchens();
          this.notification.success("Sala de trabajo editada", "Sala de trabajo editada correctamente");
          this.kitchenTmp = {
            name: '',
            description: ''
          };
        },
        (err) => {
         this.notification.error('Error', err || 'Server Error');
        })
     }
    //console.log(this.workRoom, 'saveworkRoom2')
  }


  public selectWorkRoomToEdit(kitchen, workRoom, index) {
    //The kitchen object only has one language in the workRooms lang array because getKitchens restricts the lang fields to the current language. We need to show
    //in the form all the languages existing for that workRoom. The method getLangsWorkRoom obtains the lang array (with all the languages) for the selected
    //workRoom and forces a refresh so that the result is pushed to the view via lang-tab and kitchenTmp
    this.kitchen = JSON.parse(JSON.stringify(kitchen));
    this.workRoom = JSON.parse(JSON.stringify(workRoom));
    this.workRoomIndex = index;
      
    this.kitchenService.getLangsWorkRoom(workRoom._id).subscribe(
      (data: any) => {
        this.forceWorkRoomRefresh.emit(data.lang);
      }
    )
    //console.log(this.workRoom, 'selectsub')
  }

  

  public deleteWorkRoom(_id) {
    //Deleting a workRoom is done by invoking the deleteSubkitchen method of the API.

    this.kitchenService.deleteWorkRoom(_id).subscribe(
      (data) => {
        this.getKitchens();
        this.notification.success("Sala de trabajo eliminada", "Sala de trabajo eliminada correctamente");
        this.kitchenTmp = {
          name: '',
          description: ''
        };
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    );


    this.getKitchens();
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.kitchenService.saveCurrentPage(this.currentPage);
    this.getKitchens();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.kitchenService.saveItemsPerPage(item);
    this.getKitchens();
  }

  public searchKitchens(value: string) {
    this.filterText = value;
    this.currentPage = 1;
    this.kitchenService.saveSearchFilter(this.filterText);
    this.getKitchens();
  }

  public viewKitchen(){}
  public viewWRKitchen(){}

  public getTemplates(){

    this.templateService.getTemplates('library', 'kitchen').subscribe(
        (data:any) => {
          this.templateList = data;
          if(this.templateList.length>0) this.templateId=this.templateList[0]._id;
          else this.templateId=null;
          
        },
        (err) => {
          this.notification.error('Error', err || 'Server Error');
      })
  }

  public templateSelected(index) {
      this.templateId = this.templateList[index]._id;
  }

  public downloadFile(){

    // this.appConfig.getSalesTax().subscribe(
    //   (data:any)=>{
    //     this.tax=data;
    //     ////console.log(this.tax,'taxxxxx')
    //   },(err) => {
    //       this.notification.error('Error', err || 'Server Error');
    //   })  

      this.printService.printLibrary(this.type, this.templateId, this.kitchenCategory, this.filterKitchen).subscribe(
        (data:any) => {
          var fileURL = URL.createObjectURL(data);
          window.open(fileURL);
        },
        (err) => {
          this.notification.error('Error', err || 'Server Error');
      })
  }

  
  public addClick() {
    this.kitchen = new Kitchen();
    this.status='new';
  }

  public viewClick(){
    this.status='view';
  }

  public editClick(){
    this.status='edit';
  } 

  public addSubClick() {
    this.status='newWR';
  }

  public viewWRClick(){
    this.status='viewWR';
  }

  public editWRClick(){
    this.status='editWR';
    //console.log(this.workRoom, 'edit')
  }

}
