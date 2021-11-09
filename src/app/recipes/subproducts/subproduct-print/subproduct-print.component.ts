import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { SubproductsService } from '../subproducts.service'
import { TemplateService } from '../../../global-utils/services/template.service'
import { PrintService } from '../../../global-utils/services/print.service'
import * as FileSaver from "file-saver";
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'
import { Subject } from 'rxjs/Subject'


@Component({
  selector: 'subproduct-print',
  templateUrl: './subproduct-print.component.html',
  styleUrls: ['./subproduct-print.component.scss']
})
export class SubproductPrintComponent implements OnInit {

  @Input() public subproduct;
	@Input() public hidden = false;
  @Input() public printEvent = new Subject();

  @ViewChild('print') printModal  

	public templateId = null;
	public templateList;
  public gastroComment=[];
  public tax;
  public allowPrint = false
  public noBatchWeight
  //public diet: string;
  public netWeigthValue: number;
  public filterLocation;

	public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  public observerLocation;
  public subproductName;  

  constructor(
  		public subproductService: SubproductsService, 
  		public templateService: TemplateService,
  		public notification: NotificationsService, 
  		public appConfig: AppConfig, 
  		public printService: PrintService, 
  		public translate: TranslateService,
  		public costFilterService: CostFilterService
  	) {

      this.translate.get('recipes.subproduct.noBatchWeight').subscribe((res: string) => {
        this.noBatchWeight = res;
        ////console.log('translation: '+ res);
      });

    }

  ngOnInit() {
    this.printEvent.subscribe((print:any)=>{
      this.subproductName = print.name;
      this.getSubproduct(print)  
    }) 
    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocation = data;
    })

    this.appConfig.getSalesTax().subscribe(
    (data:any)=>{
      this.tax=data;
    },(err) => {
        this.notification.error('Error', err || 'Error');
    });

  	this.getTemplates();
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }


  public getSubproduct(print){
    //Get the ingredient being edited.
    this.printModal.show()
    this.subproductService.getSubproduct(print.id, print.versionId).subscribe(
      (data: any) => {
        this.subproduct = data[0];   
        this.subproduct.simulationNetWeight = this.subproduct.versions.batchWeight  
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

      this.templateList.forEach((template)=>{
         if(this.templateId==template._id && template.templateCode == 'RS003'){
           if(this.subproduct.simulationNetWeight==0 || this.subproduct.simulationNetWeight==null){
             this.allowPrint = false
           } 
         } 
      })

      if(this.allowPrint){

        this.printService.printSubproduct(this.subproduct._id, this.templateId, this.subproduct.simulationNetWeight, this.tax, this.subproduct.location).subscribe(
           (data:any) => {
             var fileURL = URL.createObjectURL(data);
             window.open(fileURL);
           },
           (err) => {
        
             this.notification.error('Error', err || 'Server Error');
          })

      } else {
        this.notification.error('Error', this.noBatchWeight);
      }
  }

  public cleanAndResetFields(){
  	this.getTemplates();
  }

}
