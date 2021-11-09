import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { PrintService } from '../../global-utils/services/print.service';
import { TemplateService } from '../../global-utils/services/template.service'
import { Observable, Subject } from "rxjs/Rx";
import * as FileSaver from "file-saver";
import { FamilyService } from '../../libraries/family/family.service'
import { AppConfig } from "../../global-utils/services/appConfig.service";

class Type {
    name:string
    value: number

  constructor () {
  	this.name="";
    this.value=0
  }
}

@Component({
  selector: 'report-print-libraries',
  templateUrl: './report-print-libraries.component.html',
  styleUrls: ['./report-print-libraries.component.css']
})
export class ReportPrintLibrariesComponent implements OnInit {

  public filterLocations = [];
  public familyCategories;
  public familyCategory=null;
  public types = [
	  {name: 'family', value: 1},
	  {name: 'measurementUnit', value:2},
	  {name: 'process', value: 3},
	  {name: 'packFormat', value:4},
	  {name: 'utensil', value:5},
	  {name: 'checkpoint', value: 6},
	  {name: 'allergens', value:7}
  ];
  public templateTypes;
  public gastroOffer = '';
  public previousSearch;
  public loadingData=false;
  public templateId = null;
  public templateList;
  public tax;
	public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  };  
  public type;
  public filterFamily;
  public familyCategoryToSelect : boolean = false;
  public format;
  public formatOptions = []
  public template=null;

  constructor(
    public notification: NotificationsService, 
  	public printService: PrintService,
    public templateService: TemplateService,
    public appConfig: AppConfig,
    public familyService: FamilyService
    ){}

  ngOnInit() {

  	this.type = new Type();

  	this.format = ['.pdf'];
  	this.familyCategory = '';
  	this.formatOptions = [{label: 'CSV', value: '.csv'}, {label: 'PDF', value: '.pdf'}];
    this.getFamilyCategories();
    this.getTemplates();
  }

  public getFamilyCategories (){

  	this.familyService.getFamilyCategories().subscribe(
  		(data:any)=>{
  			this.familyCategories = data;
  			//console.log(this.familyCategories,'familyCategories')
  		},
      (err) => {
        this.notification.error('Error', err || 'Server Error');       }
    );

  }

  public templateSelected(e) {
    //LFOO is the family template
    if(this.template && this.template.templateCode == 'LF000') { this.familyCategoryToSelect = true; }
    else 
    { 
    	this.familyCategory = null;
    	this.familyCategoryToSelect = false; 
    }
  } 

  public getTemplates() { //: Observable <any>{

      this.templateService.getTemplates( 'library', '').subscribe(
        (data:any) => {
          this.templateList = data;
          //console.log(this.templateList,'templateList',this.templateId,'templateId')
        },
        (err) => {
          this.notification.error('Error', err || 'Error');
      })

  
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

     this.printService.printLibrary(this.template.subCategory, this.template._id, this.familyCategory, this.filterFamily, this.format).subscribe(
        (data:any) => {
          var fileURL = URL.createObjectURL(data);
          window.open(fileURL);
          this.familyCategoryToSelect = false;
          this.loadingData = false;
          this.type = new Type();
          this.familyCategory = null;
          this.format = ['.pdf'];
          this.template = null;

        },
        (err) => {
          this.notification.error('Error', err || 'Server Error');
      })
    
  }

  public onChangeFormat(e){

  	this.format = e.value;
  	//console.log(this.format,'format')

  }

  
}
