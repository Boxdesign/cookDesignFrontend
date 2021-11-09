import { Component, OnInit, Input } from '@angular/core';
import { AllergenService } from '../../../libraries/allergen/allergen.service'

@Component({
  selector: 'allergen-view',
  templateUrl: './allergen-view.component.html',
  styleUrls: ['./allergen-view.component.scss']
})
export class AllergenViewComponent implements OnInit {
  @Input() public allergens;

  constructor(public allergensService: AllergenService) { }

  ngOnInit() {
  }
}
