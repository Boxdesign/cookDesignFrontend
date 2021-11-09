import { Component, OnInit, DoCheck, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dish-production-edit',
  templateUrl: './dish-production-edit.component.html',
  styleUrls: ['./dish-production-edit.component.scss']
})
export class DishProductionEditComponent implements OnChanges {

	@Input() dish;
  @Input() netWeight;
  public totalGrossWeight;
  public totalNetWeight;
  public calculMethod='calculByGrossWeight';
  public simulationGrossWeight;
  public totalOneGrossValue=0;
  public totalOneNetValue=0;
  public mode;

  constructor(public route: ActivatedRoute) { 

  }

  ngOnInit() {

    if (this.dish) {
      this.calculateOneValueTotals();
    }
    this.route.data.subscribe((data: {mode:string}) => {
        if(data.mode) this.mode = data.mode;
      });

    this.dish.simulationNetWeight = this.dish.batchServings;
  }

  ngOnChanges(changes: SimpleChanges) {
	  for (let propName in changes) {
	    let chng = changes[propName];
	    let cur  = JSON.stringify(chng.currentValue);
	    let prev = JSON.stringify(chng.previousValue);
	    if (propName == 'netWeight' && cur!=prev){
	    	this.calculateOneValueTotals();
	    }
		 }
	}

 //  ngDoCheck() {
 //  	if (this.dishOnEdit && (this.dishOnEdit.netWeight !== this.oldNetWeight)) {
 //  		this.calculateOneValueTotals();
	//     this.oldNetWeight=this.dishOnEdit.netWeight;
	// }
 //  }

 public calculateOneValueTotals(){
  	this.dish.totalOneGrossValue=0;
  	this.dish.totalOneNetValue=0;
  	this.totalGrossWeight=0;

  	this.dish.composition.find((element) => {
  		element.oneGrossValue = element.grossWeight/this.dish.netWeight;
  		this.dish.totalOneGrossValue+=element.oneGrossValue;
  		element.oneNetValue = element.grossWeight*(1-(element.wastePercentage/100))/this.dish.netWeight;
  		this.dish.totalOneNetValue+=element.oneNetValue;

  		if(this.dish.simulationNetWeight) {
        this.totalGrossWeight+=element.oneGrossValue*this.dish.simulationNetWeight;
      }
  	})

  }

}
