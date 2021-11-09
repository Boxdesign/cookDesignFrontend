import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'items-per-page',
  templateUrl: './items-per-page.template.html',
  styles: [`
      .items-select {
        height: 34px;
          padding: 0px;
          font-size: 14px;
          line-height: 1.42857;
          color: #555555;
          background-color: #fff;
          background-image: none;
          border: 1px solid #ccc;
      }
      .items-per-page{
        display: inline-block; 
        vertical-align: middle;
      }
  `],
  inputs : [ 'itemOptions', 'defaultOption' ],
  outputs: [ 'onItemSelected' ]
})
export class ItemsPerPageComponent {
  itemOptions: number[];
  defaultOption: number;
  onItemSelected: EventEmitter<any>;

  constructor(){
    this.onItemSelected = new EventEmitter();
  }

  onChange(value) {
    this.onItemSelected.emit(value);
  }
}