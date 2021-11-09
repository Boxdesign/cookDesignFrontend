import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent }     from './login/login.component';
import { LibrariesComponent } from './libraries/libraries.component';
import { ArticlesComponent } from './articles/articles.component';
import { PreloadSelectedModules } from './selective-preload-strategy';
import { AuthGuard } from './global-utils/services/auth-guard.service';

import { ExportComponent } from './export/export.component';
import { PrintBooksComponent } from './print-books/print-books.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
    	{   
          path: 'login', 
          component: LoginComponent 
      },
    	{
          path: 'libraries',
          loadChildren: '../../src/app/libraries/libraries.module#LibrariesModule',
          data: {
            preload: false
            }
      },
      {
          path: 'articles',
          loadChildren: '../../src/app/articles/articles.module#ArticlesModule',
          data: {
            preload: false
            }
      },
      {
          path: 'recipes',
          loadChildren: '../../src/app/recipes/recipes.module#RecipesModule',
          data: {
            preload: false
            }
       },
       {
          path: 'gastro-offering',
          loadChildren: '../../src/app/gastro/gastro.module#GastroModule',
          data: {
            preload: false
            }
       },
       {
          path: 'reports',
          loadChildren: '../../src/app/reports/reports.module#ReportsModule',
          data: {
            preload: false
            }
       },
       {
          path: 'providers',
          loadChildren: '../../src/app/providers/providers.module#ProvidersModule',
          data: {
            preload: false
            }
       },
       {
          path: 'admin',
          loadChildren: '../../src/app/admin/admin.module#AdminModule',
          data: {
            preload: false
          }
       },
       {
          path: 'export',
          loadChildren: '../../src/app/export/export.module#ExportModule',
          data: {
            preload: false
          }
       },
       {
          path: 'print-books',
          loadChildren: '../../src/app/print-books/print-books.module#PrintBooksModule',
          data: {
            preload: false
          }
       },
       {
          path: 'import',
          loadChildren: '../../src/app/import/import.module#ImportModule',
          data: {
            preload: false
          }
       },
       {  
          path: '', 
          redirectTo: '/articles', 
          pathMatch: 'full' 
       }
    ],  { preloadingStrategy: PreloadSelectedModules })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    PreloadSelectedModules
  ]
})
export class AppRoutingModule {}