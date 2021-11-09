import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate/ng2-translate'
import { ArticlesComponent } from './articles.component'
import { IngredientNewComponent } from './ingredients/ingredient-new/ingredient-new.component'
import { IngredientsService } from './ingredients/ingredients.service'
import { ModalModule, PaginationModule, TabsModule } from 'ngx-bootstrap'
import { FileUploadModule } from 'ng2-file-upload'
import { PackagingsService } from "./packagings/packagings.service"
import { FamilyService } from '../libraries/family/family.service'
import { CheckpointService } from '../libraries/checkpoint/checkpoint.service'
import { ProcessService } from '../libraries/process/process.service'
import { UtensilService } from '../libraries/utensil/utensil.service'
import { PackFormatService } from '../libraries/pack-format/pack-format.service'
import { AllergenService } from '../libraries/allergen/allergen.service'
import { MeasurementUnitService } from '../libraries/measurement-unit/measurement-unit.service'
import { AppConfig } from '../global-utils/services/appConfig.service'
import { PackagingNewComponent } from './packagings/packaging-new/packaging-new.component'
import { LayoutModule } from '../layout/layout.module';
import { GlobalUtilsModule } from '../global-utils/global-utils.module';
import { ArticlesRoutingModule } from './articles-routing.module';
import { RouterModule } from '@angular/router';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { IngredientMainComponent } from './ingredients/ingredient-main/ingredient-main.component';
import { IngredientTabComponent } from './ingredients/ingredient-tab/ingredient-tab.component';
import { QuarteringComponent } from './ingredients/quartering/quartering.component';
import { IngredientListComponent } from './ingredients/ingredient-list/ingredient-list.component';
import { IngredientProviderComponent } from './ingredients/ingredient-provider/ingredient-provider.component';
import { PackagingListComponent } from './packagings/packaging-list/packaging-list.component';
import { PackagingMainComponent } from './packagings/packaging-main/packaging-main.component';
import { PackagingProviderComponent } from './packagings/packaging-provider/packaging-provider.component';
import { PackagingTabComponent } from './packagings/packaging-tab/packaging-tab.component';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { IngredientPrintComponent } from './ingredients/ingredient-print/ingredient-print.component';
import { PackagingPrintComponent } from './packagings/packaging-print/packaging-print.component';
import { AngularCropperjsModule } from 'angular-cropperjs';

@NgModule({
    declarations: [
        IngredientNewComponent,
        ArticlesComponent,
        PackagingNewComponent,
        IngredientMainComponent,
        IngredientTabComponent,
        QuarteringComponent,
        IngredientListComponent,
        IngredientProviderComponent,
        PackagingListComponent,
        PackagingMainComponent,
        PackagingProviderComponent,
        PackagingTabComponent,
        IngredientPrintComponent,
        PackagingPrintComponent
    ],
    providers: [
        IngredientsService,
        PackagingsService,
        FamilyService,
        CheckpointService,
        ProcessService,
        UtensilService,
        PackFormatService,
        AllergenService,
        MeasurementUnitService,
        AppConfig,
        ConfirmationService
    ],
    imports: [
        TranslateModule,
        PaginationModule,
        ModalModule,
        TabsModule,
        FileUploadModule,
        GlobalUtilsModule,
        CommonModule,
        ArticlesRoutingModule,
        FormsModule,
        LayoutModule,
        RouterModule,
        SimpleNotificationsModule,
        ConfirmDialogModule,
        AngularCropperjsModule        
    ]
})
export class ArticlesModule {

}