import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate/ng2-translate'
import { ModalModule, PaginationModule, TabsModule, TooltipModule } from 'ngx-bootstrap'
import { AppConfig } from '../../global-utils/services/appConfig.service'
import { LayoutModule } from '../../layout/layout.module';
import { GlobalUtilsModule } from '../../global-utils/global-utils.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SelectModule } from 'ng2-select';
import { FileUploadModule } from 'ng2-file-upload'
import { ComponentHelper } from '../../global-utils/helpers/component.helper';
import { SelentaImportRoutingModule } from './selenta-import-routing.module';
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
import { SelentaImportComponent } from './selenta-import.component';
import { SelentaImportService } from './selenta-import.service';
import { SelentaImportNewArticlesComponent } from './selenta-import-new-articles/selenta-import-new-articles.component';
import { SelentaImportNewProvidersComponent } from './selenta-import-new-providers/selenta-import-new-providers.component';
import { SelentaImportActivityLogComponent } from './selenta-import-activity-log/selenta-import-activity-log.component';
import { SelentaImportDeletedComponent } from './selenta-import-deleted/selenta-import-deleted.component';
import { SelentaImportConflictsComponent } from './selenta-import-conflicts/selenta-import-conflicts.component';
import { SelentaImportArticlesComponent } from './selenta-import-articles/selenta-import-articles.component';
import { SelentaImportProvidersComponent } from './selenta-import-providers/selenta-import-providers.component';
import { SelentaImportFamiliesComponent } from './selenta-import-families/selenta-import-families.component';
import { SelentaImportArticleDetailComponent } from './selenta-import-article-detail/selenta-import-article-detail.component';

@NgModule({
    declarations: [
        SelentaImportComponent,
        SelentaImportNewArticlesComponent,
        SelentaImportNewProvidersComponent,
        SelentaImportActivityLogComponent,
        SelentaImportDeletedComponent,
        SelentaImportConflictsComponent,
        SelentaImportArticlesComponent,
        SelentaImportProvidersComponent,
        SelentaImportFamiliesComponent,
        SelentaImportArticleDetailComponent
    ],
    providers: [
        ComponentHelper,
        SelentaImportService
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
        SelentaImportRoutingModule
    ]
})
export class SelentaImportModule {

}