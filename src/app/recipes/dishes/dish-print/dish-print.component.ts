import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DishService } from '../dish.service'
import { TemplateService } from '../../../global-utils/services/template.service'
import * as FileSaver from "file-saver";
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { PrintService } from '../../../global-utils/services/print.service'
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'dish-print',
  templateUrl: './dish-print.component.html',
  styleUrls: ['./dish-print.component.scss']
})
export class DishPrintComponent implements OnInit {
	@Input() public dish;
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
  public onSalesTax = new Subject();
  public observerSalesTax;
  public dishName;  

  constructor(
  		public dishService: DishService, 
  		public templateService: TemplateService,
  		public notification: NotificationsService,
  		public appConfig: AppConfig, 
  		public printService: PrintService, 
  		public translate: TranslateService,
			public costFilterService: CostFilterService  		
			) { 

    this.translate.get('recipes.dish.noBatchWeight').subscribe((res: string) => {
      this.noBatchWeight = res;
      ////console.log('translation: '+ res);
    });

  }

  ngOnInit() {
    this.printEvent.subscribe((print:any)=>{
      this.dishName = print.name;
      this.getDish(print)  
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

  public getDish(print){
    //Get the ingredient being edited.
    this.printModal.show()
    this.dishService.getDish(print.id, print.versionId).subscribe(
      (data: any) => {
        this.dish = data[0];  
        this.dish.simulationNetWeight = this.dish.versions.batchServings  

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

  	 this.allowPrint = true;

     //Check whether selected template is production
     this.templateList.forEach((template)=>{
       if(this.templateId==template._id && template.templateCode == 'RS003'){ //Production template
         if(this.dish.simulationNetWeight==0 || this.dish.simulationNetWeight==null){
           this.allowPrint = false
         } 
       } 
     })

     if(this.allowPrint){

       this.printService.printDish(this.dish._id, this.templateId, this.dish.simulationNetWeight, this.tax, this.dish.location).subscribe(
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
