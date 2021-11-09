import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecipesComponent} from './recipes.component';
import { AuthGuard } from '../global-utils/services/auth-guard.service';
import { SubproductsListComponent } from "./subproducts/subproduct-list/subproducts-list.component";
import { SubproductTabEditComponent } from "./subproducts/subproduct-tab/subproduct-tab-edit.component";
import { SubproductVersionsComponent } from "./subproducts/subproduct-versions/subproduct-versions.component";
import { ProductsListComponent } from "./products/product-list/products-list.component";
import { ProductTabEditComponent } from "./products/product-tab/product-tab-edit.component";
import { ProductVersionsComponent } from "./products/product-versions/product-versions.component";
import { DishListComponent } from "./dishes/dish-list/dish-list.component"
import { DishTabEditComponent } from "./dishes/dish-tab/dish-tab-edit.component"
import { DishVersionsComponent } from "./dishes/dish-versions/dish-versions.component";
import { DrinkListComponent } from "./drinks/drink-list/drink-list.component"
import { DrinkMainComponent } from "./drinks/drink-main/drink-main.component"
import { DrinkTabComponent } from "./drinks/drink-tab/drink-tab.component"
import { DrinkVersionsComponent } from "./drinks/drink-versions/drink-versions.component";
import { CanDeactivateGuard }    from '../global-utils/services/can-deactivate-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      //{ path: '', redirectTo: 'libraries', pathMatch: 'full'},
      {
		path: 'recipes', 
		component: RecipesComponent, 
		canActivate: [AuthGuard],
		children: [
		  { path: '', redirectTo: 'subproducts', pathMatch: 'full' },
      { path: 'subproducts', component: SubproductsListComponent, canActivate: [AuthGuard] },
      { path: 'subproducts/new', component: SubproductTabEditComponent, data: {mode:'new'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'subproducts/:id', component: SubproductTabEditComponent , data: {mode:'view'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'subproducts/edit/:id', component: SubproductTabEditComponent, data: {mode:'edit'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
      { path: 'subproducts/versions/:id', component: SubproductVersionsComponent, canActivate: [AuthGuard] },
      { path: 'products', component: ProductsListComponent, canActivate: [AuthGuard] },
      { path: 'products/new', component: ProductTabEditComponent, data: {mode:'new'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
      { path: 'products/:id', component: ProductTabEditComponent, data: {mode:'view'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'products/edit/:id', component: ProductTabEditComponent, data: {mode:'edit'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
      { path: 'products/versions/:id', component: ProductVersionsComponent, canActivate: [AuthGuard] },
      { path: 'dishes', component: DishListComponent, canActivate: [AuthGuard] },
      { path: 'dishes/new', component: DishTabEditComponent, data: {mode:'new'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'dishes/edit/:id', component: DishTabEditComponent, data: {mode:'edit'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
	  	{ path: 'dishes/:id', component: DishTabEditComponent,data: {mode:'view'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
	  	{ path: 'dishes/versions/:id', component: DishVersionsComponent, canActivate: [AuthGuard] },
      { path: 'drinks', component: DrinkListComponent, canActivate: [AuthGuard] },
      { path: 'drinks/new', component: DrinkTabComponent,data: {mode:'new'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'drinks/edit/:id', component: DrinkTabComponent,data: {mode:'edit'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
      { path: 'drinks/:id', component: DrinkTabComponent,data: {mode:'view'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'drinks/versions/:id', component: DrinkVersionsComponent, canActivate: [AuthGuard] },
		]
	  }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class RecipesRoutingModule { }