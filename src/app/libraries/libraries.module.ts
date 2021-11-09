import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProcessComponent } from './process/process.component'
import { LibrariesComponent } from './libraries.component'
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { AllergenComponent } from './allergen/allergen.component';
import { FamilyComponent } from './family/family.component';
import { FamilyTableComponent } from './family/family-table/family-table.component';
import { PackFormatComponent } from './pack-format/pack-format.component';
import { MeasurementUnitComponent } from './measurement-unit/measurement-unit.component';
import { UtensilComponent } from './utensil/utensil.component';
import { CheckpointTabComponent } from './checkpoint/checkpoint-tab.component';
import { CheckpointTableComponent } from './checkpoint/checkpoint-table/checkpoint-table.component';
import { GlobalUtilsModule } from '../global-utils/global-utils.module';
import { LibrariesRoutingModule } from './libraries-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { PaginationModule, TabsModule, ModalModule } from 'ngx-bootstrap'
import { FileSelectDirective, FileDropDirective, FileUploadModule } from 'ng2-file-upload'
import { SimpleNotificationsModule } from 'angular2-notifications';
import { KitchenComponent } from './kitchen/kitchen.component';
import { KitchenService } from './kitchen/kitchen.service'

@NgModule({
    declarations: [
        ProcessComponent,
        LibrariesComponent,
        AllergenComponent,
        FamilyComponent,
        FamilyTableComponent,
        PackFormatComponent,
        MeasurementUnitComponent,
        UtensilComponent,
        CheckpointTabComponent,
        CheckpointTableComponent,
        KitchenComponent
    ],
    imports: [
        TranslateModule,
        GlobalUtilsModule,
        LibrariesRoutingModule,
        LayoutModule,
        CommonModule,
        PaginationModule,
        TabsModule,
        ModalModule,
        FileUploadModule,
        BrowserModule,
        FormsModule,
        SimpleNotificationsModule
    ],
    providers: [
        KitchenService
    ]
})
export class LibrariesModule {

}
