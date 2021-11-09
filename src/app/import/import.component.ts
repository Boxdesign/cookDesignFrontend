import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocationService } from "../global-utils/services/location.service";

@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  public showSideMenu:boolean;
  public locations:any[];

  public searchBoxLabel: string;
  private locationsFilterText:string ;
  public locationsCurrentPage:number = 1;
  public locationsPerPage: number = 10;
  public totalLocations: number = 0;

  constructor(
    public notification: NotificationsService,
    public translateService: TranslateService,
    public router : Router,
    public locationService: LocationService
  ){}

  ngOnInit() {
    this.translation();
    this.getLocations();
  }

  public showSideBarMenu(show:boolean) {
	  this.showSideMenu = show;
  }

  private translation(){
    this.translateService.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });
  }

  private getLocations(){
    this.locationService.getUserLocations().subscribe(
    (data: any)=> {
      this.locations = [];
      if(data.length>0 && data[0].companies) {
        this.locations = data[0].companies;
        this.totalLocations = data[0].companies.length;
      }
    },
    (err) => {
      this.notification.error('Error', err || 'Server error');
    });
  }


  /*---------------------------------Locations table functions--------------------------------------*/

  public selectLocation(location) {
    if(location.referenceNumber === 'D600') this.router.navigate(['./import/selenta-import']);
  }

  public filterLocations(text:string) {
    this.locationsFilterText=text;
    this.locationsCurrentPage=1;
    this.getLocations();
    this.locationsFilterText='';
  }

  public updateLocationsPerPage(item: number) {
    this.locationsPerPage = item;
    this.locationsCurrentPage = 1;
    this.getLocations();
  }

  public locationPageHasChanged(data) {
    this.locationsPerPage = data.itemsPerPage;
    this.locationsCurrentPage = data.page;
    this.getLocations();
  }

}