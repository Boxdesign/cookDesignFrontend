import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArticlesComponent} from './articles.component';
import { AuthGuard } from '../global-utils/services/auth-guard.service';
import { IngredientListComponent } from "./ingredients/ingredient-list/ingredient-list.component";
import { IngredientTabComponent } from "./ingredients/ingredient-tab/ingredient-tab.component";
import { IngredientNewComponent } from "./ingredients/ingredient-new/ingredient-new.component";
import { PackagingListComponent } from "./packagings/packaging-list/packaging-list.component";
import { PackagingTabComponent } from "./packagings/packaging-tab/packaging-tab.component";
import { PackagingNewComponent } from "./packagings/packaging-new/packaging-new.component";
import { CanDeactivateGuard }    from '../global-utils/services/can-deactivate-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: 'articles', pathMatch: 'full' },
      {
		path: 'articles', 
		component: ArticlesComponent, 
		canActivate: [AuthGuard],
		children: [
	      { path: '', redirectTo: 'ingredients', pathMatch: 'full' },
	      { path: 'ingredients', component: IngredientListComponent, canActivate: [AuthGuard] },
	      { path: 'ingredients/new', component: IngredientNewComponent, data: { mode: 'new' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'ingredients/edit/:id', component: IngredientTabComponent, data: { mode: 'edit' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'ingredients/:id', component: IngredientTabComponent, data: { mode: 'view' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'packagings', component: PackagingListComponent, canActivate: [AuthGuard] },
	      { path: 'packagings/new', component: PackagingNewComponent, data: { mode: 'new' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'packagings/edit/:id', component: PackagingTabComponent, data: { mode: 'edit' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'packagings/:id', component: PackagingTabComponent, data: { mode: 'view' }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  }
	  	]
	  }
	])
  ],
  exports: [
    RouterModule
  ]
})
export class ArticlesRoutingModule { }