import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'search-box',
  templateUrl: './search-box.template.html',
  styles: [`
      .search-input {
          height: 34px;
          padding: 6px 12px;
          font-size: 14px;
          line-height: 1.42857;
          color: #555555;
          background-color: #fff;
          background-image: none;
          border: 1px solid #ccc;
          width: 200px;
      }
  `]
})
export class SearchBoxComponent {
  @Output() onSearchEntered: EventEmitter<any>;
  @Input() public label: string = '';
  @Input() public inputText: string = '';

  constructor(){
    this.onSearchEntered = new EventEmitter();
  }

  onKey(value: string) {
    this.inputText = value;
    this.onSearchEntered.emit(this.inputText);
    //this.inputText = '';
  }

  onBlur(value: string) {
    //this.inputText = value;
    //if (this.inputText!='') {
    //    this.onSearchEntered.emit(this.inputText);
    //}
    //this.inputText = '';
  }

  clearSearch(){
  	this.inputText='';
    this.onSearchEntered.emit(this.inputText);
  }
}