import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'compositionFilterText'})
export class CompositionFilterTextPipe implements PipeTransform {
  transform(allElements: any[], filterText: string): any {
  	if (filterText && allElements) {
    	return allElements.filter(element => element.name.toLowerCase().indexOf(filterText) > -1 );
  	}
	return allElements;
  }
}