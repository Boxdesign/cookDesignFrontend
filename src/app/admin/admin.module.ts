import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate/ng2-translate'
import { ModalModule, PaginationModule, TabsModule, TooltipModule } from 'ngx-bootstrap'
import { AppConfig } from '../global-utils/services/appConfig.service'
import { LayoutModule } from '../layout/layout.module';
import { GlobalUtilsModule } from '../global-utils/global-utils.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SelectModule } from 'ng2-select';
import { AdminRoutingModule } from './admin-routing.module';
import { FileUploadModule } from 'ng2-file-upload'
import { ComponentHelper } from '../global-utils/helpers/component.helper';
import { UserService } from './users/user.service';
import { RoleService } from './roles/role.service';
import { InputTextModule,
         ButtonModule,
         PanelModule,
         ListboxModule,
         ConfirmDialogModule,
         FieldsetModule,
         ToggleButtonModule,
         InputSwitchModule,
         DropdownModule,
         SelectButtonModule
       } from 'primeng/primeng';
import { UserTabComponent } from './users/user-tab/user-tab.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserMainComponent } from './users/user-main/user-main.component';
import { UserAccountComponent } from './users/user-account/user-account.component';
import { AdminComponent } from './admin.component';
import { LocationTreeComponent } from './locations/location-tree/location-tree.component';
import { UserPasswordComponent } from './users/user-password/user-password.component';
import { RoleListComponent } from './roles/role-list/role-list.component';
import { RoleMainComponent } from './roles/role-main/role-main.component';

@NgModule({
    declarations: [
        UserTabComponent,
        UserListComponent,
        UserMainComponent,
        UserAccountComponent,
        AdminComponent,
        LocationTreeComponent,
        UserPasswordComponent,
        RoleListComponent,
        RoleMainComponent
    ],
    providers: [
        ComponentHelper,
        UserService,
        RoleService
    ],
    imports: [
        AdminRoutingModule,
    	TranslateModule,
        PaginationModule,
        ModalModule,
        TabsModule,
        GlobalUtilsModule,
        CommonModule,
        FormsModule,
        LayoutModule,
        RouterModule,
        FileUploadModule,
        ListboxModule,
        PanelModule,
        ConfirmDialogModule,
        NgbModule,
        TooltipModule,
        SimpleNotificationsModule,
        FieldsetModule,
        ToggleButtonModule,
        InputSwitchModule,
        DropdownModule,
        SelectModule,
        SelectButtonModule
    ]
})
export class AdminModule {

}