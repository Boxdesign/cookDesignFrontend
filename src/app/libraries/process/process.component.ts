/**
 * Created by odin on 4/08/16.
 */
import {Component, ViewContainerRef, EventEmitter,Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProcessService} from "./process.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { Process } from '../../global-utils/models/process.model';
import { NotificationsService } from 'angular2-notifications';
import { PrintService } from '../../global-utils/services/print.service'
import { TemplateService } from '../../global-utils/services/template.service'
import * as FileSaver from "file-saver";

@Component({
  templateUrl: './process.component.html',
})
export class ProcessComponent {
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public orderBy: string = '';
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public processes;
  public viewEdit;
  public clone=require('clone');
  public forceLangRefresh = new EventEmitter();
  public processLang = {
    name : '',
    description: ''
  };

  public timeOut;
  public process;
  public status;
  public processUpdatedLang;
  public processAddedTitle;
  public processAddedContent;
  public processDeletedTitle;
  public processDeletedContent;
  public processEditedTitle;
  public processEditedContent;
  public numPages:number;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }
  

  constructor(public processService: ProcessService, public translateService: TranslateService, public  notification: NotificationsService, public printService : PrintService, public templateService : TemplateService) {
  }

  ngOnInit() {
    this.translate();
    this.getProcess();
  }

  public translate(){
    this.translateService.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translateService.get('process.notifications.processAddedTitle').subscribe((res: string) => {
      this.processAddedTitle = res;
    });

    this.translateService.get('process.notifications.processAddedContent').subscribe((res: string) => {
      this.processAddedContent = res;
    });  

    this.translateService.get('process.notifications.processDeletedTitle').subscribe((res: string) => {
      this.processDeletedTitle = res;
    });

    this.translateService.get('process.notifications.processDeletedContent').subscribe((res: string) => {
      this.processDeletedContent = res;
    });   

    this.translateService.get('process.notifications.processEditedTitle').subscribe((res: string) => {
      this.processEditedTitle = res;
    });

    this.translateService.get('process.notifications.processEditedContent').subscribe((res: string) => {
      this.processEditedContent = res;
    }); 
  }

  public langObjRefreshed(e) {
    this.processUpdatedLang = this.clone(e.langsObj);
  }

  public getProcess() {
    this.processService.getProcess(
      this.itemsPerPage, 
      this.currentPage-1, 
      this.sortField, 
      this.sortOrder, 
      this.filterText
      ).subscribe(
      (data: any) => {
        this.processes = data.process;
        this.totalItems = data.totalElements;
       },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    );
  }

  public cleanAndResetFields() {
    this.processLang= {
        name: '',
        description: ''
    };    
  }

  public selectProcess(process) {
    this.process = this.clone(process);
    this.processService.getLangsProcess(process._id).subscribe(
      (data:any) => {
        this.forceLangRefresh.emit(data.lang);
      })
  }

  public deleteProcess(_id, confirm) {
    this.processService.deleteProcess(_id).subscribe(
      (data) => {
        this.notification.success(this.processDeletedTitle, this.processDeletedContent);
        this.getProcess();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public saveProcess(){

    this.forceLangRefresh.emit(true);
    this.process.lang = this.clone(this.processUpdatedLang)

    if (this.status == 'new') {
      this.processService.addProcess(this.process).subscribe(
        (data)=>{
          this.getProcess();
        },(err) => {
          this.notification.error('Error', err || 'Server error');
      })
      
    } else if (this.status == 'edit') {
    this.processService.editProcess(this.process).subscribe(
      (data) => {
          this.getProcess();
          this.notification.success(this.processEditedTitle, this.processEditedContent);
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
    }
  }

  public addClick() {
    this.process = new Process();
    this.status='new';
    this.cleanAndResetFields();
  }

  public viewClick(){
    this.status='view';
  }

  public editClick(){
    this.status='edit';
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.getProcess();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.getProcess();
  }

  public searchProcesses(value: string){
    this.filterText=value;
    this.currentPage=1;
    this.getProcess();
    this.filterText='';
  }

  public viewProcess(){
    this.getProcess();
  }
}