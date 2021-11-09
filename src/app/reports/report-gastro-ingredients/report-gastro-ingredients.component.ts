import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'
import { Observable, Subject } from "rxjs/Rx";
import { BrowserXhr  } from '@angular/http';
import * as FileSaver from "file-saver";
import { GastroOfferService } from "../../gastro/gastro-offers/gastro-offer.service";
import { FamilyService } from "../../libraries/family/family.service";
import { NotificationsService } from 'angular2-notifications';
import { ReportsService } from '../reports.service'
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'report-gastro-ingredients',
  templateUrl: './report-gastro-ingredients.component.html',
  styleUrls: ['./report-gastro-ingredients.component.scss']
})
export class ReportGastroIngredientsComponent implements OnInit {

   @ViewChild('gastroOfferSelectElement') gastroOfferSelectElement;
  public filterLocations = [];
  public gastroOfferSubject: Subject<any> = new Subject();
  public gastroOfferType;
  public gastroOfferList;
  public gastroOffer = [];
  public previousSearch;
  public loadingData=false;
  public templateId = null;
  public templateList;
  public tax;
  public temp
  public filterLocation;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }; 

  public exportType;
  public showRestart: boolean = false;
	public gastroType;
	public gastroOffers;
	public gastroOfferId = null;
	public gastroOfferTypes = [
    {type: 'all'},
		{type: 'menu' },
		{type: 'dailyMenuCarte'},
		{type: 'buffet' },
		{type: 'carte' },
		{type: 'fixedPriceCarte'},
		{type: 'catalog'} 
	];

  public exportTypes = [
      {type: 'reportTitle', value: 'gastroIngredients'},
      {type: 'reportTitleByLocation', value:'gastroIngredientsArticlesByLocation'}
    ];

  public stepLocations : boolean = false;
  public page : number = 0;
  public formatOptions = []
  public format;
  public qty;
  public quantityOptions;
  public reportStartedSummary
  public reportStartedDetail
  constructor(
  	public gastroService: GastroOfferService, 
  	public familyService: FamilyService, 
  	public notification: NotificationsService, 
  	public reportsService: ReportsService,
    public translate: TranslateService
    ) 
  { 
  }

  ngOnInit() {

    this.formatOptions = [{label: 'CSV', value: 'csv'}, {label: 'PDF', value: 'pdf'}];
    //this.cleanAndResetFields();
    /*gastroOffer Subject*/

    this.exportType = {
    	type: '',
    	value: ''
    }

  	this.gastroType = '';
    this.quantityOptions = [{label: 'Todas', value: 'all'}, {label: 'Una o más', value: 'some'}];
    this.qty = 'all';

    this.gastroOfferSubject
    .debounceTime(300)
    .subscribe((searchString) => {

      if (searchString === this.previousSearch) { //required to fix a 'bug' where searchString never becomes empty
        // string was deleted so assign empty array to ng-select items
        this.gastroOfferSelectElement.items = [];
        // force the ng-select to update and show the new list
        this.gastroOfferSelectElement.open()
        this.previousSearch = ''
      
      } else {
        //console.log(searchString,'searchString',this.filterLocations,'filterLocations',this.gastroType,'gastroType')
        this.previousSearch = searchString;
        if(this.exportType.value == 'gastroIngredients'){

          this.gastroService.getMenus(50, 0, searchString,'',1,[], null, null,this.gastroType).subscribe(
          (data:any) => {
            this.gastroOfferList = data.gastroOffers;

            if(this.gastroOfferList.length == 0) {
              let object = [{
                    id: 1,
                    text: 'No results'
                  }]

                this.gastroOfferSelectElement.items = object;
                this.gastroOfferSelectElement.open();

            } else {


              let elementData = this.gastroOfferList.map((element, index) => { 
                let object = {
                  id: element,
                  text: element.versions.lang.name
                }
                return object;
              });

              this.gastroOfferSelectElement.items = elementData;
              this.gastroOfferSelectElement.open();

            }

          },
          (err) => {
            this.notification.error('Error', err || 'Error');
          });

        } else {

          this.gastroService.getMenus(50, 0, searchString,'',1, this.filterLocations, null, null, this.gastroType).subscribe(
            (data:any) => {
            this.gastroOfferList = data.gastroOffers;

            if(this.gastroOfferList.length == 0) {
              let object = [{
                    id: 1,
                    text: 'No results'
                  }]

                this.gastroOfferSelectElement.items = object;
                this.gastroOfferSelectElement.open();

            } else {


              let elementData = this.gastroOfferList.map((element, index) => { 
                let object = {
                  id: element,
                  text: element.versions.lang.name
                }
                return object;
              });

              this.gastroOfferSelectElement.items = elementData;
              this.gastroOfferSelectElement.open();

            }

          },
          (err) => {
            this.notification.error('Error', err || 'Error');
          });

        }
        
      }

    });

    this.translation();
  }

  public translation(){

    this.translate.get('messageGeneric.reportStartedSummary').subscribe((res: string) => {
      this.reportStartedSummary = res;
    });  

    this.translate.get('messageGeneric.reportStartedDetail').subscribe((res: string) => {
      this.reportStartedDetail = res;
    }); 

  }

  public getGastroOffers(){

      this.gastroService.getMenus(1000000, 0, '', '', 1, [], null, null, this.gastroType).subscribe(
        (data:any) => {
          this.gastroOffers = data.gastroOffers;
          if(this.gastroOffers.length>0) this.gastroOfferId = this.gastroOffers[0]._id;
          else this.gastroOfferId=null;
        },
        (err) => {
          this.notification.error('Error', err || 'Error');
      })

  }

  public gastroTypeSelected(index){
  	
  	this.gastroType = this.gastroOfferTypes[index].type;
    this.qty='all';
  	//this.getGastroOffers();
  }

  public downloadFile(){
    //console.log(this.gastroOffer,'GASTROOFFER TO DOWNLOAD')
    let gastroOfferType;

    if(this.gastroType == 'all') gastroOfferType='';
    else gastroOfferType = this.gastroType;

    if(this.exportType.value == 'gastroIngredients'){

    	this.loadingData=true;

      this.reportsService.getGastroIngredients(this.gastroOffer, this.qty,gastroOfferType).subscribe(
        (data:any) => {
          //FileSaver.saveAs(data, 'report.csv');
          this.notification.success(this.reportStartedSummary, this.reportStartedDetail, 
          {
            timeOut: 0,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: true
          }
        )
 			    this.loadingData=false;
        },
        (err) => {
          this.notification.error('Error', err || 'Error');
 			    this.loadingData=false;
      })

    } else if(this.exportType.value == 'gastroIngredientsArticlesByLocation') {

    	this.loadingData=true;

      this.reportsService.getIngredientsByLocation(this.gastroOffer, this.qty, gastroOfferType, this.filterLocations).subscribe(
        (data:any) => {
          //FileSaver.saveAs(data, 'reportIngredientsAndArticlesByLocations.csv');
          this.notification.success(this.reportStartedSummary, this.reportStartedDetail, 
          {
            timeOut: 0,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: true
          }
        )
			    this.loadingData=false;
        },
        (err) => {
          this.notification.error('Error', err || 'Error');
 			    this.loadingData=false;
      })

    }      

  }

  public cleanStepValues(){
      this.exportType = {
          type: '',
          value: ''
      }
  }

  public cleanAndResetFields() {

	  let gastroOfferTypes = [
			{type: 'menu' },
			{type: 'dailyMenuCarte' },
			{type: 'buffet'},
			{type: 'carte'},
			{type: 'fixedPriceCarte'},
			{type: 'catalog'} 
		];

  	this.gastroType='';
    this.exportType = this.exportTypes[0];
  	this.gastroOfferId = null;
    //  	this.gastroOffers=[];
  	this.gastroOfferTypes=[];
  	this.gastroOfferTypes=gastroOfferTypes;
    
  	//this.getGastroOffers();
  }


  public updateFilterLocations(e) {
    this.filterLocations=e;
    //this.gastroOfferSearchChanged('');
  }

  public gastroOfferSearchChanged(value) {
    this.gastroOfferSubject.next(value);    
  }

  public gastroOfferSelected(value) {
    this.gastroOffer.push(value.id._id);
    console.log(this.gastroOffer,'gastroOffer ID')
  }

  public gastroOfferRemoved(value) {
    let index = this.gastroOffer.indexOf(value.id._id)
    this.gastroOffer.splice(index,1);
  }

  public resetList() {
    this.gastroOffer = [];
  }

  public exportTypeSelected(index) {
    
    this.exportType = this.exportTypes[index];

    if(this.exportType.value == 'gastroIngredients'){

      this.stepLocations = false;

    } else if(this.exportType.value == 'gastroIngredientsArticlesByLocation'){

      this.stepLocations = true;

    }
  }

  public onChangeFormat(e){
    if(e.value=='csv'){
      this.format = 'csv';
    } else {
      this.format = 'pdf';
    }
    console.log(this.format,'format')
  }

}
