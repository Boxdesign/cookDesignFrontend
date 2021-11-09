import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubproductsService } from "../subproducts.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { UtensilService } from "../../../libraries/utensil/utensil.service";
import { ProcessService } from "../../../libraries/process/process.service";
import { CheckpointService } from "../../../libraries/checkpoint/checkpoint.service";

@Component({
	selector: 'subproduct-steps-edit',
	templateUrl: './subproduct-steps-edit.template.html',
})
export class SubproductStepsEditComponent {
	@Input() subproduct;
	public type='subproduct';

	constructor(){}

	ngOnInit(){}

}