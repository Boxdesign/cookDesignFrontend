import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { LibrariesModule } from './libraries/libraries.module';
import { ArticlesModule } from './articles/articles.module';
import { RecipesModule } from './recipes/recipes.module';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { GlobalUtilsModule } from './global-utils/global-utils.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes, Router } from '@angular/router';
import { AppRoutingModule }  from './app-routing.module';
import { AuthHttp } from './global-utils/services/authHttp.service'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GastroModule } from './gastro/gastro.module';
import { ReportsModule } from './reports/reports.module';
import { ProvidersModule } from './providers/providers.module';
import { AdminModule } from './admin/admin.module';
import { LayoutModule } from './layout/layout.module';
import { httpFactory } from './httpFactory';
import { translateFactory } from './translateFactory';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TooltipModule } from "ngx-bootstrap";
import { ExportModule } from './export/export.module';
import { ImportModule } from './import/import.module';
import { PrintBooksModule } from './print-books/print-books.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LibrariesModule,
    TranslateModule.forRoot({ 
          provide: TranslateLoader,
          useFactory: translateFactory,
          deps: [Http]
        }),
    ArticlesModule,
    RecipesModule,
    GastroModule,
    GlobalUtilsModule,
    ReportsModule,
    ProvidersModule,
    AdminModule,
    ExportModule,
    ImportModule,
    PrintBooksModule,
    AppRoutingModule,
    LayoutModule,
    SimpleNotificationsModule.forRoot(),
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    BrowserAnimationsModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])
  ],
  exports: [
    BrowserModule,
    FormsModule, 
    HttpModule, 
    TranslateModule,
  ],
  providers: [
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [ XHRBackend, RequestOptions, Router]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
