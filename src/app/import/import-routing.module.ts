import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportComponent } from './import.component'
import { AuthGuard } from '../global-utils/services/auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {   
        path: 'import',
        component: ImportComponent
      },
      {
        path: 'selenta-import',
        loadChildren: './selenta-import/selenta-import.module#SelentaImportModule',
        data: {
          preload: false
        }
      },
      {  
        path: 'import/import',
        redirectTo: 'import',
        pathMatch: 'full' 
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ImportRoutingModule { }