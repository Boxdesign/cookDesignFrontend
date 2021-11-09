/**
 * Created by odin on 12/08/16.
 */
import {Component} from '@angular/core';

@Component({
  selector: 'recipes',
  templateUrl: './recipes.template.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent {
	public showSideMenu:boolean;
    constructor() { 
    }

    ngOnInit(){
    }

    showSideBarMenu(show:boolean) {
    	this.showSideMenu = show;
    }
}
