import { Component, OnInit, Input } from '@angular/core';
import { IngredientsService } from '../../../articles/ingredients/ingredients.service';
import { DishService } from '../../../recipes/dishes/dish.service';
import { DrinkService } from '../../../recipes/drinks/drink.service';
import { ProductsService } from '../../../recipes/products/products.service';
import { SubproductsService } from '../../../recipes/subproducts/subproducts.service';

@Component({
  selector: 'location-allergen-table',
  templateUrl: './location-allergen-table.component.html',
  styleUrls: ['./location-allergen-table.component.scss']
})
export class LocationAllergenTableComponent implements OnInit {

  @Input() public ingId;
  @Input() public dishId;
  @Input() public drinkId;
  @Input() public productId;
  @Input() public subproductId;
	@Input() public versionId;
	public locAllergens;
  constructor(
		public ingredientService: IngredientsService, 
    public dishService: DishService,
    public drinkService: DrinkService,
    public productsService: ProductsService,
    public subproductsService: SubproductsService
  	) { }

  ngOnInit() {   
  	
  	this.getLocationAllergens()
  }

  private getLocationAllergens() {
    if(this.ingId) {
  		this.ingredientService.getLocAllergens(this.ingId).subscribe(
  			(data: any) => {
  				this.locAllergens = data;
  			})
    }
    if(this.dishId) {
      
      this.dishService.getLocAllergens(this.dishId, this.versionId).subscribe(
        (data: any) => {
          this.locAllergens = data;          
        })
    }
    if(this.drinkId) {           
      this.drinkService.getLocAllergens(this.drinkId, this.versionId).subscribe(
        (data: any) => {
          this.locAllergens = data;          
        })
    }
    if(this.productId) {      
      
      this.productsService.getLocAllergens(this.productId, this.versionId).subscribe(
        (data: any) => {
          this.locAllergens = data;          
        })
    }
    if(this.subproductId) {     
      
      this.subproductsService.getLocAllergens(this.subproductId, this.versionId).subscribe(
        (data: any) => {
          this.locAllergens = data;
          
        })
    }
	}

}
