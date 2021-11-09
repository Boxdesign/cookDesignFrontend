import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from '../../services/location.service'
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'location-cost-refresh',
  templateUrl: './location-cost-refresh.component.html',
  styleUrls: ['./location-cost-refresh.component.css']
})
export class LocationCostRefreshComponent implements OnInit {

	@Input() model
	@Input() id
  public options = {
     	timeOut: 2500,
    	position: ["top", "right"]
   }
   public successTitle: string;
   public successDetail: string;
   public failedTitle: string;
   public failedDetail: string;
   public isAdmin;

  constructor(
  	private locationService: LocationService,
  	private notificationService: NotificationsService,
  	private translateService: TranslateService
  ) 
  { }

  ngOnInit() {

  	this.translate();

  }

  private translate() {

			this.translateService.get('messageGeneric.locationUpdateStartedTitle').subscribe((res: string) => {
	      this.successTitle = res;
	    });

			this.translateService.get('messageGeneric.locationUpdateStartedDetail').subscribe((res: string) => {
	      this.successDetail = res;
	    }); 
  }

  public updateArticleLocationCost() {

  	if(!this.model || !this.id) {
  		//Do nothing, one or all inputs are missing
  	} else {

  		if(this.model == 'ingredient') {

		  	this.locationService.updateIngredientLocCost(this.model, this.id).subscribe(
		  		(res) => {

		  			//console.log('all good')
		  			this.notificationService.success(this.successTitle, this.successDetail)

		  	}, (err) => {

		  			//console.log('error')

		  			this.notificationService.error('Error', err || 'Server error');
		  	})

		  }
		  else if(this.model == 'packaging') {

				this.locationService.updatePackagingLocCost(this.model, this.id).subscribe(
		  		(res) => {

		  			//console.log('all good')
		  			this.notificationService.success(this.successTitle, this.successDetail)

		  	}, (err) => {

		  			//console.log('error')

		  			this.notificationService.error('Error', err || 'Server error');
		  	})		  	

		  }
	  }
  }

}
