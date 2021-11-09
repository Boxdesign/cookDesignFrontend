import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'gastroCompositionFilter'})
export class GastroCompositionFilterPipe implements PipeTransform {
  transform(allElements: any[], categories: number[]): any {

    var dish='';
    var drink='';
    var product='';

    if(categories.find(x => x == 1 )) { 
      dish='dish'; 
    }

    if(categories.find(x => x == 2 )) {
     drink='drink';
     }

    if(categories.find(x => x == 3 )) {
     drink='product';
     }
     
    return allElements.filter(element => element.element.kind == dish || element.element.kind == drink || element.element.kind == product);
  }
}