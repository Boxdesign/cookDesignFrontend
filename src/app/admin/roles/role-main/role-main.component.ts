import { Input, Output, Component, OnInit, ViewContainerRef, EventEmitter} from '@angular/core';
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { RoleService } from "../role.service";
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Role } from '../../../global-utils/models/role.model';
import { Observable, Subject, ReplaySubject} from "rxjs/Rx";

@Component({
  selector: 'role-main',
  templateUrl: './role-main.component.html',
  styleUrls: ['./role-main.component.scss']
})
export class RoleMainComponent implements OnInit {

	public mode;
  public id: string;
  public role;
  public apiUrl;
  public roleCreatedTitle;
  public roleCreatedContent;
  public roleUpdatedTitle;
  public roleUpdatedContent;
  public entities;
  public entityReady = new ReplaySubject(1);;
  public roleReady = new ReplaySubject(1);
  public rolePopulated=false;
 	public checked=true;

  public options = {
    timeOut: 1500,
    position: ["top", "right"]
  }

  constructor(public router: Router, public appConfig: AppConfig, public roleService: RoleService, 
  	public route: ActivatedRoute, public notification: NotificationsService, public translate: TranslateService) { }

  ngOnInit() {
  	this.apiUrl = this.appConfig.apiUrl;

  	this.route.params.subscribe(params => {this.id=params['id'];});

    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });

    this.translation();

    //Get role entities
  	this.appConfig.getEntities().subscribe(
  		(data)=>{
  			this.entities = data;
  			this.entityReady.next(data)
  		})

  	//Set role
    this.entityReady.subscribe((entities:any) => {
    	this.role = new Role();
      this.role.entities = entities; //includes name and type, but not permissions.
      this.role.entities.forEach((entity)=> { //initialize permissions to false
      	entity.permissions = {};
      	entity.permissions.read=false;
      	entity.permissions.edit=false;
      	entity.permissions.delete=false;
      })
  		if (this.mode == 'edit' || this.mode == 'view') this.getRole();
	  })

	  //Populate role 
    this.roleReady.subscribe((role:any) => {
    	this.role.name = role.name;
    	this.role._id= role._id;

  		this.role.entities.find((entity, index) => { //populate role with obtained permissions
  			//match entity in edited role
  			let entityMatch = role.entities.filter((e)=> {
  				return entity.name == e.name;
  			})

  			//update entity
  			if(entityMatch && entityMatch[0]!=undefined) { 
  				if(entityMatch[0].permissions) {
  					// console.log(entityMatch[0].permissions.read, 'entitymatch read')
  					// console.log(entityMatch[0].permissions.edit, 'entitymatch edit')
  					// console.log(entityMatch[0].permissions.delete, 'entitymatch delete')
    				entity.permissions = entityMatch[0].permissions; 
    			}
  			}
  		})
    }) 
  }  


  public translation(){
    this.translate.get('admin.role.notifications.roleCreatedTitle').subscribe((res: string) => {
      this.roleCreatedTitle = res;
    });

    this.translate.get('admin.role.notifications.roleCreatedContent').subscribe((res: string) => {
      this.roleCreatedContent = res;
    });

    this.translate.get('admin.role.notifications.roleUpdatedTitle').subscribe((res: string) => {
      this.roleUpdatedTitle = res;
    });

    this.translate.get('admin.role.notifications.roleUpdatedContent').subscribe((res: string) => {
      this.roleUpdatedContent = res;
    }); 
  }

  public getRole(){
    this.roleService.getRole(this.id).subscribe(
      (data) => {
        this.roleReady.next(data);
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      });  
  }

  public saveRole() {

    if (this.mode == 'new') {

      this.roleService.addRole(this.role).subscribe(
        (data) => {        
          this.notification.success(this.roleCreatedTitle, this.roleCreatedContent);
        },
        (err) => {
            this.notification.error('Error', err || 'Error');
        })

    } else if (this.mode == 'edit') {

      this.roleService.editRole(this.role).subscribe(
        (data) => {        
          this.notification.success(this.roleUpdatedTitle, this.roleUpdatedContent);
        },
        (err) => {
            this.notification.error('Error', err || 'Error');
        })
  	}
  }

  public notificationDestroyed(e){
    if(e.type!="error"){
      	this.router.navigate(['/admin/role']);
		}
  }

  public editRole() {
    this.router.navigate(['./admin/role/edit/',this.id]);
  }

}
