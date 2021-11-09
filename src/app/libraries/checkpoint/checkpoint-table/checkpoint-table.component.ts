/**
 * Created by odin on 4/08/16.
 */
import {Component, ViewContainerRef, EventEmitter, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CheckpointService} from "../checkpoint.service";
import { TranslateService } from 'ng2-translate/ng2-translate'
import { NotificationsService } from 'angular2-notifications'
import { PrintService } from '../../../global-utils/services/print.service'
import { TemplateService } from '../../../global-utils/services/template.service'
import * as FileSaver from "file-saver";

@Component({
  selector: 'checkpoint-table',
  templateUrl: './checkpoint-table.component.html',
  inputs: ['type', 'title']
})
export class CheckpointTableComponent {
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public sortField:string='';
  public sortOrder:number=1;
  public filterText: string = '';
  public searchBoxLabel: string;
  public numPages:number;

  public type: string;
  public title: string;

  public checkpoints;

  public checkpointTmp = {
    name: '',
    description: ''
  };

  public checkpointsLangs: any[] = [];

  public editedCheckpoint: any[] = [];

  public checkpointOnEdit: any;

  public forceRefresh = new EventEmitter();
  public forceRefreshForEdit = new EventEmitter();
  public checkpointCreatedTitle: string;
  public checkpointCreatedContent: string;
  public checkpointEditedTitle: string;
  public checkpointEditedContent: string;
  public checkpointDeletedTitle: string;
  public checkpointDeletedContent: string;
  public notificationOptions = {
       timeOut: 1500,
      position: ["top", "right"]
    }

  constructor(public checkpointService: CheckpointService, public translate: TranslateService, public notification: NotificationsService, public printService: PrintService, public templateService : TemplateService) {

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
      //console.log('translation: '+ res);
    });

    this.translate.get('checkpoint.notifications.checkpointCreatedTitle').subscribe((res: string) => {
      this.checkpointCreatedTitle = res;
      //console.log('translation: '+ res);
    });

    this.translate.get('checkpoint.notifications.checkpointCreatedContent').subscribe((res: string) => {
      this.checkpointCreatedContent = res;
      //console.log('translation: '+ res);
    });

    this.translate.get('checkpoint.notifications.checkpointEditedTitle').subscribe((res: string) => {
      this.checkpointEditedTitle = res;
      //console.log('translation: '+ res);
    });

    this.translate.get('checkpoint.notifications.checkpointEditedContent').subscribe((res: string) => {
      this.checkpointEditedContent = res;
      //console.log('translation: '+ res);
    });

    this.translate.get('checkpoint.notifications.checkpointDeletedTitle').subscribe((res: string) => {
      this.checkpointDeletedTitle = res;
      //console.log('translation: '+ res);
    });

    this.translate.get('checkpoint.notifications.checkpointDeletedContent').subscribe((res: string) => {
      this.checkpointDeletedContent = res;
      //console.log('translation: '+ res);
    });

  }

  ngOnInit() {

    this.getCheckpoints();

  }

  public langObjRefreshed(e) {
    this.checkpointsLangs = e.langsObj;
  }

  public getCheckpoints() {

    this.checkpointService.getCheckpoint(this.type,this.itemsPerPage,this.currentPage-1,this.sortField,this.sortOrder,this.filterText).subscribe(
      (data: any) => {
        this.checkpoints = data.checkpoints;
        this.totalItems = data.totalElements;
        // console.log('this.checkpoints');
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
    });

  }

  public addClick() {
    this.checkpointTmp = {
          name: '',
          description: ''
        };
  }
  
  public addCheckpoint() {
    this.forceRefresh.emit(true);

    let checkpointObj = { lang: this.checkpointsLangs, type: this.type };

    this.checkpointService.addCheckpoint(checkpointObj).subscribe(
      (data) => {
        this.notification.success(this.checkpointCreatedTitle,this.checkpointCreatedContent);
        this.checkpointTmp = {
          name: '',
          description: ''
        };
        this.getCheckpoints();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    );
  }

  public selectCheckpointToEdit(checkpoint) {
    this.checkpointOnEdit = JSON.parse(JSON.stringify(checkpoint));

    this.checkpointService.getLangsCheckpoint(checkpoint._id).subscribe(
      (data: any) => {
        this.editedCheckpoint = data.lang;
        this.forceRefreshForEdit.emit(this.editedCheckpoint);
      }
    )
  }

  public editCheckpoint() {
    this.forceRefreshForEdit.emit(true);

    this.checkpointOnEdit.lang = this.checkpointsLangs;
    this.checkpointService.editCheckpoint(this.checkpointOnEdit).subscribe(
      (data) => {
        this.checkpointTmp = {
          name: '',
          description: ''
        };
        this.notification.success(this.checkpointEditedTitle,this.checkpointEditedContent);
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    )
  }

  public deleteCheckpoint(_id, confirm) {
    this.checkpointService.deleteCheckpoint(_id).subscribe(
      (data) => {
        this.notification.success(this.checkpointDeletedTitle,this.checkpointDeletedContent);
        this.getCheckpoints();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      }
    )
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.getCheckpoints();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.getCheckpoints();
  }

  public searchCheckpoints(value: string){
    this.filterText=value;
    this.currentPage=1;
    this.getCheckpoints();
    this.filterText='';
  }
  
  public viewCheckpoint(){}

  public cleanAndResetFields(){

  }
}
