import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PackagingsService } from '../packagings.service'
import { TemplateService } from '../../../global-utils/services/template.service'
import { PrintService } from '../../../global-utils/services/print.service'
import * as FileSaver from "file-saver";
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'packaging-print',
  templateUrl: './packaging-print.component.html',
  styleUrls: ['./packaging-print.component.css']
})
export class PackagingPrintComponent implements OnInit {

	@Input() public packagingOnEdit;
  @Input() public hidden = false;
  @Input() public printEvent = new Subject();

  @ViewChild('print') printModal 

	public templateId = null;
	public templateList;
  //public gastroComment=[];
  public tax;
  //public diet: string;
  public netWeigthValue: number;
  public filterLocation;

	public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  public observerLocation;
  public packagingName;  

  constructor(
  		public packagingService: PackagingsService, 
  		public templateService: TemplateService,
  		public notification: NotificationsService, 
  		public appConfig: AppConfig, 
  		public printService: PrintService,
  		public costFilterService: CostFilterService
  		) { }

  ngOnInit() {
    this.printEvent.subscribe((print:any)=>{
      this.packagingName = print.name;
      this.getPackaging(print)  
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

  public getPackaging(print){
    //Get the ingredient being edited.
    this.printModal.show()
    this.packagingService.getPackaging(print.id).subscribe(
      (data: any) => {
        this.packagingOnEdit = data;  
      })
  }

  public getTemplates(){
  	this.templateService.getTemplates('article', 'packaging').subscribe(
        (data:any) => {
        	this.templateList = data;
          console.log(this.templateList,'templatesss')
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
      },(err) => {
          this.notification.error('Error', err || 'Error');
      });

      this.printService.printArticle(this.packagingOnEdit._id,'packaging',this.templateId, this.tax, this.filterLocation).subscribe(
        (data:any) => {
        	var fileURL = URL.createObjectURL(data);
        	window.open(fileURL);
        },
        (err) => {
          //console.log(err, 'err')
        	this.notification.error('Error', err || 'Server Error');
      })
  }

  public cleanAndResetFields(){
  	this.getTemplates();
  }

}
