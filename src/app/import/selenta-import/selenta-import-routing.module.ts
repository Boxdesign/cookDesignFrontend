import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelentaImportComponent } from './selenta-import.component'
import { AuthGuard } from '../../global-utils/services/auth-guard.service';
import { SelentaImportNewArticlesComponent } from './selenta-import-new-articles/selenta-import-new-articles.component';
import { SelentaImportNewProvidersComponent } from './selenta-import-new-providers/selenta-import-new-providers.component';
import { SelentaImportActivityLogComponent } from './selenta-import-activity-log/selenta-import-activity-log.component';
import { SelentaImportDeletedComponent } from './selenta-import-deleted/selenta-import-deleted.component';
import { SelentaImportConflictsComponent } from './selenta-import-conflicts/selenta-import-conflicts.component';
import { SelentaImportArticlesComponent } from './selenta-import-articles/selenta-import-articles.component';
import { SelentaImportProvidersComponent } from './selenta-import-providers/selenta-import-providers.component';
import { SelentaImportFamiliesComponent } from './selenta-import-families/selenta-import-families.component';
import { SelentaImportArticleDetailComponent } from './selenta-import-article-detail/selenta-import-article-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      //{ path: '', redirectTo: 'libraries', pathMatch: 'full'},
      {
		path: 'import/selenta-import',
		component: SelentaImportComponent, 
		canActivate: [AuthGuard],
		children: [
		  { path: '', redirectTo: 'selenta-import-new-providers', pathMatch: 'full' },
      { path: 'selenta-import-new-providers', component: SelentaImportNewProvidersComponent, canActivate: [AuthGuard] },
      { path: 'selenta-import-new-articles', component: SelentaImportNewArticlesComponent, canActivate: [AuthGuard] },
      { path: 'selenta-import-families', component: SelentaImportFamiliesComponent, canActivate: [AuthGuard] },
      { path: 'selenta-import-deleted', component: SelentaImportDeletedComponent, canActivate: [AuthGuard] },
      { path: 'selenta-import-providers', component: SelentaImportProvidersComponent, canActivate: [AuthGuard] },
      { path: 'selenta-import-articles', component: SelentaImportArticlesComponent, canActivate: [AuthGuard] },
      { path: 'selenta-import-articles/:id', component: SelentaImportArticleDetailComponent, canActivate: [AuthGuard]},
      { path: 'selenta-import-activity-log', component: SelentaImportActivityLogComponent, canActivate: [AuthGuard] },
      { path: 'selenta-import-conflicts', component: SelentaImportConflictsComponent, canActivate: [AuthGuard] }
		]
	  }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SelentaImportRoutingModule { }