import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'loading-gif',
  templateUrl: './loading-gif.component.html',
  styleUrls: ['./loading-gif.component.css']
})
export class LoadingGifComponent {

  @Input() loading:boolean = false;
  @Input() updating:boolean = false;
  @Input() type: string
  constructor(){}

}