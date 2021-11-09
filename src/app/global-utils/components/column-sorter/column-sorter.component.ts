import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'column-sorter',
  templateUrl: './column-sorter.template.html'
})
export class ColumnSorterComponent {

  @Input() sortField: string;
  @Output() sortFieldChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() sortOrder: number;
  @Output() sortOrderChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() label:string;
  @Input() value:string;
  @Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(){}

  sortColumn(field:string) {
    if(this.sortField == field) {
      this.sortOrder = -this.sortOrder;
    } else {
      this.sortOrder = 1;
    }
    this.sortOrderChange.emit(this.sortOrder);
    this.sortField = field;
    this.sortFieldChange.emit(this.sortField);
    this.onChange.emit(true);
  }
}