import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { FamilyService } from '../../../libraries/family/family.service'
import { AppConfig } from '../../../global-utils/services/appConfig.service'
import { MeasurementUnitService } from '../../../libraries/measurement-unit/measurement-unit.service'
import { PackagingsService } from '../packagings.service'
import { TranslateService } from 'ng2-translate/ng2-translate'
import { NotificationsService } from 'angular2-notifications'
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'
import { Subject} from "rxjs/Rx";

@Component({
  selector: 'packaging-list',
  templateUrl: './packaging-list.component.html',
  styleUrls: ['./packaging-list.component.scss']
})
export class PackagingListComponent implements OnInit {
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public allPackagings;
  public packagingDeletedTitle;
  public packagingDeletedContent;
  public packagingOnEdit: any;
  public filterLocation;
  public numPages:number;
  public loading:boolean = true;
  public updating:boolean = false;
  public active:boolean = true;
  public filterActive: boolean = false;  

  public notificationOptions = {
     timeOut: 1500,
    position: ["top", "right"]
  }
  public observerLocation;
  public savedFilters;
  public print = new Subject();  
  public printData;  

  constructor(
  	public packagingService : PackagingsService, 
  	public translate: TranslateService, 
  	public router : Router, 
    public familyService: FamilyService, 
    public notification: NotificationsService, 
    public costFilterService: CostFilterService
  ) {}

  ngOnInit(){
    this.loading = true;
    this.updating = false;

    this.currentPage = this.packagingService.getCurrentPage();
    this.itemsPerPage = this.packagingService.getItemsPerPage();
    this.filterText = this.packagingService.getSearchFilter(); 
    this.savedFilters = this.packagingService.getSavedFilters();
    ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocation = data;
        this.currentPage = this.packagingService.getCurrentPage();
        this.itemsPerPage = this.packagingService.getItemsPerPage();
        this.filterText = this.packagingService.getSearchFilter();
        this.savedFilters = this.packagingService.getSavedFilters();
        ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)         
        this.getPackagings();
    })

    this.translation();
    this.getPackagings();
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }

  public translation(){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
      //console.log('translation: '+ res);
    });

     this.translate.get('articles.packagings.notifications.packagingDeletedTitle').subscribe((res: string) => {
      this.packagingDeletedTitle = res;
    });

     this.translate.get('articles.packagings.notifications.packagingDeletedContent').subscribe((res: string) => {
      this.packagingDeletedContent = res;
    });
  }

  public printPackaging(packaging){
    this.printData = {  
      id: packaging._id,
      name: packaging.lang.name, 
    } 
    this.print.next(this.printData)
  }

  public getPackagings(){
    this.updating=true;
    this.packagingService.getPackagings(
      this.itemsPerPage, 
      this.currentPage-1, 
      this.filterText,
      this.sortField,
      this.sortOrder,
      this.filterLocation,
      this.active
    ).subscribe(
      (data:any) => {
        this.allPackagings = data.packagings;
        this.totalItems = data.totalElements;
        this.loading = false;
        this.updating = false;
      },
      (err) => {
          this.notification.error('Error', err || 'Error');
        })
  }

  public toggleActiveState(){

  	if(this.filterActive) {
  		if(this.active) {
  			this.active = false;
  		}
  		else 
  		{ 
  			this.filterActive = false;
  			this.active=null;
  		}
  	}
  	else
  	{
  		this.filterActive = true; 
  		this.active=true;
  	}
  	this.saveFilters();
  }

  public editPackaging(_id){
    this.router.navigate(['./articles/packagings/edit', _id, {tab: 'Packaging'}]);
  }

  public viewPackaging(_id){
    this.router.navigate(['./articles/packagings/',_id]);
  }

  public addPackaging(_id?){
    this.router.navigate(['./articles/packagings/new']);
  }
  public selectedPackagingToEdit(packaging){
    this.packagingOnEdit=packaging;
  }

  public deletePackaging(_id?,confirm?) {
    this.packagingService.deletePackaging(this.packagingOnEdit._id).subscribe(
      (data) => {
        this.notification.success(this.packagingDeletedTitle, this.packagingDeletedContent);
        //console.log(this.notification,'111')
        this.getPackagings();

      },
      (err) => {
          this.notification.error('Error', err || 'Error');
        })
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.packagingService.saveCurrentPage(this.currentPage);
    this.getPackagings();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.packagingService.saveItemsPerPage(item);
    this.currentPage = 1;
    this.getPackagings();
  }

  public searchPackagings(value: string){
    this.filterText=value;
    this.packagingService.saveSearchFilter(this.filterText);
    this.currentPage=1;
    this.getPackagings();
  }

  public saveFilters(){
    this.packagingService.saveFilters(this.sortField, this.sortOrder, this.active, this.filterActive);
    this.getPackagings();
  }
}