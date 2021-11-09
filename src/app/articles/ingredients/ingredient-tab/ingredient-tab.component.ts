import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientsService } from '../ingredients.service';
import { Subject, Observable} from 'rxjs/Rx';
import { CompassService } from '../../../global-utils/services/compass.service';
import { ConfirmationService } from 'primeng/primeng'
import { TranslateService } from 'ng2-translate/ng2-translate';
import { SessionService } from '../../../global-utils/services/session.service';
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'

@Component({
  selector: 'ingredient-tab',
  templateUrl: './ingredient-tab.component.html',
  styleUrls: ['./ingredient-tab.component.scss']
})
export class IngredientTabComponent implements OnInit {
	public id: string;	
	public tab: string;
	public name: string;
	public mode: string;
  public redirectOn: boolean = false;
  public deactivate: Subject<boolean> = new Subject();
  public alertHeader;
  public alertMessage;
	public locPrices;
  public ingredientOnEdit;
  public isAdmin;
  public filterLocation;
  public redirectData;

	constructor(
		public route: ActivatedRoute, 
		public ingredientService: IngredientsService, 
		public router: Router, 
    public confirmationService: ConfirmationService, 
    public compassService: CompassService, 
    public translate: TranslateService,
   	public sessionService: SessionService,
   	public costFilterService:CostFilterService
  ) 
  {}

	ngOnInit(){

  	this.sessionService.isAdmin().subscribe((value) => {
  		this.isAdmin = value;
  	});
    this.redirectData = this.compassService.getRedirectData();  
    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });

		this.route.params.subscribe(params => {this.id=params['id']; this.tab=params['tab'];});

   	this.translation();
   	this.getIngredient();
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

  public getIngredient(){
  	
    this.ingredientService.getIngredient(this.id,this.filterLocation).subscribe(
    (data:any)=>{
      this.ingredientOnEdit = data
      this.name = this.ingredientOnEdit.lang[0].name;
    })
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

  public setRedirectOn(e){
  	this.redirectOn=true;
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

	public getLocationPrices() {
		this.ingredientService.getLocPrices(this.id).subscribe(
			(data: any) => {
				this.locPrices = data;
			})
	}

	public editIngredient(){
    //No delete redirect data
    this.redirectOn = true;
    this.router.navigate(['/articles/ingredients/edit/',this.id]);
	}

	public editParentIngredient(){
    this.redirectOn = true;
    this.router.navigate(['/articles/ingredients/edit/',this.ingredientOnEdit.quartering]);
	}

	public viewParentIngredient(){
    this.redirectOn = true;
    setTimeout(()=>{this.router.navigate(['/articles/']);}, 100)
    setTimeout(()=>{this.router.navigate(['/articles/ingredients/',this.ingredientOnEdit.quartering]);},200);	
  }

  public redirect() {
    if(this.redirectData && this.redirectData.activated) { //user came from articles tab in providers, need to redirect back to providers
      let _id = this.redirectData.id;
      let _versionId = this.redirectData.versionId;
      let mode = this.redirectData.mode;
      let originPath = this.redirectData.originPath;
      
      //No delete redirect data
      this.redirectOn = true;
      //Reset redirect data.
      this.compassService.resetRedirectData();

      setTimeout(()=> {
					this.router.navigate(['/articles']);      
			},100)

			setTimeout(() => {
	      if (mode == 'edit') {
	        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, tab: 'menu'}]);
	      } else if (this.redirectData.mode == 'view') {
	        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, tab: 'menu'}]);
	      }		
			}, 300)

     } else { //user came from recipes
       this.router.navigate(['./articles/ingredients/']);
     }
  }
}