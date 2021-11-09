import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GastroOfferService } from "../gastro-offer.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { NotificationsService } from 'angular2-notifications';
import { Subject, Observable} from 'rxjs/Rx'
import { ConfirmationService } from 'primeng/primeng'
import { CompassService } from '../../../global-utils/services/compass.service'
import { CostFilterService } from "../../../global-utils/services/cost-filter.service";
import * as _ from 'underscore';

@Component({
  selector: 'gastro-offer-tab',
  templateUrl: './gastro-offer-tab.component.html',
  styleUrls: ['./gastro-offer-tab.component.scss']
})
export class GastroOfferTabComponent implements OnInit {

	public id: string;
	public versionId: string;
	public tab: string = 'menu';
	public menuOnEdit;
	public originalMenuOnEdit;
	public forceRefreshForEditMain = new EventEmitter();
	public userLang;
	public notificationOptions = {
	   	timeOut: 3000,
	    position: ["top", "right"]
    }

	public newMenuVersionTitle;
	public newMenuVersionContent;
	public newMenuVersionContentLocWarning;

  public menuType;
  public newDailyMenuCarteVersionTitle;
  public newDailyMenuCarteVersionContent;
  public newDailyMenuCarteVersionContentLocWarning;

  public newBuffetVersionTitle;
  public newBuffetVersionContent;
  public newBuffetVersionContentLocWarning;

  public newCarteVersionTitle;
  public newCarteVersionContent;
  public newCarteVersionContentLocWarning;

  public newFixedPriceCarteVersionTitle;
  public newFixedPriceCarteVersionContent;
  public newFixedPriceCarteVersionContentLocWarning;

  public newCatalogVersionTitle;
  public newCatalogVersionContent;
  public newCatalogVersionContentLocWarning;

  public locationCost;
  public viewMode: boolean=false;
  public deactivate: Subject<boolean> = new Subject();
  public alertHeader;
  public alertMessage;
  public saving: boolean = false;
  public clone = require('clone');
  public yesLabel;
  public noLabel;
	public totalLocCost = [];
	public meanLocCost = [];
	public filterLocations = [];
	public loading : boolean
	public duplicateLocation = [];
  public duplicateName;
  public gastroDuplicatedTitle
  public gastroDuplicatedContent
  public redirectOn: boolean = false;
	public redirectData;
	public observerLocation;

	constructor(
		public route: ActivatedRoute, 
		public gastroOfferService: GastroOfferService,  
		public router: Router, 
		public translate: TranslateService, 
		public notification: NotificationsService,
		public confirmationService: ConfirmationService,
		public compassService:CompassService,
		public costFilterService: CostFilterService
		) {
	}

	ngOnInit() {
		this.loading = true

    this.redirectData = this.compassService.getRedirectData();	

		this.route.params.subscribe(params => {this.id=params['id']; this.versionId=params['versionId']; this.tab=params['tab'];});

		//Get type of menu from route path
	  this.route.data.subscribe((data: {menuType: String, viewMode: boolean}) => {
      this.menuType = data.menuType;
      if(data.viewMode) this.viewMode = data.viewMode;
	  });	

		this.translation();
		if(!(this.menuType == 'carte' || this.menuType =='catalog')) this.getLocationCost();

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
      	this.filterLocations = [];
        this.filterLocations = this.filterLocations.concat(data);
    })

 		this.getEditedMenu();
	}

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }
	public translation(){

	    this.translate.get('gastro.menu.notifications.newMenuVersionTitle').subscribe((res: string) => {
	      this.newMenuVersionTitle = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newMenuVersionContent').subscribe((res: string) => {
	      this.newMenuVersionContent = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newMenuVersionContentLocWarning').subscribe((res: string) => {
	      this.newMenuVersionContentLocWarning = res;
	      //console.log('translation: '+ res);
	    });	    

	    this.translate.get('gastro.menu.notifications.newDailyMenuCarteVersionTitle').subscribe((res: string) => {
	      this.newDailyMenuCarteVersionTitle = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newDailyMenuCarteVersionContent').subscribe((res: string) => {
	      this.newDailyMenuCarteVersionContent = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newDailyMenuCarteVersionContentLocWarning').subscribe((res: string) => {
	      this.newDailyMenuCarteVersionContentLocWarning = res;
	      //console.log('translation: '+ res);
	    });	    

	    this.translate.get('gastro.menu.notifications.newBuffetVersionTitle').subscribe((res: string) => {
	      this.newBuffetVersionTitle = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newBuffetVersionContent').subscribe((res: string) => {
	      this.newBuffetVersionContent = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newBuffetVersionContentLocWarning').subscribe((res: string) => {
	      this.newBuffetVersionContentLocWarning = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newCarteVersionTitle').subscribe((res: string) => {
	      this.newCarteVersionTitle = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newCarteVersionContent').subscribe((res: string) => {
	      this.newCarteVersionContent = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newCarteVersionContentLocWarning').subscribe((res: string) => {
	      this.newCarteVersionContentLocWarning = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newFixedPriceCarteVersionTitle').subscribe((res: string) => {
	      this.newFixedPriceCarteVersionTitle = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newFixedPriceCarteVersionContent').subscribe((res: string) => {
	      this.newFixedPriceCarteVersionContent = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newFixedPriceCarteVersionContentLocWarning').subscribe((res: string) => {
	      this.newFixedPriceCarteVersionContentLocWarning = res;
	      //console.log('translation: '+ res);
	    });


	    this.translate.get('gastro.menu.notifications.newCatalogVersionTitle').subscribe((res: string) => {
	      this.newCatalogVersionTitle = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newCatalogVersionContent').subscribe((res: string) => {
	      this.newCatalogVersionContent = res;
	      //console.log('translation: '+ res);
	    });

	    this.translate.get('gastro.menu.notifications.newCatalogVersionContentLocWarning').subscribe((res: string) => {
	      this.newCatalogVersionContentLocWarning = res;
	      //console.log('translation: '+ res);
	    });	    

	    this.translate.get('messageGeneric.alert').subscribe((res: string) => {
	      this.alertHeader = res;
	    });  

	    this.translate.get('messageGeneric.alertMessage').subscribe((res: string) => {
	      this.alertMessage = res;
	    }); 

	    this.translate.get('buttonGeneric.yes').subscribe((res: string) => {
	      this.yesLabel = res;
	    });  

	    this.translate.get('buttonGeneric.no').subscribe((res: string) => {
	      this.noLabel = res;
	    }); 

	    this.translate.get('gastro.menu.notifications.gastroDuplicatedTitle').subscribe((res: string) => {
        this.gastroDuplicatedTitle = res;
      });

      this.translate.get('gastro.menu.notifications.gastroDuplicatedContent').subscribe((res: string) => {
        this.gastroDuplicatedContent = res;
      });
  }

	canDeactivate(): Subject<boolean> | boolean {
    if (this.viewMode) {
      return true;
    }

  	if(this.saving) { //It's save redirection, no need to to confirm redirection with a user dialog.
  		this.saving=false;
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

	public getEditedMenu(){
	    //Get the ingredient being edited.
	    this.gastroOfferService.getMenu(this.id, this.versionId, this.filterLocations).subscribe(
	    	(data: any) => {
	    		this.menuOnEdit = data[0];
	    		//console.log(this.menuOnEdit, 'menu on edit')
	    		//rebuild menu to avoid reference to versions in components
	    		this.menuOnEdit.lang = data[0].versions.lang;
	    		if (typeof data[0].versions._id != 'undefined') this.menuOnEdit.versionId = data[0].versions._id;
	    		if (typeof data[0].versions.composition != 'undefined') this.menuOnEdit.composition = data[0].versions.composition;
	    		if (typeof data[0].versions.type != 'undefined') this.menuOnEdit.type = data[0].versions.type;
	    		if (typeof data[0].versions.season != 'undefined') this.menuOnEdit.season = data[0].versions.season;
	    		if (typeof data[0].versions.maxCost != 'undefined') this.menuOnEdit.maxCost = data[0].versions.maxCost;
	    		if (typeof data[0].versions.minCost != 'undefined') this.menuOnEdit.minCost = data[0].versions.minCost;
	    		if (typeof data[0].versions.meanCost != 'undefined') this.menuOnEdit.meanCost = data[0].versions.meanCost;
	    		if (typeof data[0].versions.totalCost != 'undefined') this.menuOnEdit.totalCost = data[0].versions.totalCost;
	    		if (typeof data[0].versions.margin != 'undefined') this.menuOnEdit.margin = data[0].versions.margin;
	    		if (typeof data[0].versions.price != 'undefined') this.menuOnEdit.price = data[0].versions.price;
	    		if (typeof data[0].versions.maxCostOverPrice != 'undefined') this.menuOnEdit.maxCostOverPrice = data[0].versions.maxCostOverPrice;
	    		if (typeof data[0].versions.calculMethod != 'undefined') this.menuOnEdit.calculMethod = data[0].versions.calculMethod;
	    		if (typeof data[0].versions.last_account != 'undefined') this.menuOnEdit.last_account = data[0].versions.last_account;
	    		if (typeof data[0].versions.updatedAt != 'undefined') this.menuOnEdit.updatedAt = data[0].versions.updatedAt
	    		delete this.menuOnEdit.versions;
	    		//Get menu's lang field filtered for user's profile language
	    		this.gastroOfferService.getUserLang(this.id, this.versionId).subscribe(
	    			(data: any) => { 
	    				this.userLang=data.userLang;
	    				this.loading = false;
	    		})
	    	})
	}

	public editMenu() {
		this.forceRefreshForEditMain.emit(true);
		// var margin, price;

		// if (this.menuOnEdit.calculMethod == 'calculByPrice') {
		// 	price = this.menuOnEdit.price;
		// 	margin = (this.menuOnEdit.price-this.menuOnEdit.meanCost)/this.menuOnEdit.meanCost;

		// } else if (this.menuOnEdit.calculMethod == 'calculByMargin') {
		// 	margin = this.menuOnEdit.margin;
		// 	price = (1+this.menuOnEdit.margin/100)*this.menuOnEdit.meanCost;
		// }

		//Set subfamily id of dishes without subfamily to null.
		//The menu composition controller assigns 'bogus' ids to subfamilies of dishes with subfamily null so that they can be grouped.
		let composition = this.clone(this.menuOnEdit.composition);
		composition.map((dish)=> {
			if(dish.subfamily && dish.subfamily._id < 0 ) dish.subfamily=null;
		})

		let menuObj = {
			_id: this.menuOnEdit._id,
			active: this.menuOnEdit.active,
			location: this.menuOnEdit.location,
			referenceNumber: this.menuOnEdit.reference_number,
			version: {
				lang: this.menuOnEdit.lang,
				price: this.menuOnEdit.price,
				maxCostOverPrice: this.menuOnEdit.maxCostOverPrice,
				composition: composition || null,
				type: this.menuOnEdit.type,
				season: this.menuOnEdit.season,
				maxCost: this.menuOnEdit.maxCost,
				minCost: this.menuOnEdit.minCost,
				meanCost: this.menuOnEdit.meanCost,
				totalCost: this.menuOnEdit.totalCost,
				active: true,
				calculMethod: this.menuOnEdit.calculMethod
			}
		}

		this.gastroOfferService.addVersion(menuObj).subscribe(
			(data: any) => {
				//Get new id and version id from response data
				this.id = data.id;
				let locationWarning:boolean = data.locationWarning;
				this.versionId = data.activeVersionId;
				this.saving=true; //set saving flag to true in order to bypass candeactivate

				switch (this.menuType) {
			      case 'menu':
			        if(locationWarning) this.notification.warn(this.newMenuVersionTitle, this.newMenuVersionContentLocWarning, {clickToClose: true, timeOut:0});
			        else this.notification.success(this.newMenuVersionTitle, this.newMenuVersionContent);
        			this.router.navigate(['./gastro-offering/menus/edit', this.id, {versionId: this.versionId, tab: 'menu'}]);
			        break;
			      case 'dailyMenuCarte':
			        if(locationWarning) this.notification.warn(this.newDailyMenuCarteVersionTitle, this.newDailyMenuCarteVersionContentLocWarning, {clickToClose: true, timeOut:0});
			        else this.notification.success(this.newDailyMenuCarteVersionTitle, this.newDailyMenuCarteVersionContent);
        			this.router.navigate(['./gastro-offering/daily-menu-cartes/edit', this.id, {versionId: this.versionId, tab: 'menu'}]);
			        break;
			      case 'buffet':
 			        if(locationWarning) this.notification.warn(this.newBuffetVersionTitle, this.newBuffetVersionContentLocWarning, {clickToClose: true, timeOut:0});
			        else this.notification.success(this.newBuffetVersionTitle, this.newBuffetVersionContent);
        			this.router.navigate(['./gastro-offering/buffets/edit', this.id, {versionId: this.versionId, tab: 'menu'}]);
			        break;        
			      case 'carte':
 			        if(locationWarning) this.notification.warn(this.newCarteVersionTitle, this.newCarteVersionContentLocWarning, {clickToClose: true, timeOut:0});
			        else this.notification.success(this.newCarteVersionTitle, this.newCarteVersionContent);
        			this.router.navigate(['./gastro-offering/cartes/edit', this.id, {versionId: this.versionId, tab: 'menu'}]);
			        break;  
			      case 'fixedPriceCarte':
			        if(locationWarning) this.notification.warn(this.newFixedPriceCarteVersionTitle, this.newFixedPriceCarteVersionContentLocWarning, {clickToClose: true, timeOut:0});
			        else this.notification.success(this.newFixedPriceCarteVersionTitle, this.newFixedPriceCarteVersionContent);
        			this.router.navigate(['./gastro-offering/fixed-price-cartes/edit', this.id, {versionId: this.versionId, tab: 'menu'}]);
			        break;
			      case 'catalog':
 			        if(locationWarning) this.notification.warn(this.newCatalogVersionTitle, this.newCatalogVersionContentLocWarning, {clickToClose: true, timeOut:0});
			        else this.notification.success(this.newCatalogVersionTitle, this.newCatalogVersionContent);
        			this.router.navigate(['./gastro-offering/catalogs/edit', this.id, {versionId: this.versionId, tab: 'menu'}]);
			        break;
			      
			      default:
			        // code...
			        break;
			    }				
			},
			(err) => {
				this.notification.error('Error', err || 'Server error');
			});
	}
  
  public notificationDestroyed(e){
  	switch (this.menuType) {
      case 'menu':
        if(e.type!="error") this.router.navigate(['/gastro-offering/menus']);
        break;
      case 'dailyMenuCarte':
        if(e.type!="error") this.router.navigate(['/gastro-offering/daily-menu-cartes']);
        break;
      case 'buffet':
        if(e.type!="error") this.router.navigate(['/gastro-offering/buffets']);
        break;        
      case 'carte':
        if(e.type!="error") this.router.navigate(['/gastro-offering/cartes']);
        break;  
      case 'fixedPriceCarte':
        if(e.type!="error") this.router.navigate(['/gastro-offering/fixed-price-cartes']);
        break;
      case 'catalog':
        if(e.type!="error") this.router.navigate(['/gastro-offering/catalogs']);
        break;
      
      default:
        // code...
        break;
    }    	
  }

  public editGastroOffer() {
    switch (this.menuType) {
      case 'menu':
        this.router.navigate(['/gastro-offering/menus/edit/',this.id, {versionId: this.versionId, filterLocations: JSON.stringify(this.filterLocations)}]);
        break;
      case 'dailyMenuCarte':
        this.router.navigate(['/gastro-offering/daily-menu-cartes/edit/',this.id, {versionId: this.versionId, filterLocations: JSON.stringify(this.filterLocations)}]);
        break;
      case 'buffet':
        this.router.navigate(['/gastro-offering/buffets/edit/',this.id, {versionId: this.versionId, filterLocations: JSON.stringify(this.filterLocations)}]);
        break;        
      case 'carte':
        this.router.navigate(['/gastro-offering/cartes/edit/',this.id, {versionId: this.versionId, filterLocations: JSON.stringify(this.filterLocations)}]);
        break;  
      case 'fixedPriceCarte':
        this.router.navigate(['/gastro-offering/fixed-price-cartes/edit/',this.id, {versionId: this.versionId, filterLocations: JSON.stringify(this.filterLocations)}]);
        break;
      case 'catalog':
        this.router.navigate(['/gastro-offering/catalogs/edit/',this.id, {versionId: this.versionId, filterLocations: JSON.stringify(this.filterLocations)}]);
        break;
      
      default:
        // code...
        break;
    } 

  }

	public getLocationCost() {
		this.gastroOfferService.getLocCost(this.id, this.versionId, this.menuType).subscribe(
			(data: any) => {
				this.locationCost = data;
			})
	}

	public duplicateGastroOffer() {

    this.gastroOfferService.duplicateGastroOffer(this.id, this.duplicateName, this.duplicateLocation).subscribe(
      (data) => {
        let gastroOfferId = data._id;
        let _versionId = data.versions[0]._id;
        this.notification.success(this.gastroDuplicatedTitle, this.gastroDuplicatedContent);
        let timeout = setTimeout(() => { 

        	switch (this.menuType) {
			      case 'menu':
			        this.router.navigate(['/gastro-offering/menus/']);
			        break;
			      case 'dailyMenuCarte':
			        this.router.navigate(['/gastro-offering/daily-menu-cartes/']);
			        break;
			      case 'buffet':
			        this.router.navigate(['/gastro-offering/buffets/']);
			        break;        
			      case 'carte':
			        this.router.navigate(['/gastro-offering/cartes/']);
			        break;  
			      case 'fixedPriceCarte':
			        this.router.navigate(['/gastro-offering/fixed-price-cartes/']);
			        break;
			      case 'catalog':
			        this.router.navigate(['/gastro-offering/catalogs/']);
			        break;
			      
			      default:
			        // code...
			        break;
			    } 
          
        }, 400);
        let timeoutId = setTimeout(() => {  

        	switch (this.menuType) {
			      case 'menu':
			        this.router.navigate(['/gastro-offering/menus/'+ gastroOfferId, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
			        break;
			      case 'dailyMenuCarte':
			        this.router.navigate(['/gastro-offering/daily-menu-cartes/'+ gastroOfferId, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
			        break;
			      case 'buffet':
			        this.router.navigate(['/gastro-offering/buffets/'+ gastroOfferId, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
			        break;        
			      case 'carte':
			        this.router.navigate(['/gastro-offering/cartes/'+ gastroOfferId, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
			        break;  
			      case 'fixedPriceCarte':
			        this.router.navigate(['/gastro-offering/fixed-price-cartes/'+ gastroOfferId, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
			        break;
			      case 'catalog':
			        this.router.navigate(['/gastro-offering/catalogs/'+ gastroOfferId, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
			        break;
			      
			      default:
			        // code...
			        break;
			    } 

        }, 500);
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      });
  }

  public updateFilterLocations(e) {
    this.duplicateLocation=e;
  }

  public redirect() {

    if(this.redirectData && this.redirectData.activated) { 
      let _id = this.redirectData.id;
      let _versionId = this.redirectData.versionId;
      let mode = this.redirectData.mode;
      let originPath = this.redirectData.originPath;
      
      //No delete redirect data
      this.redirectOn = true;

      //Reset redirect data.
      this.compassService.resetRedirectData();

      if(!this.filterLocations) this.filterLocations = [];

      if (mode == 'edit') {
        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
      } else if (this.redirectData.mode == 'view') {
        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, filterLocations: JSON.stringify(this.filterLocations), tab: 'menu'}]);
      }
     } else { 

      	switch (this.menuType) {
		      case 'menu':
		        this.router.navigate(['/gastro-offering/menus/']);
		        break;
		      case 'dailyMenuCarte':
		        this.router.navigate(['/gastro-offering/daily-menu-cartes/']);
		        break;
		      case 'buffet':
		        this.router.navigate(['/gastro-offering/buffets/']);
		        break;        
		      case 'carte':
		        this.router.navigate(['/gastro-offering/cartes/']);
		        break;  
		      case 'fixedPriceCarte':
		        this.router.navigate(['/gastro-offering/fixed-price-cartes/']);
		        break;
		      case 'catalog':
		        this.router.navigate(['/gastro-offering/catalogs/']);
		        break;
		      
		      default:
		        // code...
		        break;
		    } 
     }
  }

}
