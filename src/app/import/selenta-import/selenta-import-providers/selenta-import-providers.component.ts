import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from "../../../global-utils/services/compass.service";
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { SelentaImportService } from '../selenta-import.service';
import { LocationService } from "../../../global-utils/services/location.service";
import { Observable, Subject } from "rxjs/Rx";
import * as FileSaver from "file-saver";

@Component({
  selector: 'selenta-import-providers',
  templateUrl: './selenta-import-providers.component.html',
  styleUrls: ['./selenta-import-providers.component.scss']
})
export class SelentaImportProvidersComponent implements OnInit {
  
  public searchBoxLabel: string;
  public selentaProviders:any[] =[]; 
  public selentaProviderSelected;
  public selentaProvidersCurrentPage: number = 1;
  public selentaProvidersPerPage: number = 5;
  public selentaProvidersFilterText: string ='';
  public selentaTotalProviders:number = 0;
  public selentaProvidersNumPages:number;
  public selentaSortField:string = '';
  public selentaSortOrder:number = 1;
  public loading:boolean = true;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }

  constructor(
    public notification: NotificationsService,
    public translateService: TranslateService,
    public router : Router,
    public compassService: CompassService,
    public locationService: LocationService,
    public selentaImportService: SelentaImportService
    ){}

  ngOnInit() {
    this.getSelentaSapProviders();
    this.translation();
  }

  private translation(){
    this.translateService.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });
  }

  public getSelentaSapProviders() {
    this.selentaImportService.getSelentaSapProviders(
      this.selentaProvidersPerPage,
      this.selentaProvidersCurrentPage-1,
      this.selentaProvidersFilterText,
      this.selentaSortField,
      this.selentaSortOrder
    ).subscribe(
      (res:any) => {
        this.selentaProviders = res.providers;
        this.selentaTotalProviders = res.totalElements;
        this.loading = false;
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      });
  }

  public navigateTo(_id:string) {
    this.compassService.saveRedirectData('import/selenta-import/selenta-import-providers','','','');
    this.router.navigate(['./providers/provider/',_id]);
  }

  /*---------------------------------Selenta providers table functions--------------------------------------*/

  public filterSelentaProviders(text:string) {
    this.selentaProvidersFilterText=text;
    this.selentaProvidersCurrentPage=1;
    this.getSelentaSapProviders();
  }

  public updateSelentaProvidersPerPage(item: number) {
    this.selentaProvidersPerPage = item;
    this.selentaProvidersCurrentPage = 1;
    this.getSelentaSapProviders();
  }

  public selentaPageHasChanged(data) {
    this.selentaProvidersPerPage = data.itemsPerPage;
    this.selentaProvidersCurrentPage = data.page;
    this.getSelentaSapProviders();
  }

}
