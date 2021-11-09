import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsComponent} from './reports.component';
import { ReportsListComponent} from './reports-list/reports-list.component';
import { AuthGuard } from '../global-utils/services/auth-guard.service';
import { CanDeactivateGuard }    from '../global-utils/services/can-deactivate-guard.service';
import { ReportPrintComponent } from "../reports/report-print/report-print.component";
import { ReportTabComponent } from "../reports/report-tab/report-tab.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
		path: 'reports', 
		component: ReportsComponent, 
		canActivate: [AuthGuard],
		children: [
		  { path: '', redirectTo: 'reports-list', pathMatch: 'full' },
		  { path: 'reports-list', component: ReportTabComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
		  { path: 'reports/:id', component: ReportTabComponent, data: { mode: 'view' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },      
		]
	  }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ReportsRoutingModule { }