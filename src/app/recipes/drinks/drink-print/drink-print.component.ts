import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DrinkService } from '../drink.service'
import { TemplateService } from '../../../global-utils/services/template.service'
import * as FileSaver from "file-saver";
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { PrintService } from '../../../global-utils/services/print.service'
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'drink-print',
  templateUrl: './drink-print.component.html',
  styleUrls: ['./drink-print.component.scss']
})
export class DrinkPrintComponent implements OnInit {
	@Input() public drink;
  @Input() public hidden = false;
  @Input() public printEvent = new Subject();

  @ViewChild('print') printModal  

	public templateId = null;
	public templateList;
  public tax;
  public allowPrint = true
  public noBatchWeight
	public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  public filterLocation;
  public observerLocation;
  public drinkName;  

  constructor(
  		public drinkService: DrinkService, 
  		public templateService: TemplateService,
  		public notification: NotificationsService,
  		public appConfig: AppConfig, 
  		public printService: PrintService, 
  		public translate : TranslateService,
  		public costFilterService: CostFilterService
  		) {

    this.translate.get('recipes.drink.noBatchWeight').subscribe((res: string) => {
      this.noBatchWeight = res;
      ////console.log('translation: '+ res);
    });

  }

  ngOnInit() {
    this.printEvent.subscribe((print:any)=>{
      this.drinkName = print.name;
      this.getDrink(print)  
    }) 
    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocation = data;
    })

    this.appConfig.getSalesTax().subscribe(
      (data:any)=>{
        this.tax=data;
        ////console.log(this.tax,'taxxxxx')
    },(err) => {
        this.notification.error('Error', err || 'Server Error');
    })    

  	this.getTemplates();
  }  
  
  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public getDrink(print){
    //Get the ingredient being edited.
    this.printModal.show()
    this.drinkService.getDrink(print.id, print.versionId).subscribe(
      (data: any) => {
        this.drink = data[0];  
        this.drink.simulationNetWeight = this.drink.versions.batchServings       
      })
  }

  public getTemplates(){
  	this.templateService.getTemplates('recipe', '').subscribe(
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
    ////console.log(this.dishOnEdit,'dishOnEditbeforePrint')

    this.allowPrint = true;

    this.templateList.forEach((template)=>{
       if(this.templateId==template._id && template.templateCode == 'RS003'){
         if(this.drink.simulationNetWeight==0 || this.drink.simulationNetWeight==null){
           this.allowPrint = false
         } 
       } 
    })

    if(this.allowPrint){

      this.printService.printDrink(this.drink._id, this.templateId, this.drink.simulationNetWeight, this.tax, this.drink.location).subscribe(
        (data:any) => {
          var fileURL = URL.createObjectURL(data);
          window.open(fileURL);
        },
        (err) => {
          this.notification.error('Error', err || 'Server Error');
      })

    } else {
      this.notification.warn('Error', this.noBatchWeight);
    }

  }

  public cleanAndResetFields(){
  	this.getTemplates();
  }

}