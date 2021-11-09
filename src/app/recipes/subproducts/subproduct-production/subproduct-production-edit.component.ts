import { Component, OnInit, DoCheck, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'subproduct-production-edit',
  templateUrl: './subproduct-production-edit.component.html',
  styleUrls: ['./subproduct-production-edit.component.scss']
})
export class SubproductProductionEditComponent implements OnChanges {
  @Input() subproduct;
  @Input() netWeight;
  public totalGrossWeight;
  public totalNetWeight;
  public calculMethod='calculByGrossWeight';
  public simulationGrossWeight;
  public totalOneGrossValue=0;
  public totalOneNetValue=0;
  public mode

  constructor(public route: ActivatedRoute) { 

  }

  ngOnInit() {
    this.route.data.subscribe((data: {mode:string}) => {
        if(data.mode) this.mode = data.mode;
      });

    this.subproduct.simulationNetWeight = this.subproduct.batchWeight;
    ////console.log(this.subproduct,'subproductOnEditProduction')
    if (this.subproduct) {
      this.calculateOneValueTotals();
    }
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
 //  	if (this.subproductOnEdit && (this.subproductOnEdit.netWeight !== this.oldNetWeight)) {
 //  		this.calculateOneValueTotals();
	//     this.oldNetWeight=this.subproductOnEdit.netWeight;
	// }
 //  }

 public calculateOneValueTotals(){
  	this.subproduct.totalOneGrossValue=0;
  	this.subproduct.totalOneNetValue=0;
  	this.totalGrossWeight=0;

  	this.subproduct.composition.find((element) => {
  		element.oneGrossValue = element.grossWeight/this.subproduct.netWeight;
  		this.subproduct.totalOneGrossValue+=element.oneGrossValue;
  		element.oneNetValue = element.grossWeight*(1-(element.wastePercentage/100))/this.subproduct.netWeight;
  		this.subproduct.totalOneNetValue+=element.oneNetValue;

  		if(this.subproduct.simulationNetWeight) {
        this.totalGrossWeight+=element.oneGrossValue*this.subproduct.simulationNetWeight;
     
      }
       ////console.log(this.subproductOnEdit.simulationNetWeight,'subproductOnEdit2')
  	})
  }

}
