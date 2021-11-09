import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from "../../../global-utils/services/compass.service";
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { SelentaImportService } from '../selenta-import.service';
import { LocationService } from "../../../global-utils/services/location.service";
import { Observable, Subject } from "rxjs/Rx";
import { FamilyService } from "../../../libraries/family/family.service";
import * as FileSaver from "file-saver";

@Component({
  selector: 'selenta-import-families',
  templateUrl: './selenta-import-families.component.html',
  styleUrls: ['./selenta-import-families.component.css']
})
export class SelentaImportFamiliesComponent implements OnInit {


  // @ViewChild(LocationFilterComponent)
  // public locationComponent: LocationFilterComponent;
  public refresh = new Subject();
  public clone = require('clone');
  private filterLocations = [];
  public searchBoxLabel: string;
  public families;
  public family;
  public familyDeletedTitle;
  public familyDeletedContent;
  public familiesLinkedTitle;
  public familiesLinkedContent;
  public costFilterSet:boolean=false; 
  public savedLocations = [];
  public selentaNewFamilies:any[] =[]; 
  public selentaFamiliesCurrentPage: number = 1;
  public selentaFamiliesPerPage: number = 5;
  public selentaFamiliesFilterText: string ='';
  public selentaFamilySelected;
  public selentaFamiliesSortField:string='';
  public selentaFamiliesSortOrder:number=1;
  public familySelected;
  public selentaTotalFamilies:number = 0;
  public cookDesignTotalFamilies:number = 0;
  public selentaFamiliesNumPages:number;
  public loading:boolean = true;
  private loadingCounter:number = 0;
  public selentaCookDesignFamilies: any[] = [];
  public cookDesignFamiliesCurrentPage: number = 1; //familiesCurrentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public cookDesignFamiliesPerPage: number = 5; //Default items per page
  public cookDesignFamiliesFilterText: string = '';
  public cookDesignFamiliesSortField:string='';
  public cookDesignFamiliesSortOrder:number=1;
 	public cookDesignFamiliesNumPages:number;
 	public forceFamilyRefresh = new EventEmitter();
  public forceFamilyRefreshForEdit = new EventEmitter();
  public forceSubFamilyRefresh = new EventEmitter();
  public forceSubFamilyRefreshForEdit = new EventEmitter();
  public familiesLangs: any[] = [];
  public subFamiliesLangs: any[] = [];

  public familyTmp = {
    name: ''
  };

  public subfamilyTmp = {
    name: ''
  };

  public subFamily = {
    lang: [],
    _id: '',
    localIndex: '',
    index: ''
  };
  public status;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }

  constructor(
    public notification: NotificationsService,
    public translateService: TranslateService,
    public router : Router,
    public compassService: CompassService,
    public locationService: LocationService,
    public selentaImportService: SelentaImportService,
    public familyService : FamilyService
    ){}

  ngOnInit() {
     this.cookDesignFamiliesCurrentPage = this.familyService.getCurrentPage();
     this.cookDesignFamiliesFilterText = this.familyService.getSearchFilter();
     this.translation();
    // //this.getFamilies();
     this.getSelentaSapFamilies();
     this.getSelentaCookDesignFamilies();
  }

  /*Get Hotel Sofia locations*/
  // private getSelentaLocations(){
  //   this.locationService.getAllLocations().subscribe(
  //     (data: any)=> {
  //       this.filterLocations = [];
  //       this.savedLocations = [];
  //       for (var location of data[0].companies) {
  //         if(location.name === 'Hotel Sofia, S.L') {
  //           /*Add locations*/
  //           for (var bussines of location.businessUnits) {
  //             this.filterLocations.push(bussines._id);
  //             this.savedLocations.push(bussines._id);
  //           }
  //             this.filterLocations.push(location._id);
  //             this.savedLocations.push(location._id);
  //         }
  //       }
  //       this.getfamilies();
  //     },
  //     (err) => {
  //       this.notification.error('Error', err || 'Server error');
  //     })
  // }

  // public getFamilies(){
  //   this.familyService.getFamily('recipe','','','','','').subscribe(
  //     (data:any) => {
  //       this.families = data.families;
  //       //this.loadingFinish();
  //     },
  //     (err) => {
  //       this.notification.error('Error', err || 'Error');
  //     }
  //   )
  // }

  public getSelentaCookDesignFamilies() {

    this.selentaImportService.getSelentaCookDesignFamilies(
      this.cookDesignFamiliesPerPage, 
      this.cookDesignFamiliesCurrentPage-1,
      this.cookDesignFamiliesFilterText,
      this.cookDesignFamiliesSortField,
      this.cookDesignFamiliesSortOrder
    ).subscribe(
    (res:any) => {

      this.selentaFamilySelected = null;
      this.selentaCookDesignFamilies = this.getSubfamilyObject(res.cookDesign);
      this.cookDesignTotalFamilies = res.totalElements;
      // console.log(this.selentaCookDesignFamilies,'selentaCookDEsign')
      // console.log(this.cookDesignTotalFamilies,'cookDesignTotalFamilies')
      this.loadingFinish();
    },
    (err) => {
      this.notification.error('Error', err || 'Error');
      let timeout = setTimeout(() => {
        this.router.navigate(['/import']);
      }, 1500);
    });
  }

  public getSelentaSapFamilies() {

    this.selentaImportService.getSelentaSapFamilies(
      this.selentaFamiliesPerPage,
      this.selentaFamiliesCurrentPage-1,
      this.selentaFamiliesFilterText,
      this.selentaFamiliesSortField,
      this.selentaFamiliesSortOrder
    ).subscribe(
    (res:any) => {

      this.selentaFamilySelected = null;
      this.selentaNewFamilies = res.selenta;
      this.selentaTotalFamilies = res.totalElements;
      // console.log(this.selentaNewFamilies,'selentaFamilies')
      // console.log(this.selentaTotalFamilies,'selentaTotalFamilies')
      this.loadingFinish();
    },
    (err) => {
      this.notification.error('Error', err || 'Error');
      let timeout = setTimeout(() => {
        this.router.navigate(['/import']);
      }, 1500);
    });
  }

  public getSubfamilyObject(cookDesignFamilies){

  	cookDesignFamilies.forEach((cookDesignFamily)=>{

  		if(cookDesignFamily.family.type == 'subfamily'){

  				let subfamilyObject = cookDesignFamily.family.familyId.subfamilies.filter((subfamily)=>{
  						return subfamily._id == cookDesignFamily.family.subfamilyId
  				})

  				if(subfamilyObject.length > 0){
  					cookDesignFamily.family.subfamily = subfamilyObject;
  				}

  		} 

  	})

  	return cookDesignFamilies;

  }

  private loadingFinish() {
    this.loadingCounter++
    if(this.loadingCounter === 2) this.loading = false;
  }

  private translation(){

    this.translateService.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translateService.get('library.family.family.notifications.familyDeletedTitle').subscribe((res: string) => {
      this.familyDeletedTitle = res;
    });

    this.translateService.get('library.family.family.notifications.familyDeletedContent').subscribe((res: string) => {
      this.familyDeletedContent = res;
    });

    this.translateService.get('selenta-import.familiesLinkedTitle').subscribe((res: string) => {
      this.familiesLinkedTitle = res;
    });

    this.translateService.get('selenta-import.familiesLinkedContent').subscribe((res: string) => {
      this.familiesLinkedContent = res;
    });
  }

  public linkFamilies() {
    //console.log(this.familieselected, this.selentafamilieselected);
    if(this.family.family.type == 'family'){

    	this.family.family.externalCode = this.selentaFamilySelected.family.GRUP_ARTICLES.slice(1,3);

	    this.familyService.editFamily(this.family).subscribe(
	    (res) => {
	      this.selentaImportService.deleteSelentaSapFamily(this.selentaFamilySelected._id).subscribe(
	      (res) => {
	        this.notification.success(this.familiesLinkedTitle, this.familiesLinkedContent);
	        this.getSelentaCookDesignFamilies();
	        this.getSelentaSapFamilies();
	      },(err) => {
	        this.notification.error('Error', err || 'Error');
	      });
	    },(err) => {
	      this.notification.error('Error', err || 'Error');
	    });

    } else {

    	this.family.family.subfamily[0].externalCode = this.selentaFamilySelected.family.GRUP_ARTICLES.slice(1,9);

	    this.familyService.editSubFamily(this.family.family.subfamily[0]).subscribe(
	    (res) => {
	      this.selentaImportService.deleteSelentaSapFamily(this.selentaFamilySelected._id).subscribe(
	      (res) => {
	        this.notification.success(this.familiesLinkedTitle, this.familiesLinkedContent);
	        this.getSelentaCookDesignFamilies();
	        this.getSelentaSapFamilies();
	      },(err) => {
	        this.notification.error('Error', err || 'Error');
	      });
	    },(err) => {
	      this.notification.error('Error', err || 'Error');
	    });

    }
    
  }

  /*---------------------------------New Selenta families table functions--------------------------------------*/

  public selectSelentaFamily(family) {
    this.selentaFamilySelected = family;
    //console.log(this.selentaFamilySelected,'selentaFamilySelected');
  }
  public filterSelentaFamilies(text:string) {
    this.selentaFamiliesFilterText=text;
    this.selentaFamiliesCurrentPage=1;
    this.getSelentaSapFamilies();
  }

  public updateSelentaFamiliesPerPage(item: number) {
    this.selentaFamiliesPerPage = item;
    this.selentaFamiliesCurrentPage = 1;
    this.getSelentaSapFamilies();
  }

  public selentaPageHasChanged(data) {
    this.selentaFamiliesPerPage = data.itemsPerPage;
    this.selentaFamiliesCurrentPage = data.page;
    this.getSelentaSapFamilies();
  }


  /*---------------------------------------- cookDesign families table functions----------------------------------------*/

  public searchCookDesignFamilies(value: string){
    this.cookDesignFamiliesFilterText=value;
    this.familyService.saveSearchFilter(this.cookDesignFamiliesFilterText);
    this.cookDesignFamiliesCurrentPage=1;
    this.getSelentaCookDesignFamilies();
  }

  public updateItemsPerPage(item: number) {
    this.cookDesignFamiliesPerPage = item;
    this.familyService.saveItemsPerPage(item);
    this.cookDesignFamiliesCurrentPage = 1;
    this.getSelentaCookDesignFamilies();
  }

  // public filterListByLocation(){
  //   this.costFilterSet=true;
  //   this.savedLocations = [];
  //   this.savedLocations = this.savedLocations.concat(this.filterLocations)
  //   //this.familyService.saveLocationFilter(this.savedLocations);
  //   this.getFamilies();
  // }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    // this.costFilterSet=false;
    // this.savedLocations=[];
    // this.refresh.next([]);
    // this.filterLocations=[];
    //this.getSelentaLocations();
  }

  public cancelSelection() {
    this.refresh.next(this.clone(this.savedLocations));
    this.filterLocations = [];
    this.filterLocations = this.filterLocations.concat(this.savedLocations);
  }

  // public viewFamily(_id){
  //   this.compassService.saveRedirectData('/import/selenta-import/selenta-import-families','','','');
  //   this.router.navigate(['./libraries/family/']);
  // }

  // public editFamily(_id){
  //   this.compassService.saveRedirectData('/import/selenta-import/selenta-import-families','','','');
  //   this.router.navigate(['./libraries/family?_id', _id]);   
  // }

  public selectFamilyToEdit(family){
    this.family=family;
    //console.log(this.family,'this.family')
    //The family object only has one language in the lang array because getFamilies restricts the lang filelds to the current language. We need to show
    //in the form all the languages existing for that family. The method getLangsFamily obtains the lang array (with all the languages) for the selected
    //family and forces a refresh so that the result is pushed to the view via familyTmp
    if(this.family && this.family.family.type == 'family'){

    	this.familyService.getLangsFamily(this.family.family.familyId._id).subscribe(
      (data: any) => {
      	//console.log(data,'dataLangs')
        this.forceFamilyRefreshForEdit.emit(data.lang);
      })

    } else {

    	this.familyService.getLangsFamily(this.family.family.familyId._id).subscribe(
      (data: any) => {
      	//console.log(data,'dataLangs')
        this.forceFamilyRefreshForEdit.emit(data.lang);
      })

    	this.familyService.getLangsSubFamily(this.family.family.subfamilyId).subscribe(
      (data: any) => {
        //Emit the subfamily object with all the languages. It will get picked up by lang-tab and pushed out via two-way binding to subFamilyTmp.
        //console.log('this.editedSubFamily');
        //console.log(this.editedSubFamily);
        //console.log(data,'dataLangsSub')
        this.forceSubFamilyRefreshForEdit.emit(data.lang);
      })
    }
    
  }

  public deleteFamily() {

  	if(this.family.family.type == 'family'){

  		this.familyService.deleteFamily(this.family.family.familyId._id).subscribe(
      (data) => {
        this.notification.success(this.familyDeletedTitle, this.familyDeletedContent);
        this.getSelentaCookDesignFamilies();        
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })

  	} else {

  		this.familyService.deleteSubfamily(this.family.family.subfamily[0]._id).subscribe(
      (data) => {
        this.getSelentaCookDesignFamilies();
        this.notification.success("Subfamília eliminada", "Subfamília eliminada correctamente");
        this.subfamilyTmp = {
          name: ''
        };
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    );

  	}
    
  }

  // public addFamily(_id?){
  //   this.compassService.saveRedirectData('/import/selenta-import/selenta-import-families','','','');
  //   this.router.navigate(['./libraries/family']);
  // }

  public pageHasChanged(data) {
    this.cookDesignFamiliesPerPage = data.itemsPerPage;
    this.cookDesignFamiliesCurrentPage = data.page;
    this.familyService.saveCurrentPage(this.cookDesignFamiliesCurrentPage);
    this.getSelentaCookDesignFamilies();
  }

  public familiesLangObjRefreshed(e) {
    //Method invoked whenever the 'true' event is emmitted by forceFamilyRefresh or forceFamilyRefreshForEdit. The lang-tab receives this event, refreshes
    //the LabObj with the data in the form and in turn emits a langsObj output which is captured by this method.
    this.familiesLangs = e.langsObj;
  }

  public subFamiliesLangObjRefreshed(e) {
    //Method invoked whenever the 'true' event is emmitted by forceFamilyRefresh or forceFamilyRefreshForEdit. The lang-tab receives this event, refreshes
    //the LabObj with the data in the form and in turn emits a langsObj output which is captured by this method.
    this.subFamiliesLangs = e.langsObj;
  }

  public editFamilyOrSubfamily() {
    //Force a refresh to make sure familiesLangs object contains the inputs entered in the form for all languages. Emitting a forceFamilyRefresh
    //updates the familiesLangs object via the lang-tab component.
    if(this.family.family.type == 'family'){

    	this.forceFamilyRefreshForEdit.emit(true);

	    //Create a family object with the updated lang array.
	    let familyObject = {
	    	_id: this.family.family.familyId._id, 
	    	lang: this.familiesLangs, 
	    	externalCode: this.family.family.externalCode
	    };

	    //Send the family object to the editFamily method of the API
	    this.familyService.editFamily(familyObject).subscribe(
	      (data) => {
	        this.getSelentaCookDesignFamilies();
	        this.notification.success("Família editada","Família editada correctamente");
	        this.familyTmp = {
	          name: ''
	        };
	      },
	      (err) => {
	        this.notification.error('Error', err || 'Server Error');
	      })

    } else {

    	this.forceSubFamilyRefreshForEdit.emit(true);

	    //Create a new family object with the updated subfamily.
	    let subfamily = {
	    	_id: this.family.family.subfamily[0]._id, 
	    	lang: this.subFamiliesLangs, 
	    	externalCode: this.family.family.subfamily[0].externalCode
	    };

	    this.familyService.editSubFamily(subfamily).subscribe(
	      (data) => {
	        this.getSelentaCookDesignFamilies();
	        this.notification.success("Subfamília editada", "Subfamília editada correctamente");
	        this.subfamilyTmp = {
	          name: ''
	        };
	      },
	      (err) => {
	       this.notification.error('Error', err || 'Server Error');
	      })

    }
    
  }

}
