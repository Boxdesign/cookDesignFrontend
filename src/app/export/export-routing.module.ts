import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExportComponent } from './export.component'
import { AuthGuard } from '../global-utils/services/auth-guard.service';
import { ExportSelectorComponent } from './export-selector/export-selector.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      //{ path: '', redirectTo: 'libraries', pathMatch: 'full'},
      {
		path: 'export', 
		component: ExportComponent, 
		canActivate: [AuthGuard],
		children: [
		  { path: '', redirectTo: 'export-selector', pathMatch: 'full' },
      { path: 'export-selector', component: ExportSelectorComponent, canActivate: [AuthGuard] }
		]
	  }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ExportRoutingModule { }