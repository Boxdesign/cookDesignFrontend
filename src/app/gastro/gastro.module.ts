import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate/ng2-translate'
import { GastroComponent } from './gastro.component'
import { ModalModule, PaginationModule, TabsModule, BsDropdownModule, TooltipModule } from 'ngx-bootstrap'
import { FileUploadModule } from 'ng2-file-upload'
import { AppConfig } from '../global-utils/services/appConfig.service'
import { LayoutModule } from '../layout/layout.module';
import { GlobalUtilsModule } from '../global-utils/global-utils.module';
import { GastroRoutingModule } from './gastro-routing.module'
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GastroOfferService } from './gastro-offers/gastro-offer.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { GastroOfferListComponent } from './gastro-offers/gastro-offer-list/gastro-offer-list.component';
import { GastroOfferNewComponent } from './gastro-offers/gastro-offer-new/gastro-offer-new.component';
import { GastroOfferVersionsComponent } from './gastro-offers/gastro-offer-versions/gastro-offer-versions.component';
import { GastroOfferMainComponent } from './gastro-offers/gastro-offer-main/gastro-offer-main.component';
import { GastroOfferTabComponent } from './gastro-offers/gastro-offer-tab/gastro-offer-tab.component';
import { GastroOfferCompositionComponent } from './gastro-offers/gastro-offer-composition/gastro-offer-composition.component';
import { ConfirmDialogModule, ConfirmationService, SelectButtonModule } from 'primeng/primeng';
import { SelectModule } from 'ng2-select';
import { GastroOfferPrintComponent } from './gastro-offers/gastro-offer-print/gastro-offer-print.component';

@NgModule({
    declarations: [
	    GastroComponent,
	    GastroOfferListComponent,
	    GastroOfferNewComponent,
	    GastroOfferVersionsComponent,
	    GastroOfferMainComponent,
	    GastroOfferTabComponent,
	    GastroOfferCompositionComponent,
	    GastroOfferPrintComponent
    ],
    providers: [
        GastroOfferService,
        ConfirmationService
    ],
    imports: [
    	GastroRoutingModule,
    	TranslateModule,
        PaginationModule,
        ModalModule,
        TabsModule,
        FileUploadModule,
        GlobalUtilsModule,
        CommonModule,
        FormsModule,
        LayoutModule,
        RouterModule,
        NgbModule,
        BsDropdownModule,
        TooltipModule,
        SimpleNotificationsModule,
        ConfirmDialogModule,
        SelectModule,
        SelectButtonModule
    ]
})
export class GastroModule {

}