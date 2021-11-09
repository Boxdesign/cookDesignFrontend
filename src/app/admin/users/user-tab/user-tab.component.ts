import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'user-tab',
  templateUrl: './user-tab.component.html',
  styleUrls: ['./user-tab.component.scss']
})
export class UserTabComponent implements OnInit {
  public mode;
  public tab;

  constructor(public route: ActivatedRoute) { 

    //Get tab if provided
    route.params.subscribe(params => {this.tab=params['tab'];});

  	//Get mode from route path
    route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });
  }

  ngOnInit() {
  }

}
