import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from "../../../global-utils/services/compass.service";
import { SelentaImportService } from '../selenta-import.service';
import { Observable, Subject } from "rxjs/Rx";
import * as FileSaver from "file-saver";

@Component({
  selector: 'selenta-import-conflicts',
  templateUrl: './selenta-import-conflicts.component.html',
  styleUrls: ['./selenta-import-conflicts.component.scss']
})
export class SelentaImportConflictsComponent implements OnInit {
  
  public loading:boolean = true;
  public articlesConflicts:any[]=[];
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }
  public searchBoxLabel;
  public selentaArticlesFilterText;

  constructor(
    public notification: NotificationsService,
    public translateService: TranslateService,
    public router : Router,
    public compassService: CompassService,
    public selentaImportService: SelentaImportService
    ){}

  ngOnInit() {

    this.selentaArticlesFilterText = this.selentaImportService.getConflictLogSearchFilter();
  	this.translation();
    this.getSelentaUpdatedArticles();
  }

  private translation(){
    this.translateService.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });
  }  

  private getSelentaUpdatedArticles () {
    this.selentaImportService.getSelentaArticlesConflicts(this.selentaArticlesFilterText).subscribe(
    (res)=>{
      //console.log(res);
      this.articlesConflicts = [];
      this.articlesConflicts = res;
      this.loading = false;
    },(err)=>{
        this.notification.error('Error', err || 'Server error');
    });
  }

  public goToArticle(conflictArticle){
  	let MATNR = conflictArticle.article.MATNR;
  	let LIFNR = conflictArticle.provider? conflictArticle.provider.LIFNR : '';

    this.router.navigate(['/import/selenta-import/selenta-import-articles/', MATNR , {LIFNR: LIFNR}]);
  }

  public navigateTo(_id:string) {
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-conflicts','','','');
    this.router.navigate(['./providers/article/',_id]);
  }

  public filterSelentaArticles(text:string) {
    this.selentaArticlesFilterText=text;
    this.selentaImportService.saveConflictLogSearchFilter(text)
    this.getSelentaUpdatedArticles();
  }  

}
