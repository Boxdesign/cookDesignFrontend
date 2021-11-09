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
import { FileUploadModule } from 'ng2-file-upload'
import { ComponentHelper } from '../global-utils/helpers/component.helper';
import { ImportRoutingModule } from './import-routing.module';
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
import { ImportComponent } from './import.component';
import { SelentaImportModule } from './selenta-import/selenta-import.module';

@NgModule({
    declarations: [
        ImportComponent
    ],
    providers: [
        ComponentHelper
    ],
    imports: [
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
        SelectButtonModule,
        ImportRoutingModule,
        SelentaImportModule
    ]
})
export class ImportModule {

}