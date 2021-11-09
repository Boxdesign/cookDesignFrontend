import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'compositionSort'})
export class CompositionSortPipe implements PipeTransform {
 transform(allElements: any, sortField: string , sortOrder: number): any {
  	if (allElements && sortField && sortOrder) {
  		allElements.map(element => element.init = false)
		var array = sortField.split('.'); //convert 'element.kind.' to ["element", "kind", ""]  		
		array = array.filter(function(entry) { return entry.trim() != ''; });//remove empty elements
		switch (array.length) {
			case 1:
		   allElements.sort(
		    (a,b) => {
		    	return (a[array[0]] > b[array[0]]) ? sortOrder : ((b[array[0]] > a[array[0]]) ? -sortOrder : 0);
		    });
		break;
			case 2:
		    allElements.sort(
		    (a,b) => {
		    	return (a[array[0]][array[1]] > b[array[0]][array[1]]) ? sortOrder : ((b[array[0]][array[1]] > a[array[0]][array[1]]) ? -sortOrder : 0);
		   });
		break;
			}
  		}
  	return allElements;
	}
}







