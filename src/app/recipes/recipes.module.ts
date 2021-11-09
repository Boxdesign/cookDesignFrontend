import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate/ng2-translate'
import { RecipesComponent } from './recipes.component'
import { SubproductsListComponent } from './subproducts/subproduct-list/subproducts-list.component'
import { SubproductCompositionEditComponent } from './subproducts/subproduct-composition/subproduct-composition-edit.component'
import { SubproductMainEditComponent } from './subproducts/subproduct-main/subproduct-main-edit.component'
import { SubproductStepsEditComponent } from './subproducts/subproduct-steps/subproduct-steps-edit.component'
import { SubproductTabEditComponent } from './subproducts/subproduct-tab/subproduct-tab-edit.component'
import { SubproductVersionsComponent } from './subproducts/subproduct-versions/subproduct-versions.component'
import { DishListComponent } from "./dishes/dish-list/dish-list.component"
import { IngredientsService } from '../articles/ingredients/ingredients.service'
import { ModalModule, PaginationModule, TabsModule, BsDropdownModule, TooltipModule } from 'ngx-bootstrap'
import { FileUploadModule } from 'ng2-file-upload'
import { SubproductsService } from './subproducts/subproducts.service'
import { DishService } from './dishes/dish.service'
import { PackagingsService } from "../articles/packagings/packagings.service"
import { FamilyService } from '../libraries/family/family.service'
import { CheckpointService } from '../libraries/checkpoint/checkpoint.service'
import { ProcessService } from '../libraries/process/process.service'
import { UtensilService } from '../libraries/utensil/utensil.service'
import { PackFormatService } from '../libraries/pack-format/pack-format.service'
import { AllergenService } from '../libraries/allergen/allergen.service'
import { MeasurementUnitService } from '../libraries/measurement-unit/measurement-unit.service'
import { AppConfig } from '../global-utils/services/appConfig.service'
import { LayoutModule } from '../layout/layout.module';
import { GlobalUtilsModule } from '../global-utils/global-utils.module';
import { RecipesRoutingModule } from './recipes-routing.module'
import { RouterModule } from '@angular/router';
import { DishTabEditComponent } from "./dishes/dish-tab/dish-tab-edit.component"
import { DishMainEditComponent } from "./dishes/dish-main/dish-main-edit.component"
import { DishCompositionEditComponent } from "./dishes/dish-composition/dish-composition-edit.component"
import { DishStepsEditComponent } from "./dishes/dish-steps/dish-steps-edit.component"
import { MediaFilesComponent } from "../global-utils/components/media-files/media-files.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DishVersionsComponent } from "./dishes/dish-versions/dish-versions.component";
import { ProductsListComponent } from './products/product-list/products-list.component';
import { ProductTabEditComponent } from './products/product-tab/product-tab-edit.component';
import { ProductMainEditComponent } from './products/product-main/product-main-edit.component';
import { ProductCompositionEditComponent } from './products/product-composition/product-composition-edit.component';
import { ProductVersionsComponent } from './products/product-versions/product-versions.component';
import { ProductsService } from './products/products.service';
import { ProductPackagingEditComponent } from './products/product-packaging/product-packaging-edit.component';
import { ProductPricingEditComponent } from './products/product-pricing/product-pricing-edit.component';
import { DishPricingEditComponent } from './dishes/dish-pricing/dish-pricing-edit.component';
import { ProductStepsEditComponent } from './products/product-steps/product-steps-edit.component';
import { SubproductProductionEditComponent } from './subproducts/subproduct-production/subproduct-production-edit.component';
import { ProductProductionEditComponent } from './products/product-production/product-production-edit.component';
import { DishProductionEditComponent } from './dishes/dish-production/dish-production-edit.component';
import { SubproductPrintComponent } from './subproducts/subproduct-print/subproduct-print.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SelectModule } from 'ng2-select';
import { ProductPrintComponent } from './products/product-print/product-print.component';
import { DishPrintComponent } from './dishes/dish-print/dish-print.component';
import { ConfirmDialogModule, ConfirmationService, SelectButtonModule } from 'primeng/primeng';
import { DrinkCompositionComponent } from './drinks/drink-composition/drink-composition.component';
import { DrinkListComponent } from './drinks/drink-list/drink-list.component';
import { DrinkMainComponent } from './drinks/drink-main/drink-main.component';
import { DrinkPricingComponent } from './drinks/drink-pricing/drink-pricing.component';
import { DrinkPrintComponent } from './drinks/drink-print/drink-print.component';
import { DrinkProductionComponent } from './drinks/drink-production/drink-production.component';
import { DrinkStepsComponent } from './drinks/drink-steps/drink-steps.component';
import { DrinkTabComponent } from './drinks/drink-tab/drink-tab.component';
import { DrinkVersionsComponent } from './drinks/drink-versions/drink-versions.component';
import { DrinkService } from './drinks/drink.service';
import { AccordionModule } from 'ngx-bootstrap';
import { KitchenService } from '../libraries/kitchen/kitchen.service'

@NgModule({
    declarations: [
        RecipesComponent,
        SubproductsListComponent,
        SubproductCompositionEditComponent,
        SubproductMainEditComponent,
        SubproductStepsEditComponent,
        SubproductTabEditComponent,
        SubproductVersionsComponent,
        DishListComponent,
        DishTabEditComponent,
        DishMainEditComponent,
        DishCompositionEditComponent,
        DishStepsEditComponent,
        DishVersionsComponent,
        ProductsListComponent,
        ProductTabEditComponent,
        ProductMainEditComponent,
        ProductCompositionEditComponent,
        ProductVersionsComponent,
        ProductPackagingEditComponent,
        ProductPricingEditComponent,
        DishPricingEditComponent,
        ProductPricingEditComponent,
        ProductStepsEditComponent,
        SubproductProductionEditComponent,
        ProductProductionEditComponent,
        DishProductionEditComponent,
        SubproductPrintComponent,
        ProductPrintComponent,
        DishPrintComponent,
        DrinkCompositionComponent,
        DrinkListComponent,
        DrinkMainComponent,
        DrinkPricingComponent,
        DrinkPrintComponent,
        DrinkProductionComponent,
        DrinkStepsComponent,
        DrinkTabComponent,
        DrinkVersionsComponent
    ],
    providers: [
        IngredientsService,
        PackagingsService,
        FamilyService,
        CheckpointService,
        ProcessService,
        UtensilService,
        KitchenService,
        PackFormatService,
        AllergenService,
        MeasurementUnitService,
        AppConfig,
        SubproductsService,
        DishService,
        ProductsService,
        ConfirmationService,
        DrinkService
    ],
    imports: [
        TranslateModule,
        PaginationModule,
        ModalModule,
        TabsModule,
        FileUploadModule,
        GlobalUtilsModule,
        CommonModule,
        RecipesRoutingModule,
        FormsModule,
        LayoutModule,
        RouterModule,
        NgbModule,
        BsDropdownModule,
        TooltipModule,
        SimpleNotificationsModule,
        SelectModule,
        ConfirmDialogModule,
        AccordionModule,
        SelectButtonModule
    ]
})
export class RecipesModule {

}