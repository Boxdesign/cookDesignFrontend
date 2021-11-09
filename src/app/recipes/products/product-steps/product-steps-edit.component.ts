import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from "../products.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { UtensilService } from "../../../libraries/utensil/utensil.service";
import { ProcessService } from "../../../libraries/process/process.service";
import { CheckpointService } from "../../../libraries/checkpoint/checkpoint.service";

@Component({
	selector: 'product-steps-edit',
	templateUrl: './product-steps-edit.component.html',
})
export class ProductStepsEditComponent {
	@Input() product;
	public type='product';

	constructor(){}

	ngOnInit(){}

}















// import {Component, Input, EventEmitter, Output} from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ProductsService } from "../products.service";
// import { TranslateService } from 'ng2-translate/ng2-translate';
// import { UtensilService } from "../../../libraries/utensil/utensil.service";
// import { ProcessService } from "../../../libraries/process/process.service";
// import { CheckpointService } from "../../../libraries/checkpoint/checkpoint.service";

// @Component({
// 	selector: 'product-steps-edit',
// 	templateUrl: './product-steps-edit.component.html',

// })
// export class ProductStepsEditComponent {
// 	@Input() public productOnEdit;
// 	@Output() public hiddenTabButtons: EventEmitter<any>;
// 	public cookingStepOnEdit: any;
// 	public cookingStepOnEditIndex;
// 	public filterText: string = '';
// 	public searchBoxLabel: string;
// 	public totalElements=0;
// 	public utensils;
// 	public processes;
// 	public gastroCheckpoints;
// 	public criticalCheckpoints;
// 	public forceRefreshCS = new EventEmitter();
// 	public forceRefreshCSForEdit = new EventEmitter();
// 	public cookingSteps;
// 	public cookingStepsLangs: any[] = [];
// 	public flagAddForm:boolean = false;
// 	public flagEditForm:boolean = false;
// 	public flagViewForm:boolean = false;
// 	public timeOut;
// 	public viewEdit;
// 	public viewMode: boolean=false;

// 	public cookingStep = {
// 		process: null,
// 		utensil: null,
// 		time: 0,
// 		temperature: 0,
// 		temperatureProbe: 0,
// 		pressure: 0,
// 		power: 0,
// 		vacuum: 0,
// 		criticalCheckpoint: null,
// 		gastroCheckpoint: null,
// 		images: [],
// 		videos: []
// 	}

// 	public cookingStepLang = {
// 		description: '',
// 		criticalCheckpointNote: '',
// 		gastroCheckpointNote:''
// 	}

// 	public cookingStepUpdatedLang: any[] = [];

// 	public clone = require('clone');

// 	constructor(public route: ActivatedRoute, public productService: ProductsService, public utensilService: UtensilService,
// 		public processService: ProcessService, public translate: TranslateService, public checkpointService: CheckpointService) { 

// 		this.hiddenTabButtons = new EventEmitter();

// 	    this.translate.get('searchBox.beginText').subscribe((res: string) => {
// 	    	this.searchBoxLabel = res;
// 	      ////console.log('translation: '+ res);
// 	  });
// 	    route.data.subscribe((data: {viewMode:boolean}) => {
// 	      if(data.viewMode) this.viewMode = data.viewMode;
// 	    });
// 	}

// 	ngOnInit(){
// 		this.getProcesses();
// 		this.getUtensils();
// 		this.getCheckpoints();
//   	this.tagUpAndDownArrows();
// 		//this.getCookingSteps();
// 		this.totalElements = this.productOnEdit.cookingSteps.length;
// 		//console.log(this.productOnEdit.cookingSteps,'ngOninit')
// 	}

// 	public langObjRefreshed(e) {
// 		this.cookingStepUpdatedLang = this.clone(e.langsObj);	
// 	}

// 	public getUtensils() {
// 		this.utensilService.getUtensil(1000000, 0, '', '').subscribe(
// 			(data: any) => {
// 				this.utensils = data.utensils;
// 			},
// 			(err) => {
// 				alert("Error descargando herramientas");
// 			}
// 			);
// 	}

// 	public getProcesses() {
// 		this.processService.getProcess(1000000, 0, '', '').subscribe(
// 			(data: any) => {
// 				this.processes = data.process;
// 				////console.log(this.processes)
// 			},
// 			(err) => {
// 				alert("Error descargando procesos");
// 			}
// 			);
// 	}

// 	public getCookingSteps() {
// 		//This is just an endpoint to get the cooking steps with the user lang. I could not manage to do that with the get product 
// 		//version endpoint. 
// 		this.productService.getCookingSteps(this.productOnEdit._id, this.productOnEdit.versionId).subscribe(
// 			(data: any) => {
// 				this.cookingSteps = data;
// 				////console.log(this.cookingSteps,)
// 			},
// 			(err) => {
// 				alert("Error descargando procesos");
// 			}
// 			);
// 	}

// 	public getCheckpoints() {
// 		this.checkpointService.getCheckpoint('gastronomic',1000000, 0, '', '').subscribe(
// 			(data: any) => {
// 				this.gastroCheckpoints = data.checkpoints;
// 			},
// 			(err) => {
// 				alert("Error descargando puntos de control gastronómicos");
// 			}
// 			);

// 		this.checkpointService.getCheckpoint('critical',1000000, 0, '', '').subscribe(
// 			(data: any) => {
// 				this.criticalCheckpoints = data.checkpoints;
// 			},
// 			(err) => {
// 				alert("Error descargando puntos de control criticos");
// 			}
// 			);
// 	}

// 	public addCookingStep(){

// 			this.forceRefreshCS.emit(true);

// 			let cookingStepObj = {
// 				process: this.cookingStep.process,
// 				utensil: this.cookingStep.utensil,
// 				time: this.cookingStep.time,
// 				temperature: this.cookingStep.temperature,
// 				temperatureProbe: this.cookingStep.temperatureProbe,
// 				pressure: this.cookingStep.pressure,
// 				vacuum: this.cookingStep.vacuum,
// 				power: this.cookingStep.power,
// 				criticalCheckpoint: this.cookingStep.criticalCheckpoint,
// 				gastroCheckpoint: this.cookingStep.gastroCheckpoint,
// 				images: this.cookingStep.images,
// 				videos: this.cookingStep.videos,
// 				lang: this.clone(this.cookingStepUpdatedLang)
// 			}

// 			this.productOnEdit.cookingSteps.push(cookingStepObj);
// 			this.totalElements = this.productOnEdit.cookingSteps.length;
// 			this.flagAddForm=false;
// 			this.hiddenTabButtons.emit(false);	
// 	  	this.tagUpAndDownArrows();
// 			this.cleanAndResetFields();
//   	}

//   	public editCookingStep(){


// 			this.forceRefreshCSForEdit.emit(true);

// 			let cookingStepObj = {
// 				process: this.cookingStepOnEdit.process,
// 				utensil: this.cookingStepOnEdit.utensil,
// 				time: this.cookingStepOnEdit.time,
// 				temperature: this.cookingStepOnEdit.temperature,
// 				temperatureProbe: this.cookingStepOnEdit.temperatureProbe,
// 				power: this.cookingStepOnEdit.power,
// 				vacuum: this.cookingStepOnEdit.vacuum,
// 				pressure: this.cookingStepOnEdit.pressure,
// 				criticalCheckpoint: this.cookingStepOnEdit.criticalCheckpoint,
// 				gastroCheckpoint: this.cookingStepOnEdit.gastroCheckpoint,
// 				images: this.cookingStepOnEdit.images,
// 				videos: this.cookingStepOnEdit.videos,
// 				lang: this.clone(this.cookingStepUpdatedLang)
// 			}

//   		//replace object in position productElementOnEditIndex
//   		this.productOnEdit.cookingSteps.splice(this.cookingStepOnEditIndex,1,cookingStepObj);
//   		////console.log(this.productOnEdit.cookingSteps)
//   		this.flagEditForm=false;
// 			this.hiddenTabButtons.emit(false);

//   	}

//   	public deleteCookingStep(index) {
//   		this.productOnEdit.cookingSteps.splice(index,1);

//   		this.totalElements = this.productOnEdit.cookingSteps.length;

//   		if(this.totalElements>0) 
//   		{
//   			this.cleanAndResetFields();
//   			this.tagUpAndDownArrows();
//   		}
//   	}


//   	public cleanAndResetFields(){

//   		this.cookingStepLang = {
// 				description: '',
// 				criticalCheckpointNote: '',
// 				gastroCheckpointNote:''
// 			}

//   		this.cookingStep.process=this.processes[0];
//   		this.cookingStep.utensil=this.utensils[0];
//   		this.cookingStep.criticalCheckpoint=this.criticalCheckpoints[0];
//   		this.cookingStep.gastroCheckpoint=this.gastroCheckpoints[0];
//   		this.cookingStep.time=0;
// 			this.cookingStep.temperature=0;
// 			this.cookingStep.temperatureProbe= 0;
// 			this.cookingStep.pressure= 0;
// 			this.cookingStep.power=0;
// 			this.cookingStep.vacuum=0;
// 			this.cookingStep.images = [],
// 			this.cookingStep.videos = []

//   	}

//   	public gastroCheckpointSelected(index, add){

//   		if(add){	
//   			this.cookingStep.gastroCheckpoint=this.gastroCheckpoints[index];

//   		}else
//   		{
//   			this.cookingStepOnEdit.gastroCheckpoint=this.gastroCheckpoints[index];
//   		}

//   	}

//   	public criticalCheckpointSelected(index, add){
//   		if(add){
//   			this.cookingStep.criticalCheckpoint=this.criticalCheckpoints[index];
//   		}else
//   		{
//   			this.cookingStepOnEdit.criticalCheckpoint=this.criticalCheckpoints[index];
//   		}
//   	}

//   	public processSelected(index, add) {
//   		if(add){
//   			this.cookingStep.process=this.processes[index];
//   		}else
//   		{
//   			this.cookingStepOnEdit.process=this.processes[index];
//   		}
//   	}

//   	public utensilSelected(index, add) {
//   		if(add){
//   			this.cookingStep.utensil=this.utensils[index];
//   		}else
//   		{
//   			this.cookingStepOnEdit.utensil=this.utensils[index];
//   		}
//   	}

//   	public selectCookingStepToEdit(cookingStep, index){

//   		//We can't use this.cookingStepOnEdit=cookingStep because it does a deep copy. This means that
//   		//when updating this.cookingStepOnEdit we are actually updating this.productOnEdit. As a result, when
//   		//the user updates values in the edit form before pressing 'save', it is already updating productOnEdit which
//   		//is not what we want.
//   		//Instead we use Object.assign which makes a copy but does not do deep linking.

//   		this.cookingStepOnEdit = this.clone(cookingStep);

//   		//console.log('cooking step')
//   		//console.log(this.cookingStepOnEdit);

//   		this.cookingStepOnEditIndex = index;

//   		this.forceRefreshCSForEdit.emit(cookingStep.lang);

//   	}

// 	public tagUpAndDownArrows(){
// 		var numSteps = this.productOnEdit.cookingSteps.length;

// 		//reset up and down tags
// 		this.productOnEdit.cookingSteps.map((step) => {
// 			step.stepDown=false;
// 			step.stepUp=false;
// 		})

// 		this.productOnEdit.cookingSteps.forEach((step, index) => {
// 			if (index>0) step.stepUp=true;
// 			if( index<(numSteps-1)) step.stepDown=true; 
// 		})
// 	}

// 	public moveStepUp(cookingStep, index) {
// 		let step=this.clone(cookingStep);
  	
//   	//delete object in position index
// 		this.productOnEdit.cookingSteps.splice(index,1);

// 		//insert object in new position 
// 		this.productOnEdit.cookingSteps.splice(index-1,0,step);

// 		this.tagUpAndDownArrows();

// 	}

// 	public moveStepDown(cookingStep, index) {
// 		let step=this.clone(cookingStep);

//   	//delete object in position index
// 		this.productOnEdit.cookingSteps.splice(index,1);

// 		//insert object in new position 
// 		this.productOnEdit.cookingSteps.splice(index+1,0,step);

// 		this.tagUpAndDownArrows();
// 	}

// 	public showAddForm() {
// 		this.flagAddForm=true;
// 		this.hiddenTabButtons.emit(true);
// 	}

// 	public hideAddForm() {
// 		this.flagAddForm=false;
// 		this.hiddenTabButtons.emit(false);
// 	}

// 	public showEditForm() {
// 		this.flagEditForm=true;
// 		this.flagViewForm=false;
// 		this.hiddenTabButtons.emit(true);
// 		this.viewEdit=false;
// 	}

// 	public hideEditForm() {
// 		this.flagEditForm=false;
// 		this.hiddenTabButtons.emit(false);
// 	}

// 	public showViewForm() {
// 		this.flagViewForm=true;
// 		this.flagEditForm=false;
// 		this.hiddenTabButtons.emit(true);
// 		this.viewEdit=true;
// 	}

// 	public hideViewForm() {
// 		this.flagViewForm=false;
// 		this.hiddenTabButtons.emit(false);
// 	}

// 	//public showAddCookingSteps(){
// 	//	//console.log('botón añadir')
// 	//	this.hiddenTabButtons=true;
// 	//}
//   }