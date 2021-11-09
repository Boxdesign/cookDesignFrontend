import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompassService } from "../../../global-utils/services/compass.service";
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { ProviderService } from "../../../providers/providers/provider.service";
import { SelentaImportService } from '../selenta-import.service';
import { LocationService } from "../../../global-utils/services/location.service";
import { Observable, Subject } from "rxjs/Rx";
import * as FileSaver from "file-saver";

@Component({
  selector: 'selenta-import-new-providers',
  templateUrl: './selenta-import-new-providers.component.html',
  styleUrls: ['./selenta-import-new-providers.component.scss']
})
export class SelentaImportNewProvidersComponent implements OnInit {
  
  @ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public refresh = new Subject();
  public clone = require('clone');
  private filterLocations = [];
  public totalProviders: number = 0;
  public providersCurrentPage: number = 1; //providersCurrentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public providersPerPage: number = 5; //Default items per page
  public providersFilterText: string = '';
  public providersSortField:string='';
  public providersSortOrder:number=1;
  public searchBoxLabel: string;
  public providers;
  public provider;
  public providerDeletedTitle;
  public providerDeletedContent;
  public providersLinkedTitle;
  public providersLinkedContent;
  public providersNumPages:number;
  public costFilterSet:boolean=false; 
  public savedLocations = [];
  public selentaNewProviders:any[] =[]; 
  public selentaProvidersCurrentPage: number = 1;
  public selentaProvidersPerPage: number = 5;
  public selentaProvidersFilterText: string ='';
  public selentaProviderSelected;
  public selentaProvidersSortField:string='';
  public selentaProvidersSortOrder:number=1;
  public providerSelected;
  public selentaTotalProviders:number = 0;
  public selentaProvidersNumPages:number;
  public loading:boolean = true;
  private loadingCounter:number = 0;
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }

  constructor(
    public notification: NotificationsService,
    public translateService: TranslateService,
    public providerService: ProviderService,
    public router : Router,
    public compassService: CompassService,
    public locationService: LocationService,
    public selentaImportService: SelentaImportService
    ){}

  ngOnInit() {
    this.providersCurrentPage = this.providerService.getCurrentPage();
    this.providersFilterText = this.providerService.getSearchFilter();
    this.translation();
    this.getSelentaLocations();
    this.getSelentaSapNewProviders();
  }

  /*Get Hotel Sofia locations*/
  private getSelentaLocations(){
    this.locationService.getAllLocations().subscribe(
      (data: any)=> {
        this.filterLocations = [];
        this.savedLocations = [];
        for (var location of data[0].companies) {
          if(location.referenceNumber === 'D600') {
            /*Add locations*/
            for (var bussines of location.businessUnits) {
              this.filterLocations.push(bussines._id);
              this.savedLocations.push(bussines._id);
            }
              this.filterLocations.push(location._id);
              this.savedLocations.push(location._id);
          }
        }
        this.getProviders();
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getProviders(){
    this.providerService.getProviders(
      this.providersPerPage, 
      this.providersCurrentPage-1,
      this.providersFilterText, 
      this.filterLocations,
      this.providersSortField,
      this.providersSortOrder,
      true
    ).subscribe(
      (data:any) => {
        this.providers = data.providers;
        this.totalProviders = data.totalElements;
        this.loadingFinish();
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      }
    )
  }

  public getSelentaSapNewProviders() {
    this.selentaImportService.getSelentaSapNewProviders(
      this.selentaProvidersPerPage,
      this.selentaProvidersCurrentPage-1,
      this.selentaProvidersFilterText,
      this.selentaProvidersSortField,
      this.selentaProvidersSortOrder
    ).subscribe(
    (res:any) => {
      //console.log(res);
      this.selentaProviderSelected = null;
      this.selentaNewProviders = res.providers;
      this.selentaTotalProviders = res.totalElements;
      this.loadingFinish();
    },
    (err) => {
      this.notification.error('Error', err || 'Error');
      let timeout = setTimeout(() => {
        this.router.navigate(['/import']);
      }, 1500);
    });
  }

  private loadingFinish() {
    this.loadingCounter++
    if(this.loadingCounter === 2) this.loading = false;
  }

  private translation(){
    this.translateService.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translateService.get('provider.provider.notifications.providerDeletedTitle').subscribe((res: string) => {
      this.providerDeletedTitle = res;
    });

    this.translateService.get('provider.provider.notifications.providerDeletedContent').subscribe((res: string) => {
      this.providerDeletedContent = res;
    });

    this.translateService.get('selenta-import.providersLinkedTitle').subscribe((res: string) => {
      this.providersLinkedTitle = res;
    });

    this.translateService.get('selenta-import.providersLinkedContent').subscribe((res: string) => {
      this.providersLinkedContent = res;
    });
  }

  public linkProviders() {
    //console.log(this.providerSelected, this.selentaProviderSelected);
    this.providerSelected.externalReference = this.selentaProviderSelected.provider.LIFNR;
    //console.log(this.providerSelected);
    this.providerService.editProvider(this.providerSelected).subscribe(
    (res) => {
      this.selentaImportService.deleteSelentaSapProvider(this.selentaProviderSelected._id).subscribe(
      (res) => {
        this.notification.success(this.providersLinkedTitle, this.providersLinkedContent);
        this.getProviders();
        this.getSelentaSapNewProviders();
      },(err) => {
        this.notification.error('Error', err || 'Error');
      });
    },(err) => {
      this.notification.error('Error', err || 'Error');
    });
  }

  /*---------------------------------New Selenta providers table functions--------------------------------------*/

  public selectSelentaProvider(provider) {
    this.selentaProviderSelected = provider;
    //console.log(this.selentaProviderSelected);
  }
  public filterSelentaProviders(text:string) {
    this.selentaProvidersFilterText=text;
    this.selentaProvidersCurrentPage=1;
    this.getSelentaSapNewProviders();
  }

  public updateSelentaProvidersPerPage(item: number) {
    this.selentaProvidersPerPage = item;
    this.selentaProvidersCurrentPage = 1;
    this.getSelentaSapNewProviders();
  }

  public selentaPageHasChanged(data) {
    this.selentaProvidersPerPage = data.itemsPerPage;
    this.selentaProvidersCurrentPage = data.page;
    this.getSelentaSapNewProviders();
  }


  /*----------------------------------------Providers table functions----------------------------------------*/

  public searchProviders(value: string){
    this.providersFilterText=value;
    this.providerService.saveSearchFilter(this.providersFilterText);
    this.providersCurrentPage=1;
    this.getProviders();
  }

  public updateItemsPerPage(item: number) {
    this.providersPerPage = item;
    this.providerService.saveItemsPerPage(item);
    this.providersCurrentPage = 1;
    this.getProviders();
  }

  public filterListByLocation(){
    this.costFilterSet=true;
    this.savedLocations = [];
    this.savedLocations = this.savedLocations.concat(this.filterLocations)
    this.providerService.saveLocationFilter(this.savedLocations);
    this.getProviders();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.costFilterSet=false;
    this.savedLocations=[];
    this.refresh.next([]);
    this.filterLocations=[];
    this.getSelentaLocations();
  }

  public cancelSelection() {
    this.refresh.next(this.clone(this.savedLocations));
    this.filterLocations = [];
    this.filterLocations = this.filterLocations.concat(this.savedLocations);
  }

  public viewProvider(_id){
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-new-providers','','','');
    this.router.navigate(['./providers/provider/',_id]);
  }

  public editProvider(_id){
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-new-providers','','','');
    this.router.navigate(['./providers/provider/edit', _id]);   
  }

  public selectProviderToEdit(provider){
    this.provider=provider;
  }

  public deleteProvider() {
    this.providerService.deleteProvider(this.provider._id).subscribe(
      (data) => {
        this.notification.success(this.providerDeletedTitle, this.providerDeletedContent);
        this.getProviders();        
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })
  }

  public addProvider(_id?){
    this.compassService.saveRedirectData('/import/selenta-import/selenta-import-new-providers','','','');
    this.router.navigate(['./providers/provider/new']);
  }

  public pageHasChanged(data) {
    this.providersPerPage = data.itemsPerPage;
    this.providersCurrentPage = data.page;
    this.providerService.saveCurrentPage(this.providersCurrentPage);
    this.getProviders();
  }

}
