import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { PrintService } from '../../global-utils/services/print.service';
import { GastroOfferService } from '../../gastro/gastro-offers/gastro-offer.service';
import { TemplateService } from '../../global-utils/services/template.service'
import { Observable, Subject } from "rxjs/Rx";
import * as FileSaver from "file-saver";

import { AppConfig } from "../../global-utils/services/appConfig.service";

@Component({
  selector: 'report-print',
  templateUrl: './report-print.component.html',
  styleUrls: ['./report-print.component.css']
})
export class ReportPrintComponent implements OnInit {

  @ViewChild('gastroOfferSelectElement') gastroOfferSelectElement;
  public filterLocations = [];
  public gastroOfferSubject: Subject<any> = new Subject();
  public gastroOfferType;
  public gastroOfferList;
  public gastroOffer = '';
  public previousSearch;
  public loadingData=false;
  public templateId = null;
  public templateList;
  public tax;
	public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }  

  constructor(
    public notification: NotificationsService, 
    public gastroOfferService: GastroOfferService,
  	public printService: PrintService,
    public templateService: TemplateService,
    public appConfig: AppConfig
    ){}

  ngOnInit() {
    this.gastroOfferType = 'menu';
    this.getTemplatesBook();

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
        this.gastroOfferService.getMenus(50, 0, searchString,'',1, this.filterLocations, null, null, this.gastroOfferType).subscribe(
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

  public updateFilterLocations(e) {
    this.filterLocations=e;
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
  }

  public gastroOfferRemoved(value) {
    this.gastroOffer = '';
  }

  public resetList() {
  	this.gastroOffer='';
  }

  public templateSelected(index) {
    this.templateId = this.templateList[index]._id;
  } 

  public getTemplatesBook() { //: Observable <any>{

    //return Observable.create((obs)=>{

      this.templateService.getTemplates('gastroOffer', 'allergen').subscribe(
        (data:any) => {
          this.templateList = data;
          if(this.templateList.length>0) this.templateId=this.templateList[0]._id;
          else this.templateId=null;
        },
        (err) => {
          this.notification.error('Error', err || 'Error');
      })

    // })
    // .flatMap((res)=>{

    //   return Observable.create((obs)=>{

    //     this.templateService.getTemplates('library', 'family').subscribe(
    //       (data:any) => {
    //         console.log(data,'data SecondTemplate')
    //         this.templateList.concat(data);
    //       },
    //       (err) => {
    //         this.notification.error('Error', err || 'Error');
    //     })

    //   })

    // })
    


  }

  public downloadFile(){
    this.loadingData = true;
    //let typeLibrary;

    this.appConfig.getSalesTax().subscribe(
    (data:any)=>{
        this.tax=data;
      },(err) => {
        this.notification.error('Error', err || 'Error');
    })
    //console.log(this.gastroOffer,'gastroOfferId')
    //if(this.templateList[0]._id == this.templateId){

      this.printService.printAllergensInGastroOffer(this.gastroOffer, this.templateId, this.tax).subscribe(
        (data:any) => {
          var fileURL = URL.createObjectURL(data);
          window.open(fileURL);
          this.loadingData = false;
        },
        (err) => {
          this.notification.error('Error', err || 'Error');
      })

    // } else {

    //   let filterLibrary = this.templateList.filter((template)=>{
    //     return this.templateId == template._id
    //   })

    //   switch(true){

    //     case filterLibrary.lang[0].name == 'Listado de Familias': typeLibrary = 'family';
    //       break;

    //     case filterLibrary.lang[0].name == 'Listado de Familias': typeLibrary = 'family';
    //       break;

    //     case filterLibrary.lang[0].name == 'Listado de Familias': typeLibrary = 'family';
    //       break;

    //     case filterLibrary.lang[0].name == 'Listado de Familias': typeLibrary = 'family';
    //       break;

    //     case filterLibrary.lang[0].name == 'Listado de Familias': typeLibrary = 'family';
    //       break;

    //     case filterLibrary.lang[0].name == 'Listado de Familias': typeLibrary = 'family';
    //       break;
    //   }


    // }
    
  }

}
