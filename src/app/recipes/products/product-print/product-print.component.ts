import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ProductsService } from '../products.service'
import { TemplateService } from '../../../global-utils/services/template.service'
import * as FileSaver from "file-saver";
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { PrintService } from '../../../global-utils/services/print.service'
import {TranslateService} from 'ng2-translate/ng2-translate';
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'product-print',
  templateUrl: './product-print.component.html',
  styleUrls: ['./product-print.component.scss']
})
export class ProductPrintComponent implements OnInit {

	@Input() public product;
  @Input() public hidden = false;
  @Input() public printEvent = new Subject();

  @ViewChild('print') printModal  

	public templateId = null;
	public templateList;
  public tax;
  public allowPrint = false
  public noBatchWeight
	public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  public filterLocation;
  public observerLocation;
  public productName;

  constructor(
  		public productService: ProductsService, 
  		public templateService: TemplateService,
  		public notification: NotificationsService, 
  		public appConfig: AppConfig, 
  		public printService: PrintService, 
  		public translate: TranslateService,
  		public costFilterService: CostFilterService) {

    this.translate.get('recipes.product.noBatchWeight').subscribe((res: string) => {
      this.noBatchWeight = res;
    });
  }

  ngOnInit() {
    this.printEvent.subscribe((print:any)=>{
      this.productName = print.name;
      this.getProduct(print)  
    }) 
    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocation = data;
    })

  	this.getTemplates();
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public getProduct(print){
    //Get the ingredient being edited.
    this.printModal.show()
    this.productService.getProduct(print.id, print.versionId).subscribe(
      (data: any) => {
        this.product = data[0];  
        this.product.simulationNetWeight = this.product.versions.batchWeight        
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
    
    this.appConfig.getSalesTax().subscribe(
      (data:any)=>{
        this.tax=data;
        ////console.log(this.tax,'taxxxxx')
      },(err) => {
          this.notification.error('Error', err || 'Server Error');
      })


      this.templateList.forEach((template)=>{

         if(this.templateId==template._id && template.lang[0].name == 'Producción'){

           if(this.product.simulationNetWeight==0 || this.product.simulationNetWeight==null){

             this.allowPrint = false

           } else {

             this.allowPrint = true
           }

         } else {

           this.allowPrint = true
         }

      })

      if(this.allowPrint==true){

        this.printService.printProduct(this.product._id, this.templateId, this.product.simulationNetWeight, this.tax, this.filterLocation).subscribe(
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