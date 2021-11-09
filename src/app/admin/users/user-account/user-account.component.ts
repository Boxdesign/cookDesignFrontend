import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from "../user.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { AccountService } from "../../../global-utils/services/account.service";
import { Account } from '../../../global-utils/models/account.model'
import { RoleService } from "../../roles/role.service";
import { LocationService } from "../../../global-utils/services/location.service";

@Component({
  selector: 'user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {
@ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public allAccounts;
  public families;
  public filterLocations = [];
  public userLocations;
  public accountDeletedTitle;
  public accountDeletedContent;
  public accountUpdatedTitle;
  public accountUpdatedContent;
  public accountCreatedTitle;
  public accountCreatedContent;
  public account = new Account();
  public deleted;
  public _id: string;
  public mode;
  public status;
  public allLocations;
  public selectedLocations=[];
  clone=require('clone');
  public roles; // use roleService and getRoles to have an array with types of roles
  public numPages:number;
  public filterLocationModal;


  public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }

  constructor(
  	public userService : UserService, 
  	public translate: TranslateService, 
  	public router : Router, 
    public notification: NotificationsService, 
    public route: ActivatedRoute, 
    public accountService: AccountService, 
    public roleService: RoleService, 
    public locationService: LocationService
  ) {
    this.itemsPerPage = this.accountService.getItemsPerPage();
   }

  ngOnInit(){
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });

    this.route.params.subscribe(params => {this._id=params['id'];});
  	this.translation();
    this.getUserAccounts();
    this.getRoles();    
  }

  public translation(){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translate.get('admin.user.account.notifications.accountDeletedTitle').subscribe((res: string) => {
      this.accountDeletedTitle = res;
    });

    this.translate.get('admin.user.account.notifications.accountDeletedContent').subscribe((res: string) => {
      this.accountDeletedContent = res;
    });

    this.translate.get('admin.user.account.notifications.accountUpdatedTitle').subscribe((res: string) => {
      this.accountUpdatedTitle = res;
    });

    this.translate.get('admin.user.account.notifications.accountUpdatedContent').subscribe((res: string) => {
      this.accountUpdatedContent = res;
    });

    this.translate.get('admin.user.account.notifications.accountCreatedTitle').subscribe((res: string) => {
      this.accountCreatedTitle = res;
    });

    this.translate.get('admin.user.account.notifications.accountCreatedContent').subscribe((res: string) => {
      this.accountCreatedContent = res;
    });
  }

  public getUserAccounts(){
    this.accountService.getUserAccounts(
      false, 
      this._id, 
      this.itemsPerPage, 
      this.currentPage-1,
      this.filterText,
      this.sortField,
      this.sortOrder
    ).subscribe(
      (data:any) => {
        this.allAccounts = data.account;
        this.totalItems = data.totalElements;
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      }
    )
  }

  public getRoles() {
     this.roleService.getRoles(1000000,0,'','',1).subscribe(
       (data)=>{
           this.roles=data.roles;
       },(err)=>{
           this.notification.error('Error', err || 'Error');
       })
  }

  public saveAccount() {
    this.account.location = <any>this.selectedLocations;
    this.account.user= this._id;

    if (this.status == 'new') {
          this.accountService.addAccount(this.account).subscribe(
            (data) => {        
              this.notification.success(this.accountCreatedTitle, this.accountCreatedContent);
              this.getUserAccounts();
            },
            (err) => {
                this.notification.error('Error', err || 'Error');
            })

    } else if (this.status == 'edit') {

      this.accountService.editAccount(this.account).subscribe(
        (data) => {        
          this.notification.success(this.accountUpdatedTitle, this.accountUpdatedContent);
          this.getUserAccounts();
        },
        (err) => {
            this.notification.error('Error', err || 'Error');
        })
    }
 }

 public addClick(){
   this.account = new Account();
   this.account.role=this.roles[0];
   this.status='new';
 }

 public viewClick(){
   this.status='view';
 }

 public editClick(){
   this.status='edit';
 }

  public filterListByLocation(){
    this.getUserAccounts();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.filterLocations=[];
    this.locationComponent.resetCheckboxes();
    this.getUserAccounts();
  }

  public deleteAccount() {
    this.accountService.deleteAccount(this.account._id).subscribe(
      (data) => {
        this.notification.success(this.accountDeletedTitle, this.accountDeletedContent);
        this.getUserAccounts();      	
      },
      (err) => {
      	this.notification.error('Error', err || 'Error');
      })
  }

  public selectAccount(account){
    this.account=this.clone(account);
    this.selectedLocations=this.account.location;
  }

  public updateSelectedLocations(e) {
    this.selectedLocations=e;
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.accountService.saveCurrentPage(this.currentPage);
    this.getUserAccounts();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.accountService.saveItemsPerPage(item);
    this.getUserAccounts();
  }

  public searchAccounts(value: string){
    this.filterText=value;
    this.currentPage=1;
    this.accountService.saveSearchFilter(this.filterText);
    this.getUserAccounts();
  }

  public roleSelected(i){
    this.account.role=this.roles[i];
  }

  public activeSelected(value){
    value=='yes'? this.account.active=true : this.account.active=false;
  }

   public notificationDestroyed(e){
    //Nothing to do here
  }
}