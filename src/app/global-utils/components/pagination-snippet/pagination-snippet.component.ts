import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'pagination-snippet',
  templateUrl: './pagination-snippet.template.html',
  styles :['.pagination-snippet {vertical-align: middle; display: inline-block;}'],
  inputs : [ 'currentPage','totalItems', 'itemsPerPage'],
})
export class PaginationSnippetComponent {
  public currentPage: number;
  public itemsPerPage: number;
  public totalItems: number; 

  constructor(){
  }
}