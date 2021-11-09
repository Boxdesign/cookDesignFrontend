import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'recipeCompositionFilter'})
export class RecipeCompositionFilterPipe implements PipeTransform {
  transform(allElements: any[], categories: number[]): any {
  	var mainProduct='';
  	var sauce='';
  	var dressing='';
  	var addition='';

  	if(categories.find(x => x == 1 )) { 
      mainProduct='mainProduct'; 
    }

    if(categories.find(x => x == 2 )) {
     dressing='dressing';
     }

  	if(categories.find(x => x == 3 )) {
     sauce='sauce'; 
    }

  	if(categories.find(x => x == 4 )) {
     addition='addition'; 
    }

    return allElements.filter(element => element.category == mainProduct || element.category == sauce || element.category == dressing || element.category == addition);
  }
}