import { Component, OnInit, Input ,EventEmitter, ViewChild } from '@angular/core';
import { GastroOfferService } from '../gastro-offer.service'
import { TemplateService } from '../../../global-utils/services/template.service'
import * as FileSaver from "file-saver";
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { ActivatedRoute, Router } from '@angular/router';
import { PrintService } from '../../../global-utils/services/print.service'
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'
import { Subject } from 'rxjs/Subject'


@Component({
  selector: 'gastro-offer-print',
  templateUrl: './gastro-offer-print.component.html',
  styleUrls: ['./gastro-offer-print.component.scss']
})
export class GastroOfferPrintComponent implements OnInit {
  @Input() public menuOnEdit;
  @Input() public hidden = false;
	@Input() public printEvent = new Subject();

  @ViewChild('print') printModal  

	public templateId = null;
	public templateList;
  public templateListBook;
  public tax;
  public menuType;
  public active: boolean;
  public type;
  public filterLocation;
  public showPrice: boolean = true;
  public recipeOptions = 'both';
  public descriptiveSelected : boolean = false;
	public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  public observerLocation;
  public onSalesTax = new Subject();
  public observerSalesTax;
  public menuName;

  constructor(
  		public gastroOfferService: GastroOfferService, 
  		public templateService: TemplateService,
  		public notification: NotificationsService,
  		public appConfig: AppConfig,
  		public route: ActivatedRoute, 
  		public printService: PrintService,
  		public costFilterService: CostFilterService

  	){
  			route.data.subscribe((data: {menuType: String}) => {
	        this.menuType = data.menuType;
	      });
  	}

  ngOnInit() {
    this.printEvent.subscribe((print:any)=>{
      this.menuType = print.menuType;
      this.menuName = print.name;
      this.getGastroOffer(print)	
      this.init()
    })     
    if (this.menuType) this.init()
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  private init () {
    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocation = data;
    })    

    this.appConfig.getSalesTax().subscribe(
      (data:any)=>{
        this.tax=data;
      },(err) => {
          this.notification.error('Error', err || 'Server Error');
    }) 
  }
  private getGastroOffer(print) {
      this.cleanAndResetFields();
       this.printModal.show()
       this.gastroOfferService.getMenu(print.id, print.versionId).subscribe(
        (data: any) => {
          this.menuOnEdit = data[0];
        })
  }

  public getTemplatesGastro(){

  	this.templateService.getTemplates('gastroOffer', 'gastro').subscribe(
        (data:any) => {
        	
        	this.templateList = data;
        	if(this.templateList.length>0) this.templateId=this.templateList[0]._id;
          else this.templateId=null;

          if(this.templateList[0].templateCode == 'GG000') this.descriptiveSelected = true;
          else this.descriptiveSelected = false;
        	
        },
        (err) => {
        	this.notification.error('Error', err || 'Server Error');
      })
  }

  public getTemplatesBook(){

    this.templateService.getTemplates('gastroOffer', 'book').subscribe(
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
      
      if(this.templateList[index].templateCode == 'GG000') this.descriptiveSelected = true;
      else this.descriptiveSelected = false;
  } 

  public downloadFile(){
    this.printService.printGastroOffer(this.menuOnEdit._id,this.menuType, this.templateId, this.tax, this.type, this.menuOnEdit.location, this.showPrice, this.recipeOptions).subscribe(
      (data:any) => {
      	var fileURL = URL.createObjectURL(data);
      	window.open(fileURL);
        this.descriptiveSelected = false;
      },
      (err) => {
      	this.notification.error('Error', err || 'Server Error');
    })
  }

  public cleanAndResetFields(){
    this.active=false;
    this.type='gastro';
  	this.getTemplatesGastro();
  }

  public cleanAndResetFieldsBook(){
    this.active=true;
    this.type='book';
    this.getTemplatesBook();
  }

  public printOptions(show){

    if(show == 'yes'){
      this.showPrice = true;
    } else {
      this.showPrice = false;
    }
  }

  public filterGastroOfferBy(recipe:string){

    switch (recipe) {
      case 'dish':
          this.recipeOptions = 'dish'
        break;
      case 'drink': 
        this.recipeOptions = 'drink'
        break;
      case 'both': 
        this.recipeOptions = 'both'
        break;
      default:
        // code...
        break;
    }
    
  }
}