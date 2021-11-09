import { Component, OnInit, ViewContainerRef, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from "../../../global-utils/services/location.service";
import { FamilyService } from "../../../libraries/family/family.service";
import { AppConfig } from "../../../global-utils/services/appConfig.service";
import { GastroOfferService } from "../gastro-offer.service";
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ConfirmationService } from 'primeng/primeng'
import { Subject, Observable} from 'rxjs/Rx'

@Component({
  selector: 'gastro-offer-new',
  templateUrl: './gastro-offer-new.component.html',
  styleUrls: ['./gastro-offer-new.component.scss']
})
export class GastroOfferNewComponent implements OnInit {
public selectedMu;

   public id: string;
   public action: string;
   public menuType;

   public menuLang = {
     name: '',
     description: '',
   }

   public options = {
   	timeOut: 1500,
    position: ["top", "right"]
   }

   public menu = {
    type: null,
    season: null,
    active: true, //default value is true
    price: 0,
    location: ''
  }

  public menuTypes;
  public menuSeasons;
  public userLocations;
  public selectedLocations = [];
  public editMode:boolean = true;

  public menuUpdatedLang: any[] = [];
  public menus;

  public editedMenu: any[] = [];
  public menuOnEdit: any;
  public menuLangOnEdit: any;

  public forceRefresh = new EventEmitter();
  public forceRefreshForEdit = new EventEmitter();
  public deactivate: Subject<boolean> = new Subject();

  public menuCreatedTitle;
  public menuCreatedContent;
  public dailyMenuCarteCreatedTitle;
  public dailyMenuCarteCreatedContent;
  public buffetCreatedTitle;
  public buffetCreatedContent;
  public carteCreatedTitle;
  public carteCreatedContent;
  public fixedPriceCarteCreatedTitle;
  public fixedPriceCarteCreatedContent;
  public catalogCreatedTitle;
  public catalogCreatedContent;
  public alertHeader;
  public alertMessage;
  public saving: boolean = false;


  constructor(public familyService: FamilyService, public locationService: LocationService,
    public appConfig: AppConfig, public  menuService: GastroOfferService, public router: Router, 
    public notification: NotificationsService, public translate: TranslateService, public route: ActivatedRoute,
    public confirmationService: ConfirmationService) {

    //Get type of menu from route path
    route.data.subscribe((data: {menuType: String}) => {
      this.menuType = data.menuType;
    });    
  }

  ngOnInit() {
  	this.translation();
    this.getMenuTypes();
    this.getMenuSeasons();
    this.getUserLocations();
    // console.log('action:',this.action);
    // console.log('id',this.id);
  }

  public translation(){

    this.translate.get('gastro.menu.notifications.menuCreatedTitle').subscribe((res: string) => {
      this.menuCreatedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.menuCreatedContent').subscribe((res: string) => {
      this.menuCreatedContent = res;
    });

    this.translate.get('gastro.menu.notifications.dailyMenuCarteCreatedTitle').subscribe((res: string) => {
      this.dailyMenuCarteCreatedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.dailyMenuCarteCreatedContent').subscribe((res: string) => {
      this.dailyMenuCarteCreatedContent = res;
    });

    this.translate.get('gastro.menu.notifications.buffetCreatedTitle').subscribe((res: string) => {
      this.buffetCreatedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.buffetCreatedContent').subscribe((res: string) => {
      this.buffetCreatedContent = res;
    });

    this.translate.get('gastro.menu.notifications.carteCreatedTitle').subscribe((res: string) => {
      this.carteCreatedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.carteCreatedContent').subscribe((res: string) => {
      this.carteCreatedContent = res;
    });

    this.translate.get('gastro.menu.notifications.fixedPriceCarteCreatedTitle').subscribe((res: string) => {
      this.fixedPriceCarteCreatedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.fixedPriceCarteCreatedContent').subscribe((res: string) => {
      this.fixedPriceCarteCreatedContent = res;
    });

    this.translate.get('gastro.menu.notifications.catalogCreatedTitle').subscribe((res: string) => {
      this.catalogCreatedTitle = res;
    });

    this.translate.get('gastro.menu.notifications.catalogCreatedContent').subscribe((res: string) => {
      this.catalogCreatedContent = res;
    });

    this.translate.get('messageGeneric.alert').subscribe((res: string) => {
      this.alertHeader = res;
    });  

    this.translate.get('messageGeneric.alertMessage').subscribe((res: string) => {
      this.alertMessage = res;
    }); 
  }

  public langObjRefreshed(e) {
    this.menuUpdatedLang = e.langsObj;
  }

  public addMenu() {
    this.forceRefresh.emit(true);

    let menuObj = {
      active: this.menu.active,
      location: this.selectedLocations,
      type: this.menuType,
      versions: { 
        lang: this.menuUpdatedLang,
        type: this.menu.type,
        season: this.menu.season,
        price: this.menu.price,
        composition: [],
        active: true,
      }      
    };

    //console.log(menuObj);

    this.saving=true; //set saving flag to true in order to bypass candeactivate

    this.menuService.addMenu(menuObj).subscribe(
    	(data) => {
        switch (this.menuType) {
          case 'menu':
            this.notification.success(this.menuCreatedTitle, this.menuCreatedContent);
            this.router.navigate(['./gastro-offering/menus/edit', data._id, {versionId: data.versions[0]._id, tab: 'menu'}]);
            break;

          case 'dailyMenuCarte':
            this.notification.success(this.dailyMenuCarteCreatedTitle, this.dailyMenuCarteCreatedContent);
        		this.router.navigate(['./gastro-offering/daily-menu-cartes/edit', data._id, {versionId: data.versions[0]._id, tab: 'menu'}]);
            break;

          case 'buffet':
            this.notification.success(this.buffetCreatedTitle, this.buffetCreatedContent);
        		this.router.navigate(['./gastro-offering/buffets/edit', data._id, {versionId: data.versions[0]._id, tab: 'menu'}]);
            break;

          case 'carte':
            this.notification.success(this.carteCreatedTitle, this.carteCreatedContent);
        		this.router.navigate(['./gastro-offering/cartes/edit', data._id, {versionId: data.versions[0]._id, tab: 'menu'}]);
            break;

          case 'fixedPriceCarte':
            this.notification.success(this.fixedPriceCarteCreatedTitle, this.fixedPriceCarteCreatedContent);
        		this.router.navigate(['./gastro-offering/fixed-price-cartes/edit', data._id, {versionId: data.versions[0]._id, tab: 'menu'}]);
            break;

          case 'catalog':
            this.notification.success(this.catalogCreatedTitle, this.catalogCreatedContent);
        		this.router.navigate(['./gastro-offering/catalogs/edit', data._id, {versionId: data.versions[0]._id, tab: 'menu'}]);
            break;
          
          default:
            // code...
            break;
        }
    		this.menuLang = {
    			name: '',
    			description: '',
    		}
    	},
    	(err) => {
    		this.notification.error('Error', err || 'Server error');
    	});    
  }

  // public notificationDestroyed(e){
  // 	if(e.type!="error"){
  //     switch (this.menuType) {
  //       case 'menu':
  //         this.router.navigate(['/gastro-offering/menus']);
  //         break;

  //       case 'dailyMenuCarte':
  //         this.router.navigate(['/gastro-offering/daily-menu-cartes']);
  //         break;

  //       case 'buffet':
  //         this.router.navigate(['/gastro-offering/buffets']);
  //         break;

  //       case 'carte':
  //         this.router.navigate(['/gastro-offering/cartes']);
  //         break;

  //       case 'fixedPriceCarte':
  //         this.router.navigate(['/gastro-offering/fixed-price-cartes']);
  //         break;

  //       case 'catalog':
  //         this.router.navigate(['/gastro-offering/catalogs']);
  //         break;
        
  //       default:
  //         // code...
  //         break;
  //     }
  //   } 
  // }

  public getUserLocations() {
    this.locationService.getUserLocations().subscribe(
      (data: any)=> {
        this.userLocations = data;
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getMenuTypes() {
    this.familyService.getFamily('menu', 10000, 0, '','').subscribe(
      (data: any) => {
        this.menuTypes = data.families;
        //Set family and subfamilies 
        if(this.menuTypes.length>0) this.menu.type = this.menuTypes[0]._id;
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  public getMenuSeasons() {
    this.familyService.getFamily('season', 10000, 0, '','').subscribe(
      (data: any) => {
        this.menuSeasons = data.families;
        //Set family and subfamilies 
        if(this.menuSeasons.length>0) this.menu.season = this.menuSeasons[0]._id;
      },
      (err) => {
        this.notification.error('Error', err || 'Server error');
      })
  }

  canDeactivate(): Subject<boolean> | boolean {
    //Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged

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

  public menuTypeSelected(i) {
    this.menu.type = this.menuTypes[i]._id;
  }

  public menuSeasonSelected(i) {
      this.menu.season = this.menuSeasons[i]._id;
  }

  public activeSelected(value){
    value=='yes'? this.menu.active=true : this.menu.active=false;
  }

  public updateSelectedLocations(e) {
    this.selectedLocations=e;
  }
}

