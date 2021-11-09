import {Component, Input, ViewContainerRef, EventEmitter} from '@angular/core';
import {FamilyService} from "../family.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { ActivatedRoute, Router } from '@angular/router';
import { PrintService } from '../../../global-utils/services/print.service'
import { TemplateService } from '../../../global-utils/services/template.service'
import * as FileSaver from "file-saver";
import { Family } from '../../../global-utils/models/family.model';
import { subFamily } from '../../../global-utils/models/subfamily.model';
import { Subject } from 'rxjs'
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
  selector: 'family-table',
  templateUrl: './family-table.template.html',
})
export class FamilyTableComponent {
  public totalItems: number;
  @Input() public familyCategory;
  @Input() public title;
  @Input() public subfamiliesEnabled;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public orderBy: string = '';
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public familyExternalCode;  
  public subFamilyExternalCode;
  public subfamily;
  public family;
  public status;

  public families;
  public familiesLangs: any[] = [];
  public subFamiliesLangs: any[] = [];

  public familyTmp = {
    name: ''
  };

  public subFamilyTmp = {
    name: ''
  };

  public editedFamily: any[] = [];
  public editedSubFamily: any[] = [];

  public familyOnEdit: any;
  public subFamilyIndex: any;
  public subfamilyLength: number;

  public forceFamilyRefresh = new EventEmitter();
  public type;
  public forceSubFamilyRefresh = new EventEmitter();
  public numPages:number;
  public loading:boolean = true;
  public updating:boolean = false;
  public options = {
     timeOut: 1000,
    position: ["top", "right"]
  }
  public fold = new Subject();
  public filterLocations = [];
  public observerLocation;
 
  constructor(
  	public familyService: FamilyService, 
  	public translate: TranslateService,
  	public printService: PrintService, 
  	public templateService: TemplateService, 
  	public notification : NotificationsService,
    public costFilterService: CostFilterService
  	) 
  {

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
      //console.log('translation: '+ res);
    });
  }

  ngOnInit() {
    this.loading = true;
    this.updating = false;

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
      	this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.currentPage = this.familyService.getCurrentPage();
        this.itemsPerPage = this.familyService.getItemsPerPage();
        this.filterText = this.familyService.getSearchFilter();         
        this.getFamilies();
    })
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
	}
	
  public familiesLangObjRefreshed(e) {
    //Method invoked whenever the 'true' event is emmitted by forceFamilyRefresh or forceFamilyRefresh. The lang-tab receives this event, refreshes
    //the LabObj with the data in the form and in turn emits a langsObj output which is captured by this method.
    this.familiesLangs = e.langsObj;
  }

  public subFamiliesLangObjRefreshed(e) {
    //Method invoked whenever the 'true' event is emmitted by forceSubFamilyRefresh or forceSubFamilyRefreshForEdit. The lang-tab receives this event and in turn
    //emits a langsObj which is captured by this method.
    this.subFamiliesLangs = e.langsObj;
  }

  public getFamilies() {
    this.updating=true;
    this.familyService.getFamily(
      this.familyCategory, 
      this.itemsPerPage, 
      this.currentPage - 1, 
      this.sortField,
      this.sortOrder, 
      this.filterText,
      '',
      this.filterLocations
    ).subscribe(
      (data: any) => {
      	//console.log(data.families, 'families for ' + this.familyCategory)
        this.families = data.families;
        this.totalItems = data.totalElements;
        this.loading = false;
        this.updating = false;
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');      
      });
  }

  public addFamilyClick() {
  	this.fold.next(true)
  	this.familyTmp.name = "";
  	this.family = new Family();
    this.status='new';
  }

  public saveFamily() {
    //Force a refresh to make sure familiesLangs object contains the inputs entered in the new family form for all languages.
    //Emitting a forceFamilyRefresh updates the familiesLangs object via the lang-tab component.
    this.forceFamilyRefresh.emit(true);
    this.family.lang = this.familiesLangs;

    //Create a new families object called processObj that contains the the lang array and the family category.
    if (this.status=='new') {

      this.family.category = this.familyCategory; 
      this.familyService.addFamily(this.family).subscribe(
      (data) => {
        this.getFamilies();
        this.notification.success("Família creada","Família creada correctamente");
        this.familyTmp = {
          name: ''
        };
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    )
    }
      
    if (this.status=='edit') {

      this.familyService.editFamily(this.family).subscribe(
      (data) => {
        this.getFamilies();
        this.notification.success("Família editada","Família editada correctamente");
        this.familyTmp = {
          name: ''
        };
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    )
    }    
  }
  

  public selectFamilyToEdit(family) {
    //Get the reference for the family on edit.
    this.family = JSON.parse(JSON.stringify(family));
		this.fold.next(true)
    //The family object only has one language in the lang array because getFamilies restricts the lang filelds to the current language. We need to show
    //in the form all the languages existing for that family. The method getLangsFamily obtains the lang array (with all the languages) for the selected
    //family and forces a refresh so that the result is pushed to the view via familyTmp
    this.familyService.getLangsFamily(family._id).subscribe(
      (data: any) => {
        this.editedFamily = data.lang;
        this.forceFamilyRefresh.emit(this.editedFamily);
      }
    )
  }

  public deleteFamily(_id) {
    this.familyService.deleteFamily(_id).subscribe(
      (data) => {
        this.getFamilies();
        this.notification.success("Família eliminada","Família eliminada correctamente");
      },
      (err) => {
       this.notification.error('Error', err || 'Server Error');
      }
    )
  }

  public addSubFamilyClick() {
    //this.family.subfamilies = new subFamily;
    this.subfamily = new subFamily;   
    //this.family.subfamilies[length].referenceNumber = "";
    this.subFamilyTmp.name = "";

  }

  public saveSubFamily() {
    //Adding a subfamily is done by updating the family object being edited with the new subfamily name fields and invoking the editFamily method of the API.

    //Force a refresh to make sure the subFamiliesLangs object contains the inputs entered in the form for all languages. Emitting a forceSubFamilyRefresh
    //updates the subFamiliesLangs object via the lang-tab component.
    this.forceSubFamilyRefresh.emit(true);

    //Update the current family and send it to the API
    if (this.status=='newSub') {
      this.subfamily.lang = this.subFamiliesLangs;
      let object = {
        _id: this.family._id,
        subfamily: this.subfamily
      }
      this.familyService.addSubfamily(object).subscribe(
      (data) => {
        this.getFamilies();
        this.notification.success("Subfamília añadida", "Subfamília añadida correctamente");
        this.subFamilyTmp = {
          name: ''
        };
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      })
    }

    else if (this.status=='editSub') {
       this.subfamily.lang = this.subFamiliesLangs;
       this.familyService.editSubFamily(this.subfamily).subscribe(
        (data) => {
          this.getFamilies();
          this.notification.success("Subfamília editada", "Subfamília editada correctamente");
          this.familyTmp = {
            name: ''
          };
        },
        (err) => {
         this.notification.error('Error', err || 'Server Error');
        })
     }
  }

  public selectSubFamilyToEdit(family, subfamily, index) {
    //The family object only has one language in the subfamilies lang array because getFamilies restricts the lang fields to the current language. We need to show
    //in the form all the languages existing for that subfamily. The method getLangsSubFamily obtains the lang array (with all the languages) for the selected
    //subfamily and forces a refresh so that the result is pushed to the view via lang-tab and familyTmp
    this.family = JSON.parse(JSON.stringify(family));
    this.subfamily = JSON.parse(JSON.stringify(subfamily));
    this.subFamilyIndex = index;
      
    this.familyService.getLangsSubFamily(subfamily._id).subscribe(
      (data: any) => {
        this.forceSubFamilyRefresh.emit(data.lang);
      }
    )
    //console.log(this.subfamily, 'selectsub')
  }  

  public deleteSubFamily(_id) {
    //Deleting a subfamily is done by invoking the deleteSubfamily method of the API.

    this.familyService.deleteSubfamily(_id).subscribe(
      (data) => {
        this.getFamilies();
        this.notification.success("Subfamília eliminada", "Subfamília eliminada correctamente");
        this.familyTmp = {
          name: ''
        };
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    );


    this.getFamilies();
  }

  public updateSelectedLocations(e) {
    this.family.location=e;
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.getFamilies();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.getFamilies();
  }

  public searchFamilies(value: string) {
    this.filterText = value;
    this.currentPage = 1;
    this.getFamilies();
  }

  public viewFamily(){}
  public viewSubFamily(){}

  public viewClick(){
    this.status='view';
  }

  public editClick(){
    this.status='edit';
  } 

  public addSubClick() {
    this.status='newSub';
    //this.cleanAndResetFields();
  }

  public viewSubClick(){
    this.status='viewSub';
  }

  public editSubClick(){
    this.status='editSub';
    console.log(this.subfamily, 'edit')
  }

}
