import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { TooltipModule } from "ngx-bootstrap";

@Component({
  selector: 'critical-gastro-checkpoint',
  templateUrl: './critical-gastro-checkpoint.template.html',
  styles: [`
      
  .criticalCheckpoint {
      background: #a1a204;
  }

  .gastroCheckpoint {
      background: #a1a204;
  }
  
  .circle-box{
    position: relative;
    width: 2em;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
  }

  .circle-box:before{
      content: "";
      display: block;
      padding-top: 100%;
  }

  .circle-content{
      display: block;
      font-weight: bold;
      border-radius: 50% !important;
      position:  absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
  }

  .circle-content-div {
     display: table;
     width: 100%;
     height: 100%;
  }

  .circle-content-div span {
      font-size: 0.8em;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      color: white
  }
  `]
})
export class criticalGastroCheckpointComponent implements OnInit {
  @Input() public checkpoint;
  @Input() public criticalCheckpoints;
  @Input() public gastroCheckpoints;
  public criticalCheckpoint;
  public gastroCheckpoint;

  constructor(){
  }

  ngOnInit(){
    if (this.criticalCheckpoints) {
      this.criticalCheckpoint = this.criticalCheckpoints.find(c => c._id == this.checkpoint);
    }
    if (this.gastroCheckpoints) {
      this.gastroCheckpoint = this.gastroCheckpoints.find(c => c._id == this.checkpoint);
    }
  }
}

// lo que tiene que entrar es this.cookinstep.criticalChecpoint.type
//  y this.cookinstep.criticalChecpoint.type que es string que puede ser critical o gastronomic

//  por otro lado entra this.cookingstepp.lang.criticalCheckpointNote y this.cookingstepp.lang.gastroCheckpointNote que string tb