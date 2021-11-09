import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'compositionFilterTextDirty', pure: false})
export class CompositionFilterTextDirtyPipe implements PipeTransform {
  transform(allElements: any[], filterText: string): any {
  	if (filterText && allElements) {
    	return allElements.filter(element => element.name.toLowerCase().indexOf(filterText) > -1 );
  	}
	return allElements;
  }
}