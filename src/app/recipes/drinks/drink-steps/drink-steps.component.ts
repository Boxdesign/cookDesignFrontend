import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrinkService } from "../drink.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { UtensilService } from "../../../libraries/utensil/utensil.service";
import { ProcessService } from "../../../libraries/process/process.service";
import { CheckpointService } from "../../../libraries/checkpoint/checkpoint.service";

@Component({
	selector: 'drink-steps',
	templateUrl: './drink-steps.component.html',
})
export class DrinkStepsComponent {
	@Input() drink;
	public type='drink';

	constructor(){}

	ngOnInit(){}

}