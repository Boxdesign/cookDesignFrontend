import {Component} from '@angular/core';
import {TranslateService} from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: './checkpoint-tab.component.html',
})
export class CheckpointTabComponent {
  public familyCategories;
  public titleCritical;
  public titleGastronomic;
  public numPages:number;
  
  constructor(public translate: TranslateService) {

    this.translate.get('library.checkpoint.heading.critical').subscribe((res: string) => {
      this.titleCritical = res;
    });

    this.translate.get('library.checkpoint.heading.gastronomic').subscribe((res: string) => {
      this.titleGastronomic = res;
    });
  }

  ngOnInit() {
  }
 
}