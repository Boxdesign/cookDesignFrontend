import { Component, OnInit, DoCheck, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'drink-production',
  templateUrl: './drink-production.component.html',
  styleUrls: ['./drink-production.component.scss']
})
export class DrinkProductionComponent implements OnChanges {

	@Input() drink;
  @Input() netWeight;
  public totalGrossWeight;
  public totalNetWeight;
  public calculMethod='calculByGrossWeight';
  public simulationGrossWeight;
  public totalOneGrossValue=0;
  public totalOneNetValue=0;
  public mode;
  public status;

  constructor(public route: ActivatedRoute) { 

  }

  ngOnInit(){

    if (this.drink) {
      this.calculateOneValueTotals();
    }
    
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
      //console.log(this.mode,'mode')
    });

    this.drink.simulationNetWeight = this.drink.batchServings;
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
  	this.drink.totalOneGrossValue=0;
  	this.drink.totalOneNetValue=0;
  	this.totalGrossWeight=0;

  	this.drink.composition.find((element) => {
  		element.oneGrossValue = element.grossWeight/this.drink.netWeight;
  		this.drink.totalOneGrossValue+=element.oneGrossValue;
  		element.oneNetValue = element.grossWeight*(1-(element.wastePercentage/100))/this.drink.netWeight;
  		this.drink.totalOneNetValue+=element.oneNetValue;

  		if(this.drink.simulationNetWeight) {
        this.totalGrossWeight+=element.oneGrossValue*this.drink.simulationNetWeight;
      }
  	})

  }

}
