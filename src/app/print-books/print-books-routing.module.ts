import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrintBooksComponent } from './print-books.component'
import { AuthGuard } from '../global-utils/services/auth-guard.service';
import { PrintBooksSelectorComponent } from './print-books-selector/print-books-selector.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      //{ path: '', redirectTo: 'libraries', pathMatch: 'full'},
      {
		path: 'print-books', 
		component: PrintBooksComponent, 
		canActivate: [AuthGuard],
		children: [
		  { path: '', redirectTo: 'print-books-selector', pathMatch: 'full' },
      { path: 'print-books-selector', component: PrintBooksSelectorComponent, canActivate: [AuthGuard] }
		]
	  }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PrintBooksRoutingModule { }