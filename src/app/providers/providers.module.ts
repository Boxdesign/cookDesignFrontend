import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate/ng2-translate'
import { ModalModule, PaginationModule, TabsModule, TooltipModule } from 'ngx-bootstrap'
import { AppConfig } from '../global-utils/services/appConfig.service'
import { LayoutModule } from '../layout/layout.module';
import { GlobalUtilsModule } from '../global-utils/global-utils.module';
import { ProvidersRoutingModule } from './providers-routing.module'
import { ProvidersComponent } from './providers.component'
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ProviderListComponent } from './providers/provider-list/provider-list.component';
import { ProviderTabComponent } from './providers/provider-tab/provider-tab.component';
import { ProviderMainComponent } from './providers/provider-main/provider-main.component';
import { ProviderService } from './providers/provider.service'
import { ArticleService } from './articles/article.service'
import { SelectModule } from 'ng2-select';
import { ComponentHelper } from '../global-utils/helpers/component.helper';
import { ImageListboxComponent } from './image-listbox/image-listbox.component'
import { InputTextModule,
         ButtonModule,
         PanelModule,
         ListboxModule,
         FileUploadModule,
         ConfirmDialogModule,
         FieldsetModule,
         ToggleButtonModule,
         InputSwitchModule,
         DropdownModule,
         SelectButtonModule
       } from 'primeng/primeng';
import { ProviderArticlesComponent } from './providers/provider-articles/provider-articles.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';
import { ArticleMainComponent } from './articles/article-main/article-main.component';
import { ProviderQualityComponent } from './providers/provider-quality/provider-quality.component';
import { ArticleTabComponent } from './articles/article-tab/article-tab.component';
import { ArticleQualityComponent } from './articles/article-quality/article-quality.component';

@NgModule({
    declarations: [
	    ProvidersComponent,
	    ProviderListComponent,
	    ProviderTabComponent,
	    ProviderMainComponent,
        ImageListboxComponent,
        ProviderArticlesComponent,
        ArticleListComponent,
        ArticleMainComponent,
        ProviderQualityComponent,
        ArticleTabComponent,
        ArticleQualityComponent
    ],
    providers: [
        ProviderService,
        ArticleService,
        ComponentHelper
    ],
    imports: [
    	ProvidersRoutingModule,
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
export class ProvidersModule {

}