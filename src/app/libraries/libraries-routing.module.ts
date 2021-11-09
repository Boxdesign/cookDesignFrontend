import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { LibrariesComponent }  from './libraries.component'
import { AuthGuard } from '../global-utils/services/auth-guard.service';
import { AllergenComponent } from './allergen/allergen.component';
import { FamilyComponent } from './family/family.component';
import { PackFormatComponent } from './pack-format/pack-format.component';
import { MeasurementUnitComponent } from './measurement-unit/measurement-unit.component';
import { UtensilComponent } from './utensil/utensil.component';
import { ProcessComponent }  from './process/process.component';
import { CheckpointTabComponent }  from './checkpoint/checkpoint-tab.component';
import { KitchenComponent } from './kitchen/kitchen.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      //{ path: '', redirectTo: 'libraries', pathMatch: 'full'},
      {
		path: 'libraries', 
		component: LibrariesComponent, 
		canActivate: [AuthGuard],
		children: [
			{ path: '', redirectTo: 'family', pathMatch: 'full' },
			{ path: 'family', component: FamilyComponent },
			{ path: 'measurement-unit', component: MeasurementUnitComponent },
			{ path: 'allergen', component: AllergenComponent },
			{ path: 'checkpoint', component: CheckpointTabComponent },		
			{ path: 'packformat', component: PackFormatComponent },
			{ path: 'process', component: ProcessComponent },
			{ path: 'utensil', component: UtensilComponent },
			{ path: 'kitchen', component: KitchenComponent}		]
	  }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class LibrariesRoutingModule { }