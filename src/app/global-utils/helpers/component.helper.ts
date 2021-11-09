import { Response } from '@angular/http'
import { Observable } from 'rxjs/Observable'

export class ComponentHelper {
  arrayToValues(array) {
    var result = []

    if (array) {
      var i = 0
      for (let entry of array) {
          result.push({
            label: entry,
            value: i
          })
          i++
      }
    }

    return result
  }

  removeByAttr (arr, attr, value){
      var i = arr.length;
      while(i--){
         if( arr[i]
             && arr[i].hasOwnProperty(attr)
             && (arguments.length > 2 && arr[i][attr] === value ) ){

             arr.splice(i,1);

         }
      }
      return arr;
  }

  removeByItem(arr, item) {
    var i = arr.length;
    while(i--){
       if( arr[i]
           && arr[i] == item
           ){

           arr.splice(i,1);
       }
    }
    return arr;
  }

  pushValue(array, value) {
    array.push({
      label: value,
      value: array.length
    })
  }

  editValue(array, pos, value) {
    array[pos].label = value
  }

  setFocus(elem) {
    //the 'this' problem http://stackoverflow.com/questions/2130241/pass-correct-this-context-to-settimeout-callback
    setTimeout(() => { elem.nativeElement.focus() }, 100)
  }

  handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  findById(arr, id) {
    function fbi(element) {
      return element.id === id
    }

    return arr.find(fbi)
  }
}