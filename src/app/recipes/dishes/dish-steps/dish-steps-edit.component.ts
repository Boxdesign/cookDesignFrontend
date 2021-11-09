import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DishService } from "../dish.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { UtensilService } from "../../../libraries/utensil/utensil.service";
import { ProcessService } from "../../../libraries/process/process.service";
import { CheckpointService } from "../../../libraries/checkpoint/checkpoint.service";

@Component({
	selector: 'dish-steps-edit',
	templateUrl: './dish-steps-edit.template.html',
})
export class DishStepsEditComponent {
	@Input() dish;
	public type='dish';

	constructor(){}

	ngOnInit(){}

}