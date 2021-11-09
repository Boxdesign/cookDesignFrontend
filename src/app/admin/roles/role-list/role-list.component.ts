import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from "../role.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocationFilterComponent } from "../../../global-utils/components/location-filter/location-filter.component";
import { NotificationsService } from 'angular2-notifications'

@Component({
  selector: 'role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
	@ViewChild(LocationFilterComponent)
  public locationComponent: LocationFilterComponent;
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public searchBoxLabel: string;
  public families;
  public filterLocations = [];
  public roleDeletedTitle;
  public roleDeletedContent;
  public roles;
  public role;
  public numPages:number;
  public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  public savedFilters;

  constructor(public roleService : RoleService, public translate: TranslateService, public router : Router, 
    public notification: NotificationsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.currentPage = this.roleService.getCurrentPage();
    this.itemsPerPage = this.roleService.getItemsPerPage();
    this.filterText = this.roleService.getSearchFilter();   
    this.savedFilters = this.roleService.getSavedFilters();
    ( { sortOrder: this.sortOrder, sortField: this.sortField} = this.savedFilters)
  	this.translation();
  	this.getRoles();
  }

  public translation(){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.translate.get('admin.role.notifications.roleDeletedTitle').subscribe((res: string) => {
      this.roleDeletedTitle = res;
    });

    this.translate.get('admin.role.notifications.roleDeletedContent').subscribe((res: string) => {
      this.roleDeletedContent = res;
    });
  }

  public getRoles(){
  	this.roleService.getRoles(
      this.itemsPerPage, 
      this.currentPage-1,
      this.filterText,
      this.sortField,
      this.sortOrder
    ).subscribe(
  		(data)=>{
  			this.roles=data.roles;
        this.totalItems = data.totalElements;
  		},(err) => {
        this.notification.error('Error', err || 'Error');
  		})
  }

  public editRole(_id){
    this.router.navigate(['./admin/role/edit', _id]);   
  }

  public viewRole(_id){
    this.router.navigate(['./admin/role/',_id]);
  }

  public addRole(_id?){
    this.router.navigate(['./admin/role/new']); 
  }

  public deleteRole() {
    this.roleService.deleteRole(this.role._id).subscribe(
      (data) => {
        this.notification.success(this.roleDeletedTitle, this.roleDeletedContent);
        this.getRoles();      	
      },
      (err) => {
      	this.notification.error('Error', err || 'Error');
      })
  }

  public selectRoleToEdit(role){
    this.role=role;
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.roleService.saveCurrentPage(this.currentPage);
    this.getRoles();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.roleService.saveItemsPerPage(item);
    this.getRoles();
  }

  public searchRoles(value: string){
    this.filterText=value;
    this.currentPage=1;
    this.roleService.saveSearchFilter(this.filterText);
    this.getRoles();
  }

  public saveFilters(){
    this.roleService.saveFilters(this.sortField, this.sortOrder);
    this.getRoles();
  }
}
