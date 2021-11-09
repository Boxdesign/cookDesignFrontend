/**
 * Created by odin on 4/08/16.
 */
import {Component} from '@angular/core';
import {FamilyService} from "./family.service";
import {TranslateService} from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications'

@Component({
  templateUrl: './family.component.html'
})
export class FamilyComponent {
  public familyCategories;
  public titleIngredient;
  public titleUtensil;
  public titlePackaging;
  public titleRecipe;
  public titleGastroOffering;
  public titleMenu;
  public titleSeason;
  
  constructor(public familyService: FamilyService, public translate: TranslateService, public notification : NotificationsService) {

    this.translate.get('library.family.heading.ingredient').subscribe((res: string) => {
      this.titleIngredient = res;
    });

    this.translate.get('library.family.heading.utensil').subscribe((res: string) => {
      this.titleUtensil = res;
    });

    this.translate.get('library.family.heading.packaging').subscribe((res: string) => {
      this.titlePackaging = res;
    });

    this.translate.get('library.family.heading.recipe').subscribe((res: string) => {
      this.titleRecipe = res;
    });

    this.translate.get('library.family.heading.gastroOffering').subscribe((res: string) => {
      this.titleGastroOffering = res;
    });

    this.translate.get('library.family.heading.menu').subscribe((res: string) => {
      this.titleMenu = res;
    });

    this.translate.get('library.family.heading.season').subscribe((res: string) => {
      this.titleSeason = res;
    });
  }

  ngOnInit() {
    console.log('loading family component')
  }

  public getFamilyCategories() {
    this.familyService.getFamilyCategories().subscribe(
      (data: any) => {
        this.familyCategories = data;
        //console.log(data);
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');       }
    );
  }

}
