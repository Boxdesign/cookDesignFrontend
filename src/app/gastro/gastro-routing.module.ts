import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../global-utils/services/auth-guard.service';
import { GastroComponent } from './gastro.component'
import { GastroOfferCompositionComponent } from './gastro-offers/gastro-offer-composition/gastro-offer-composition.component'
import { GastroOfferListComponent } from './gastro-offers/gastro-offer-list/gastro-offer-list.component'
import { GastroOfferMainComponent } from './gastro-offers/gastro-offer-main/gastro-offer-main.component'
import { GastroOfferNewComponent } from './gastro-offers/gastro-offer-new/gastro-offer-new.component'
import { GastroOfferTabComponent } from './gastro-offers/gastro-offer-tab/gastro-offer-tab.component'
import { GastroOfferVersionsComponent } from './gastro-offers/gastro-offer-versions/gastro-offer-versions.component'
import { CanDeactivateGuard } from '../global-utils/services/can-deactivate-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
		path: 'gastro-offering', 
		component: GastroComponent, 
		canActivate: [AuthGuard],
		children: [
		  { path: '', redirectTo: 'menus', pathMatch: 'full' },
	      { path: 'menus', component: GastroOfferListComponent, data: {menuType: 'menu'}, canActivate: [AuthGuard] },
	      { path: 'menus/new', component: GastroOfferNewComponent, data: {menuType: 'menu'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'menus/:id', component: GastroOfferTabComponent, data: {menuType: 'menu', viewMode:true}, canActivate: [AuthGuard] },
	      { path: 'menus/edit/:id', component: GastroOfferTabComponent,  data: {menuType: 'menu'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'menus/versions/:id', component: GastroOfferVersionsComponent,  data: {menuType: 'menu'}, canActivate: [AuthGuard] },
	      { path: 'daily-menu-cartes', component: GastroOfferListComponent, data: {menuType: 'dailyMenuCarte'}, canActivate: [AuthGuard] },
	      { path: 'daily-menu-cartes/new', component: GastroOfferNewComponent, data: {menuType: 'dailyMenuCarte'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'daily-menu-cartes/:id', component: GastroOfferTabComponent, data: {menuType: 'dailyMenuCarte', viewMode:true}, canActivate: [AuthGuard] },
	      { path: 'daily-menu-cartes/edit/:id', component: GastroOfferTabComponent,  data: {menuType: 'dailyMenuCarte'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'daily-menu-cartes/versions/:id', component: GastroOfferVersionsComponent,  data: {menuType: 'dailyMenuCarte'}, canActivate: [AuthGuard] },
	      { path: 'buffets', component: GastroOfferListComponent, data: {menuType: 'buffet'}, canActivate: [AuthGuard] },
	      { path: 'buffets/new', component: GastroOfferNewComponent, data: {menuType: 'buffet'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
	      { path: 'buffets/:id', component: GastroOfferTabComponent, data: {menuType: 'buffet', viewMode:true}, canActivate: [AuthGuard] },
	      { path: 'buffets/edit/:id', component: GastroOfferTabComponent,  data: {menuType: 'buffet'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
	      { path: 'buffets/versions/:id', component: GastroOfferVersionsComponent,  data: {menuType: 'buffet'}, canActivate: [AuthGuard] },
	      { path: 'cartes', component: GastroOfferListComponent, data: {menuType: 'carte'}, canActivate: [AuthGuard] },
	      { path: 'cartes/new', component: GastroOfferNewComponent, data: {menuType: 'carte'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
	      { path: 'cartes/:id', component: GastroOfferTabComponent, data: {menuType: 'carte', viewMode:true}, canActivate: [AuthGuard] },
	      { path: 'cartes/edit/:id', component: GastroOfferTabComponent,  data: {menuType: 'carte'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
	      { path: 'cartes/versions/:id', component: GastroOfferVersionsComponent,  data: {menuType: 'carte'}, canActivate: [AuthGuard] },
	      { path: 'fixed-price-cartes', component: GastroOfferListComponent, data: {menuType: 'fixedPriceCarte'}, canActivate: [AuthGuard] },
	      { path: 'fixed-price-cartes/new', component: GastroOfferNewComponent, data: {menuType: 'fixedPriceCarte'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
	      { path: 'fixed-price-cartes/:id', component: GastroOfferTabComponent, data: {menuType: 'fixedPriceCarte', viewMode:true}, canActivate: [AuthGuard] },
	      { path: 'fixed-price-cartes/edit/:id', component: GastroOfferTabComponent,  data: {menuType: 'fixedPriceCarte'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'fixed-price-cartes/versions/:id', component: GastroOfferVersionsComponent,  data: {menuType: 'fixedPriceCarte'}, canActivate: [AuthGuard] },
	      { path: 'catalogs', component: GastroOfferListComponent, data: {menuType: 'catalog'}, canActivate: [AuthGuard] },
	      { path: 'catalogs/new', component: GastroOfferNewComponent, data: {menuType: 'catalog'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]  },
	      { path: 'catalogs/:id', component: GastroOfferTabComponent, data: {menuType: 'catalog', viewMode:true}, canActivate: [AuthGuard] },
	      { path: 'catalogs/edit/:id', component: GastroOfferTabComponent,  data: {menuType: 'catalog'}, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
	      { path: 'catalogs/versions/:id', component: GastroOfferVersionsComponent,  data: {menuType: 'catalog'}, canActivate: [AuthGuard]}
		]
	  }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class GastroRoutingModule { }