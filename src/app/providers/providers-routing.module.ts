import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../global-utils/services/auth-guard.service';
import { ProvidersComponent } from './providers.component'
import { ProviderListComponent } from './providers/provider-list/provider-list.component'
import { ProviderTabComponent } from './providers/provider-tab/provider-tab.component'
import { ProviderMainComponent } from './providers/provider-main/provider-main.component'
import { ProviderQualityComponent } from './providers/provider-quality/provider-quality.component'
import { ArticleListComponent } from './articles/article-list/article-list.component'
import { ArticleMainComponent } from './articles/article-main/article-main.component'
import { ArticleTabComponent } from './articles/article-tab/article-tab.component'
import { ArticleQualityComponent } from './articles/article-quality/article-quality.component'
import { CanDeactivateGuard }    from '../global-utils/services/can-deactivate-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'providers', component: ProvidersComponent, canActivate: [AuthGuard],
  		children: [
  		  { path: '', redirectTo: 'provider', pathMatch: 'full' },
    	  { path: 'provider', component: ProviderListComponent, canActivate: [AuthGuard] },
        { path: 'provider/new', component: ProviderMainComponent, data: { mode: 'new' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
        { path: 'provider/:id', component: ProviderTabComponent, data: { mode: 'view' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
        { path: 'provider/edit/:id', component: ProviderTabComponent,  data: { mode: 'edit' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
        { path: 'provider/quality', component: ProviderQualityComponent,  data: { mode: 'edit' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
        { path: 'article', component: ArticleListComponent, canActivate: [AuthGuard] },
        { path: 'article/new', component: ArticleMainComponent, data: { mode: 'new' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
        { path: 'article/:id', component: ArticleTabComponent, data: { mode: 'view' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
        { path: 'article/edit/:id', component: ArticleTabComponent,  data: { mode: 'edit' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
        { path: 'article/quality', component: ArticleQualityComponent,  data: { mode: 'edit' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
		  ]
	  }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ProvidersRoutingModule { }
