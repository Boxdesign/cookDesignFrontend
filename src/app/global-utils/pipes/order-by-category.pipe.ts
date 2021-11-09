import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'orderByCategory'})
export class OrderByCategoryPipe implements PipeTransform {
  transform(allElements: any[], activeOrderBy:number): any {
    
    var sortedElements: any[] = [];
    var filteredElements: any[] = [];

    allElements.map(element => element.init = false)

    filteredElements=allElements.filter(element => element.category == 'mainProduct');
    if(filteredElements.length >0) {
      filteredElements[0].init=true;
      for(var i=0; i < filteredElements.length; i++ ) {
        sortedElements.push(filteredElements[i]);
      }
    }

    filteredElements=[];

    filteredElements=allElements.filter(element => element.category == 'dressing');
    if(filteredElements.length >0) {
      filteredElements[0].init=true;
      for(var i=0; i < filteredElements.length; i++ ) {
        sortedElements.push(filteredElements[i]);
      }
    }

    filteredElements=[];

    filteredElements=allElements.filter(element => element.category == 'sauce');
    if(filteredElements.length >0) {
      filteredElements[0].init=true;
      for(var i=0; i < filteredElements.length; i++ ) {
        sortedElements.push(filteredElements[i]);
      }
    }

    filteredElements=[];

    filteredElements=allElements.filter(element => element.category == 'addition');
    if(filteredElements.length >0) {
      filteredElements[0].init=true;
      for(var i=0; i < filteredElements.length; i++ ) {
        sortedElements.push(filteredElements[i]);
      }
    }

    return sortedElements;
  }
}