import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'location-cost-table',
  templateUrl: './location-cost-table.component.html',
  styleUrls: ['./location-cost-table.component.scss']
})
export class LocationCostTableComponent implements OnInit {

	@Input() public costs;

  constructor() { }

  ngOnInit() {
  }

}
