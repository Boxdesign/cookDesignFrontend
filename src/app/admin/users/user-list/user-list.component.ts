import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from "../user.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { NotificationsService } from 'angular2-notifications'

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
@ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public allUsers;
  public families;
  public filterLocations = [];
  public userLocations;
  public userDeletedTitle;
  public userDeletedContent;
  public user;
  public deleted;
  public numPages:number;

  public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  public savedFilters;

  constructor(public userService : UserService, public translate: TranslateService, public router : Router, 
    public notification: NotificationsService, public route: ActivatedRoute) {
   }

  ngOnInit(){
    this.currentPage = this.userService.getCurrentPage();
    this.itemsPerPage = this.userService.getItemsPerPage();
    this.filterText = this.userService.getSearchFilter();   
    this.savedFilters = this.userService.getSavedFilters();
    ( { sortOrder: this.sortOrder, sortField: this.sortField} = this.savedFilters)
  	this.translation();
    this.getUsers();
  }

  public translation(){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translate.get('admin.user.notifications.userDeletedTitle').subscribe((res: string) => {
      this.userDeletedTitle = res;
    });

    this.translate.get('admin.user.notifications.userDeletedContent').subscribe((res: string) => {
      this.userDeletedContent = res;
    });
  }

  public getUsers(){
    this.userService.getUsers(
      this.itemsPerPage, 
      this.currentPage-1, 
      this.filterText, 
      this.filterLocations,
      this.sortField,
      this.sortOrder
    ).subscribe(
      (data:any) => {
        this.allUsers = data.users;
        this.totalItems = data.totalElements;
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      }
    )
  }

  public filterListByLocation(){
    this.getUsers();
  }

  public updateFilterLocations(e) {
    this.filterLocations=e;
  }

  public resetFilterLocation() {
    this.filterLocations=[];
    this.locationComponent.resetCheckboxes();
    this.getUsers();
  }

  public editUser(_id){
    this.router.navigate(['./admin/user/edit', _id]);   
  }

  public viewUser(_id){
    this.router.navigate(['./admin/user/',_id]);
  }

  public addUser(_id?){
    this.router.navigate(['./admin/user/new']); 
  }

  public deleteUser() {
    this.userService.deleteUser(this.user._id).subscribe(
      (data) => {
        this.notification.success(this.userDeletedTitle, this.userDeletedContent);
        this.getUsers();      	
      },
      (err) => {
      	this.notification.error('Error', err || 'Error');
      })
  }

  public selectUserToEdit(user){
    this.user=user;
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.userService.saveCurrentPage(this.currentPage);
    this.getUsers();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.userService.saveItemsPerPage(item);
    this.getUsers();
  }

  public searchUsers(value: string){
    this.filterText=value;
    this.currentPage=1;
    this.userService.saveSearchFilter(this.filterText);
    this.getUsers();
  }

  public saveFilters(){
    this.userService.saveFilters(this.sortField, this.sortOrder);
    this.getUsers();
  }
}