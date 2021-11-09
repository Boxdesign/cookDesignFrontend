import { Component, OnInit, DoCheck, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'product-production-edit',
  templateUrl: './product-production-edit.component.html',
  styleUrls: ['./product-production-edit.component.scss']
})
export class ProductProductionEditComponent implements OnChanges {
	@Input() product;
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

  ngOnInit(){
    if (this.product) {
      this.calculateOneValueTotals();
    }
    
    this.route.data.subscribe((data: {mode:string}) => {
        if(data.mode) this.mode = data.mode;
      });

    this.product.simulationNetWeight = this.product.batchWeight;
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
 //  	if (this.productOnEdit && (this.productOnEdit.netWeight !== this.oldNetWeight)) {
 //  		this.calculateOneValueTotals();
	//     this.oldNetWeight=this.productOnEdit.netWeight;
	// }
 //  }

 public calculateOneValueTotals(){
  	this.product.totalOneGrossValue=0;
  	this.product.totalOneNetValue=0;
  	this.totalGrossWeight=0;

  	this.product.composition.find((element) => {
  		element.oneGrossValue = element.grossWeight/this.product.netWeight;
  		this.product.totalOneGrossValue+=element.oneGrossValue;
  		element.oneNetValue = element.grossWeight*(1-(element.wastePercentage/100))/this.product.netWeight;
  		this.product.totalOneNetValue+=element.oneNetValue;


  		if(this.product.simulationNetWeight) {
        this.totalGrossWeight+=element.oneGrossValue*this.product.simulationNetWeight;
     
      }
  	})

  }
}
