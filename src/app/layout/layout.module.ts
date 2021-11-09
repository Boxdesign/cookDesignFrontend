import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component'
import { MenuComponent } from './menu/menu.component';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap';
import { GlobalUtilsModule } from '../global-utils/global-utils.module';
import { ModalModule } from 'ngx-bootstrap'
import { SocketService } from '../global-utils/services/socket.service'
import { IdleTimeoutService } from '../global-utils/services/idleTimeout.service'
import { MessagesModule } from 'primeng/primeng';

@NgModule({
    declarations: [
        HeaderComponent,
        MenuComponent
    ],
    imports: [
        TranslateModule,
        RouterModule,
        BsDropdownModule,
        CommonModule,
        GlobalUtilsModule,
        ModalModule,
        FormsModule,
        MessagesModule
    ],
    exports: [
        HeaderComponent,
        MenuComponent
    ],
    providers: [
    		SocketService,
    		IdleTimeoutService
    ]
})
export class LayoutModule {

}