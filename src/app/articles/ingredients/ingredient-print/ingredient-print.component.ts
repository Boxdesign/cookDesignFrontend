import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IngredientsService } from '../ingredients.service'
import { TemplateService } from '../../../global-utils/services/template.service'
import { PrintService } from '../../../global-utils/services/print.service'
import * as FileSaver from "file-saver";
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'ingredient-print',
  templateUrl: './ingredient-print.component.html',
  styleUrls: ['./ingredient-print.component.css']
})
export class IngredientPrintComponent implements OnInit {

	@Input() public ingredientOnEdit;
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
  public ingredientName;  

  constructor(
  		public ingredientService: IngredientsService, 
  		public templateService: TemplateService,
  		public notification: NotificationsService, 
  		public appConfig: AppConfig, 
  		public printService: PrintService, 
  		public costFilterService: CostFilterService
  	) { }

  ngOnInit() {
    this.printEvent.subscribe((print:any)=>{
      this.ingredientName = print.name;
      this.getIngredient(print)  
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

  public getIngredient(print){
    //Get the ingredient being edited.
    this.printModal.show()
    this.ingredientService.getIngredient(print.id).subscribe(
      (data: any) => {
        this.ingredientOnEdit = data;  
      })
  }

  public getTemplates(){
  	this.templateService.getTemplates('article', 'ingredient').subscribe(
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
      },(err) => {
          this.notification.error('Error', err || 'Error');
      });
      this.printService.printArticle(this.ingredientOnEdit._id,'ingredient',this.templateId, this.tax, this.filterLocation).subscribe(
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
