import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KitchenService } from "../../../libraries/kitchen/kitchen.service";
import { NotificationsService } from 'angular2-notifications'
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";

@Component({
	selector: 'kitchen-select',
	templateUrl: './kitchen-select.component.html',
	styleUrls: ['./kitchen-select.component.css']
})
export class KitchenSelectComponent implements OnInit {
	@Input() public recipeKitchens;  
	@Input() public mode;
	public workRooms = null;
	public totalItemsKitchen: number;
	public kitchens;
	public kitchen = null;
	public workRoom = null;
	public addKitchen: boolean = false;
	public observerLocation;
  public filterLocations = [];

	constructor(
		public kitchenService: KitchenService, 
		public notification: NotificationsService,
    public costFilterService: CostFilterService, 
	) { }

	ngOnInit() {
		this.getKitchens();
		this.populateWorkRooms();

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
      	this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
        this.getKitchens();
    })		
	}

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
	}

	public getKitchens(){

		this.kitchenService.getKitchens(10000, 0, '', '', 1, this.filterLocations).subscribe(
			(data: any)=>{
				this.kitchens = data.kitchens;
				////console.log(this.kitchens,'kitchens');
				this.totalItemsKitchen = data.totalElements;

			},(err)=>{
				this.notification.error('Error', err || 'Server error');
			})    
	}

	public populateWorkRooms() {

		for (var i=0; i<this.recipeKitchens.length; i++) {

			var wRTmp = this.recipeKitchens[i].workRoom
			this.recipeKitchens[i].workRoom = this.recipeKitchens[i].kitchen.workRooms.find (function (workRoom) {
				return workRoom._id == wRTmp
			});
		}
	}

	public kitchenSelected(){
		// let selectedKitchen = this.kitchens.find((kitchen)=>{ return kitchen._id == this.kitchen._id });
		// this.workRooms = selectedKitchen.workRooms;
		this.workRoom = null;
		this.workRooms = this.kitchen.workRooms;
	}

	public saveKitchen(){

		if(this.kitchen == 'null') this.kitchen = null;

		if (!this.recipeKitchens) this.recipeKitchens = []
		
		this.addKitchen=false;

		if (this.kitchen!=null) {
			this.recipeKitchens.push(
			{
				kitchen: this.kitchen, 
				workRoom: this.workRoom
			})
		} 

		this.kitchen = null; 
		this.workRoom = null;
		this.workRooms = null;
	}

	public deleteKitchen(i) {
		this.recipeKitchens.splice(i, 1)
	}
}
