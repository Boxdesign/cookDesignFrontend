import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnSorterComponent } from './components/column-sorter/column-sorter.component'
import { LoadingGifComponent } from './components/loading-gif/loading-gif.component'
import { ItemsPerPageComponent } from './components/items-per-page/items-per-page.component'
import { LangTabComponent } from './components/lang-tab/lang-tab.component'
import { criticalGastroCheckpointComponent } from './components/critical-gastro-checkpoint/critical-gastro-checkpoint.component'
import { LocationSelectorComponent } from './components/location-selector/location-selector.component'
import { LocationViewComponent } from './components/location-view/location-view.component'
import { LocationFilterComponent } from './components/location-filter/location-filter.component'
import { SearchBoxComponent } from './components/search-box/search-box.component'
import { PaginationSnippetComponent } from './components/pagination-snippet/pagination-snippet.component'
import { AccountService } from './services/account.service'
import { AppConfig } from './services/appConfig.service'
import { UploadService } from './services/upload.service'
import { AppReleaseService } from './services/appRelease.service'
import { AuthGuard } from './services/auth-guard.service'
import { CanDeactivateGuard } from './services/can-deactivate-guard.service'
import { AuthService } from './services/auth.service'
import { TemplateService } from './services/template.service'
import { CompassService } from './services/compass.service'
import { CostFilterService } from './services/cost-filter.service'
import { IdleTimeoutService } from './services/idleTimeout.service'
import { AuthHttp } from './services/authHttp.service'
import { LocationService } from './services/location.service'
import { UserService } from './services/user.service'
import { GalleryService } from './services/gallery.service'
import { SessionService } from './services/session.service'
import { PrintService } from './services/print.service'
import { TranslateModule } from 'ng2-translate/ng2-translate'
import { FileUploadModule } from 'ng2-file-upload'
import { SelectModule } from 'ng2-select';
import { TabsModule, ModalModule, TooltipModule, PaginationModule} from "ngx-bootstrap";
import { MediaFilesComponent } from './components/media-files/media-files.component';
import { RecipeCompositionFilterPipe } from "./pipes/recipe-composition-filter.pipe";
import { GastroCompositionFilterPipe } from "./pipes/gastro-composition-filter.pipe";
import { OrderByCategoryPipe } from "./pipes/order-by-category.pipe";
import { CompositionFilterTextPipe } from "./pipes/composition-filter-text.pipe";
import { CompositionFilterTextDirtyPipe } from "./pipes/composition-filter-text-dirty.pipe";
import { CompositionSortPipe } from "./pipes/composition-sort.pipe";
import { tableSortPipe } from "./pipes/table-sort.pipe";
import { AllergenViewComponent } from './components/allergen-view/allergen-view.component';
import { ContactDatatableComponent } from './components/contact-datatable/contact-datatable.component';
import { InputTextModule,
         ButtonModule,
         PanelModule,
         ListboxModule,
         ConfirmDialogModule,
         FieldsetModule,
         DialogModule,
         DataTableModule,
         ToggleButtonModule
       } from 'primeng/primeng';
import { EditableListboxComponent } from './components/editable-listbox/editable-listbox.component';
import { AllLocationSelectorComponent } from './components/all-location-selector/all-location-selector.component';
import { AllLocationViewComponent } from './components/all-location-view/all-location-view.component';
import { CookingStepsComponent } from './components/cooking-steps/cooking-steps.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LocationCostTableComponent } from './components/location-cost-table/location-cost-table.component';
import { LocationAllergenTableComponent } from './components/location-allergen-table/location-allergen-table.component';
import { LocationCostFilterComponent } from './components/location-cost-filter/location-cost-filter.component';
import { WhereIsIncludedComponent } from './components/where-is-included/where-is-included.component';
import { KitchenSelectComponent } from './components/kitchen-select/kitchen-select.component';
import { TopNotificationComponent } from './components/top-notification/top-notification.component';
import { LocationCostRefreshComponent } from './components/location-cost-refresh/location-cost-refresh.component';
import { LocationProviderComponent } from './components/location-provider/location-provider.component';
import { CropAndUploadComponent } from './components/crop-and-upload/crop-and-upload.component';
import { AppReleaseComponent } from './components/app-release/app-release.component';
import { MarkdownModule } from 'ngx-md';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { AllergenEditComponent } from './components/allergen-edit/allergen-edit.component';

@NgModule({
    declarations: [
        ColumnSorterComponent,
        LoadingGifComponent,
        ItemsPerPageComponent,
        LangTabComponent,
        criticalGastroCheckpointComponent,
        LocationSelectorComponent,
        LocationViewComponent,
        LocationFilterComponent,
        SearchBoxComponent,
        PaginationSnippetComponent,
        MediaFilesComponent,
        RecipeCompositionFilterPipe,
        GastroCompositionFilterPipe,
        CompositionFilterTextPipe,
        CompositionFilterTextDirtyPipe,
        CompositionSortPipe,
        tableSortPipe,
        OrderByCategoryPipe,
        AllergenViewComponent,
        ContactDatatableComponent,
        EditableListboxComponent,
        AllLocationSelectorComponent,
        AllLocationViewComponent,
        CookingStepsComponent,
        LocationCostTableComponent,
        LocationAllergenTableComponent,
        LocationCostFilterComponent,
        WhereIsIncludedComponent,
        KitchenSelectComponent,
        TopNotificationComponent,
        LocationCostRefreshComponent,
        LocationProviderComponent,
        CropAndUploadComponent,
        AppReleaseComponent,
        FileUploaderComponent,
        AllergenEditComponent    
    ],
    providers: [
        AccountService,
        AppConfig,
        AuthGuard,
        AuthService,
        AuthHttp,
        LocationService,
        UserService,
        TemplateService,
        SessionService,
        GalleryService,
        CompassService,
        CostFilterService,
        CanDeactivateGuard,
        PrintService,
        UploadService,
        AppReleaseService,
        IdleTimeoutService
    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        FileUploadModule,
        TabsModule,
        ModalModule,
        TooltipModule,
        DialogModule,
        ButtonModule,
        ConfirmDialogModule,
        DataTableModule,
        ListboxModule,
        ToggleButtonModule,
        SelectModule,
        SimpleNotificationsModule,
        PaginationModule,
        MarkdownModule
    ],
    exports: [
        ColumnSorterComponent,
        LoadingGifComponent,
        ItemsPerPageComponent,
        LangTabComponent,
        criticalGastroCheckpointComponent,
        LocationSelectorComponent,
        SearchBoxComponent,
        PaginationSnippetComponent,
        MediaFilesComponent,
        RecipeCompositionFilterPipe,
        GastroCompositionFilterPipe,
        CompositionFilterTextPipe,
        CompositionFilterTextDirtyPipe,
        CompositionSortPipe,
        tableSortPipe,
        OrderByCategoryPipe,
        LocationViewComponent,
        LocationFilterComponent,
        AllergenViewComponent,
        ContactDatatableComponent,
        EditableListboxComponent,
        AllLocationSelectorComponent,
        AllLocationViewComponent,
        CookingStepsComponent,
        SimpleNotificationsModule,
        LocationCostTableComponent,
        LocationAllergenTableComponent,
        LocationCostFilterComponent,
        WhereIsIncludedComponent,
        KitchenSelectComponent,
        TopNotificationComponent,
        LocationCostRefreshComponent,
        LocationProviderComponent,
        CropAndUploadComponent,
        AppReleaseComponent,
        FileUploaderComponent,
        AllergenEditComponent
    ]
})
export class GlobalUtilsModule {

}