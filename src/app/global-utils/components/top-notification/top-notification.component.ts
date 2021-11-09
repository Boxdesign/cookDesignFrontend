import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'top-notification',
  templateUrl: './top-notification.component.html',
  styleUrls: ['./top-notification.component.css']
})
export class TopNotificationComponent implements OnInit {
	@Input() public msgs;

  constructor() { }

  ngOnInit() {
  }
  public deleteMsg(i) {
		this.msgs.splice(i, 1)
	}

}
