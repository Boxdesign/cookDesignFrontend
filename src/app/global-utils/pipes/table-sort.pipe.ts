import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'tableSort'})
export class tableSortPipe implements PipeTransform {
 transform(allElements: any, sortField: string , sortOrder: number, currentPage: number, itemsPerPage: number): any {

 		if (currentPage && itemsPerPage) {
 			allElements = allElements.slice((currentPage - 1) * itemsPerPage, ((currentPage - 1) * itemsPerPage) + itemsPerPage)
 		}

  	if (allElements && sortField && sortOrder) {
  		allElements.map(element => element.init = false)
			var array = sortField.split('.'); //convert 'element.kind.' to ["element", "kind", ""]  		
			array = array.filter(function(entry) { return entry.trim() != ''; });//remove empty elements
			switch (array.length) {
				case 1:
		   	allElements.sort(
		    	(a,b) => {
		    		if (typeof(a[array[0]])=='string') {
		    			return (a[array[0]].toUpperCase() > b[array[0]].toUpperCase()) ? sortOrder : ((b[array[0]].toUpperCase() > a[array[0]].toUpperCase()) ? -sortOrder : 0);
		    		} else if (typeof(a[array[0]])=='number') {
		    			return (a[array[0]] > b[array[0]]) ? sortOrder : ((b[array[0]] > a[array[0]]) ? -sortOrder : 0);		    		
		    		}
		    	});
				break;
				case 2:
		    	allElements.sort(
		    	(a,b) => {
		    		if (typeof(a[array[0]])=='string') {
		    			return (a[array[0]][array[1]].toUpperCase() > b[array[0]][array[1]].toUpperCase()) ? sortOrder : ((b[array[0]][array[1]].toUpperCase() > a[array[0]][array[1]].toUpperCase()) ? -sortOrder : 0);
		    		} else if (typeof(a[array[0]])=='number') {
		    			return (a[array[0]][array[1]] > b[array[0]][array[1]]) ? sortOrder : ((b[array[0]][array[1]] > a[array[0]][array[1]]) ? -sortOrder : 0);		    		
		    		}
		   		});
				break;
				}
  		}
  	return allElements;
	}
}







