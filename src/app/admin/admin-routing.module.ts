import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../global-utils/services/auth-guard.service';
import { AdminComponent } from './admin.component'
import { UserListComponent } from './users/user-list/user-list.component'
import { UserTabComponent } from './users/user-tab/user-tab.component'
import { UserMainComponent } from './users/user-main/user-main.component'
import { LocationTreeComponent } from './locations/location-tree/location-tree.component'
import { RoleMainComponent } from './roles/role-main/role-main.component'
import { RoleListComponent } from './roles/role-list/role-list.component'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'admin', component: AdminComponent, canActivate: [AuthGuard],
  		children: [
  		  { path: '', redirectTo: 'user', pathMatch: 'full' },
    	  { path: 'user', component: UserListComponent, canActivate: [AuthGuard] },
        { path: 'user/new', component: UserMainComponent, data: { mode: 'new' }, canActivate: [AuthGuard] },
        { path: 'user/:id', component: UserTabComponent, data: { mode: 'view' }, canActivate: [AuthGuard] },
        { path: 'user/edit/:id', component: UserTabComponent,  data: { mode: 'edit' }, canActivate: [AuthGuard] },
        { path: 'role', component: RoleListComponent, canActivate: [AuthGuard] },
        { path: 'role/new', component: RoleMainComponent, data: { mode: 'new' }, canActivate: [AuthGuard] },
        { path: 'role/:id', component: RoleMainComponent, data: { mode: 'view' }, canActivate: [AuthGuard] },
        { path: 'role/edit/:id', component: RoleMainComponent,  data: { mode: 'edit' }, canActivate: [AuthGuard] },
        { path: 'location', component: LocationTreeComponent, canActivate: [AuthGuard] }
		  ]
	  }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }