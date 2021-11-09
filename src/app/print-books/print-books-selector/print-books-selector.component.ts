import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { PrintService } from '../../global-utils/services/print.service';
import { PrintBooksService } from '../print-books.service';
import { GastroOfferService } from '../../gastro/gastro-offers/gastro-offer.service';
import { TemplateService } from '../../global-utils/services/template.service'
import { Observable, Subject } from "rxjs/Rx";
import * as FileSaver from "file-saver";
import { CostFilterService } from '../../global-utils/services/cost-filter.service'
import { AppConfig } from "../../global-utils/services/appConfig.service";
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'print-books-selector',
  templateUrl: './print-books-selector.component.html',
  styleUrls: ['./print-books-selector.component.scss']
})
export class PrintBooksSelectorComponent implements OnInit {

  @ViewChild('gastroOfferSelectElement') gastroOfferSelectElement;
  public filterLocations = [];
  public gastroOfferSubject: Subject<any> = new Subject();
  public gastroOfferType;
  public gastroOfferList;
  public gastroOffer = '';
  public previousSearch;
  public loadingData=false;
  public template = null;
  public templateList;
  public tax;
  public temp
  public searchFilterLocations = [];
	public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }  
  public observerLocation;
  public showSubproducts : boolean = false;
  public showSubproductsCheck :boolean = false
  public check;
  public printBookStartedSummary;
  public printBookStartedDetail;
  public printSubpInLocStartedSummary;
  public printSubpInLocStartedDetail;
  public gastroOfferLocation;

  constructor(
    public notification: NotificationsService, 
    public gastroOfferService: GastroOfferService,
  	public printBookService: PrintBooksService,
    public templateService: TemplateService,
    public appConfig: AppConfig,
  	public costFilterService: CostFilterService,
    public translate: TranslateService

    ){}

  ngOnInit() {

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocations = data;
    })

    this.gastroOfferType = 'menu';
    this.getSalesTax();
    this.getTemplatesBook();
    this.translation();

    /*gastroOffer Subject*/
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

        this.previousSearch = searchString;
        
        this.gastroOfferService.getMenus(
        		50, 
        		0, 
        		searchString,
        		'',
        		1, 
        		this.searchFilterLocations, 
        		null, 
        		null, 
        		this.gastroOfferType,
        		true
       	)
       	.subscribe(
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
    });
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public translation(){
    this.translate.get('messageGeneric.printBookStartedSummary').subscribe((res: string) => {
      this.printBookStartedSummary = res;
    });  

    this.translate.get('messageGeneric.printBookStartedDetail').subscribe((res: string) => {
      this.printBookStartedDetail = res;
    }); 

    this.translate.get('messageGeneric.printSubpInLocStartedSummary').subscribe((res: string) => {
      this.printSubpInLocStartedSummary = res;
    });  

    this.translate.get('messageGeneric.printSubpInLocStartedDetail').subscribe((res: string) => {
      this.printSubpInLocStartedDetail = res;
    });
  }

  public updateFilterLocations(e) {
    this.searchFilterLocations=e;
    this.gastroOfferSearchChanged('');
  }

  public gastroOfferTypeSelected(gastroOfferType:string) {
    this.gastroOffer='';
    this.gastroOfferType = gastroOfferType;
    this.gastroOfferSubject.next(''); 
  }

  public gastroOfferSearchChanged(value) {
    this.gastroOfferSubject.next(value);    
  }

  public gastroOfferSelected(value) {
    this.gastroOffer = value.id._id;
    this.gastroOfferLocation = value.id.location;
  }

  public gastroOfferRemoved(value) {
    this.gastroOffer = '';
  }

  public resetList() {
  	this.gastroOffer='';
  }

  public templateSelected(index) {
    
	if(this.template.templateCode == 'GB001'){ //Recipes book
      this.showSubproductsCheck = true
    } else {
      this.showSubproductsCheck= false;
      this.showSubproducts = false;
    }

  } 

  public getTemplatesBook(){

    this.templateService.getTemplates('gastroOffer', 'book').subscribe(
      (data:any) => {
        this.templateList = data;
        
        if(this.templateList.length>0) {
          this.template=this.templateList[0];

        } else {
          this.template=null;
        }
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
    })
  }

  public getSalesTax(){
  	this.appConfig.getSalesTax().subscribe(
	    (data:any)=>{
	        this.tax=data;
	      },(err) => {
	        this.notification.error('Error', err || 'Error');
	    })
  }

  public downloadFile(){
    //this.loadingData = true;

     this.printBookService.printGastroOffer(this.gastroOffer,this.gastroOfferType, this.template._id, this.tax, 'book', this.gastroOfferLocation, this.showSubproducts).subscribe(
      (data:any) => {

  			this.notification.success(this.printBookStartedSummary, this.printBookStartedDetail, 
  				{
		        timeOut: 1500,
		        showProgressBar: false,
		        pauseOnHover: false,
		        clickToClose: true
  				}
  			);
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
    })    
  }
}
