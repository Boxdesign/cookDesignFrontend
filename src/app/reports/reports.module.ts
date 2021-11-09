import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate/ng2-translate'
import { IngredientsService } from '../articles/ingredients/ingredients.service'
import { ModalModule, PaginationModule, TabsModule, BsDropdownModule, TooltipModule } from 'ngx-bootstrap'
import { FileUploadModule } from 'ng2-file-upload'
import { AppConfig } from '../global-utils/services/appConfig.service'
import { LayoutModule } from '../layout/layout.module';
import { GlobalUtilsModule } from '../global-utils/global-utils.module';
import { ReportsRoutingModule } from './reports-routing.module'
import { ReportsComponent } from './reports.component'
import { RouterModule } from '@angular/router';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReportsService } from './reports.service'
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ReportGastroIngredientsComponent } from './report-gastro-ingredients/report-gastro-ingredients.component';
import { ReportLocationSubproducts } from './report-location-subproducts/report-location-subproducts.component';
import { ReportTabComponent } from './report-tab/report-tab.component';
import { ReportPrintComponent } from './report-print/report-print.component';
import { SelectModule } from 'ng2-select';
import { ReportPrintLibrariesComponent } from './report-print-libraries/report-print-libraries.component';
import { SelectButtonModule } from 'primeng/primeng';

@NgModule({
    declarations: [
        ReportsComponent,
        ReportsListComponent,
        ReportGastroIngredientsComponent,
        ReportLocationSubproducts,
        ReportTabComponent,
        ReportPrintComponent,
        ReportPrintLibrariesComponent
    ],
    providers: [
        ReportsService
    ],
    imports: [
        TranslateModule,
        PaginationModule,
        ModalModule,
        TabsModule,
        FileUploadModule,
        GlobalUtilsModule,
        CommonModule,
        ReportsRoutingModule,
        FormsModule,
        LayoutModule,
        RouterModule,
        BsDropdownModule,
        TooltipModule,
        SimpleNotificationsModule,
        SelectModule,
        SelectButtonModule
    ]
})
export class ReportsModule {

}