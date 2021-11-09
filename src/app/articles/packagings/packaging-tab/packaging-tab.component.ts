import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { PackagingsService } from '../packagings.service';
import { Subject, Observable} from 'rxjs/Rx';
import { CompassService } from '../../../global-utils/services/compass.service';
import { SessionService } from '../../../global-utils/services/session.service';
import { ConfirmationService } from 'primeng/primeng'
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'packaging-tab',
  templateUrl: './packaging-tab.component.html',
  styleUrls: ['./packaging-tab.component.scss']
})
export class PackagingTabComponent implements OnInit {
	public id: string;	
	public tab: string;
	public name: string;
	public mode: string;
	public packagingOnEdit;
  public redirectOn: boolean = false;
  public deactivate: Subject<boolean> = new Subject();
	public locPrices;
	public isAdmin;
	public redirectData;
  public alertHeader;
  public alertMessage;

	constructor(
		public route: ActivatedRoute, 
		public packagingService: PackagingsService,
		public router: Router, 
		public compassService: CompassService,
		public sessionService: SessionService,
    public confirmationService: ConfirmationService,
    public translate: TranslateService,
		) 
	{ 
		route.params.subscribe(params => {this.id=params['id']; this.tab=params['tab'];});
		// console.log('route params');
		// console.log(this.id);
		// console.log(this.action);
	}

	ngOnInit(){
    //Get mode from route path
  	this.sessionService.isAdmin().subscribe((value) => {
  		this.isAdmin = value;
  	});
  	this.redirectData = this.compassService.getRedirectData();	
  	
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });


		this.route.params.subscribe(params => {this.id=params['id']; this.tab=params['tab'];});

   	this.translation();
		this.getPackaging();
		this.getLocationPrices();
	}

  public translation(){
    this.translate.get('messageGeneric.alert').subscribe((res: string) => {
      this.alertHeader = res;
    });  

    this.translate.get('messageGeneric.alertMessage').subscribe((res: string) => {
      this.alertMessage = res;
    }); 
  }

  canDeactivate(): Subject<boolean> | boolean {

    //Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (this.mode == 'view') {
      //Delete redirect data when the user cancel the route thread
      if(!this.redirectOn) {
        this.compassService.deleteRedirectData();
      }
      return true;
    }

    //Otherwise ask the user with the dialog service and return its
    //promise which resolves to true or false when the user decides
    this.confirmAction();
    return this.deactivate;
  }

  public confirmAction() {
    this.confirmationService.confirm({
        header: this.alertHeader,
        message: this.alertMessage,
        icon: "fa fa-exclamation-triangle",
        accept: () => {
          this.deactivate.next(true);
        },
        reject: () => {
          this.deactivate.next(false);
        }      
      });
  }

  public setRedirectOn(e){
  	this.redirectOn=true;
  }

	public getPackaging(){
		//Get the ingredient being edited. Only includes the active language of multilingual fields
    this.packagingService.getPackaging(this.id).subscribe(
      (data: any) => {
      	this.packagingOnEdit=data;
      	this.name = data.lang[0].name
     })
	}

	public getLocationPrices() {
		this.packagingService.getLocPrices(this.id).subscribe(
			(data: any) => {
				this.locPrices = data;
			})
	}	

	public editPackaging(){
    //No delete redirect data
    this.redirectOn = true;
    this.router.navigate(['/articles/packagings/edit/',this.id]);
	}	

	public redirect(){

	if(this.redirectData && this.redirectData.activated) { //user came from articles tab in providers, need to redirect back to providers
      let _id = this.redirectData.id;
      let _versionId = this.redirectData.versionId;
      let mode = this.redirectData.mode;
      let originPath = this.redirectData.originPath;
      
      //No delete redirect data
      this.redirectOn = true;

      //Reset redirect data.
      this.compassService.resetRedirectData();

      if (mode == 'edit') {
        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, tab: 'menu'}]);
      } else if (this.redirectData.mode == 'view') {
        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, tab: 'menu'}]);
      }
     } else { //user came from recipes
       this.router.navigate(['./articles/packagings']);
     }
   }	
}
