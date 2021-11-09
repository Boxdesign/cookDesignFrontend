import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../global-utils/services/auth.service";
import { SessionService } from "../../global-utils/services/session.service";
import { GalleryService } from "../../global-utils/services/gallery.service";
import { IdleTimeoutService } from "../../global-utils/services/idleTimeout.service";
import { CostFilterService } from "../../global-utils/services/cost-filter.service";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { SocketService } from "../../global-utils/services/socket.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AppConfig } from "../../global-utils/services/appConfig.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {
  public firstName;
  public userImage;
  public location;
  public costFilterSet;  
  public savedLocations = [];
  public refreshLocation = new Subject();
  public clone = require('clone')
  public downloadLink: string;
  public msgs = [];
  public exportAll: string;
  public exportAllSuccess: string;
  public exportAllFailed: string;
  public exportItemSuccess: string;
  public exportItem: string;
  public exportItemFailed: string;
  public exportSucceeded: string;
  public exportFailed: string;
  public refreshAppRelease = new Subject();
  private apiUrl:string;
  public newAppRelease;
  public clickHereToUpdate;
  public refreshPage;

  constructor(
      public authService: AuthService, 
      public sessionService: SessionService,
      public galleryService: GalleryService, 
      public costFilterService: CostFilterService,
      public socketService: SocketService,
      public translate: TranslateService,
      public appConfig:AppConfig,
      public idleTimeoutService: IdleTimeoutService
    ) { }

  ngOnInit() {
    this.msgs = [];

    this.apiUrl = this.appConfig.apiUrl;

    this.idleTimeoutService.timeoutExpired.subscribe(res => { this.logout() })

    this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        if(data.length) this.costFilterSet=true;
        else this.costFilterSet=false;        
        this.location = [];
        this.savedLocations = [];
        this.location = this.location.concat(data);
        this.savedLocations = this.savedLocations.concat(data);  
    }) 

    this.socketService.getMessages().subscribe((data: any)=> {


      if (data.type=="export") {
        var exportType;
        var nameSelected = data.params.nameSelected.slice(1, -2).replace(/"/g, " ").toLowerCase();
        switch (data.params.exportType) {
        case 'subproduct':
          exportType = "subproductos";
          break;
        case 'product':
          exportType = "productos";
          break
        case 'dish':
          exportType = "platos";
          break
        case 'drink':
          exportType = "bebidas";
          break
        case 'ingredient':
          exportType = "ingredientes";
          break
        case 'packaging':
          exportType = "envases y embalajes";
          break      
      }

        if (data.status == 'success') {   
          if (nameSelected=="") {
            this.msgs.push({severity:'success',summary: this.exportAll + exportType + this.exportAllSuccess, url:  data.url, clickUrl: this.downloadLink});
          } else {
            this.msgs.push({severity:'success',summary: this.exportItemSuccess + nameSelected + this.exportItem + exportType + ':',  url: data.url, clickUrl: this.downloadLink});
          }
         
        } else if (data.status == 'error'){
          if (nameSelected=="") {
            this.msgs.push({severity:'error',summary: this.exportAll + exportType + this.exportAllFailed});
          } else {
            this.msgs.push({severity:'error',summary: this.exportAllFailed + nameSelected + this.exportItem + exportType});
          }
        }
      } else if (data.type=="newAppRelease"){
      			this.msgs.push({severity:'success',summary: this.newAppRelease + ': ' + data.newRelease + '. '+ this.clickHereToUpdate + ': ', url: '/' , sameTab: true, clickUrl: 'refresh page'})
      			//this.refreshAppRelease.next(true);
      } else {
// 'some' 'carte' 'menu' 'dailyMenuCarte' 'catalog' 'fixedPriceCarte' 'buffet'

        if (data.status == 'success') {   
            this.msgs.push({severity:'success',summary: this.exportSucceeded, url:  data.url, clickUrl: this.downloadLink});
          } else if (data.status == 'error'){
            this.msgs.push({severity:'error',summary: this.exportFailed});
          
        }
      }
      
    })
    this.translation();
    this.getUserInfo();
  }

  public translation(){
    this.translate.get('messageGeneric.exportAll').subscribe((res: string) => {
      this.exportAll = res;
    }); 

    this.translate.get('messageGeneric.exportSucceeded').subscribe((res: string) => {
      this.exportSucceeded = res;
    }); 
 
    this.translate.get('messageGeneric.exportFailed').subscribe((res: string) => {
      this.exportFailed = res;
    }); 


    this.translate.get('messageGeneric.exportAllSuccess').subscribe((res: string) => {
      this.exportAllSuccess = res;
    });   

    this.translate.get('messageGeneric.exportAllFailed').subscribe((res: string) => {
      this.exportAllFailed = res;
    });   

    this.translate.get('messageGeneric.exportItemSuccess').subscribe((res: string) => {
      this.exportItemSuccess = res;
    });  

    this.translate.get('messageGeneric.exportItem').subscribe((res: string) => {
      this.exportItem = res;
    }); 

    this.translate.get('messageGeneric.exportAllFailed').subscribe((res: string) => {
      this.exportItemFailed = res;
    });   

    this.translate.get('messageGeneric.downloadLink').subscribe((res: string) => {
      this.downloadLink = res;
    });

    this.translate.get('messageGeneric.newAppRelease').subscribe((res: string) => {
      this.newAppRelease = res;
    });      

    this.translate.get('messageGeneric.clickHereToUpdate').subscribe((res: string) => {
      this.clickHereToUpdate = res;
    });      

    this.translate.get('messageGeneric.refreshPage').subscribe((res: string) => {
      this.refreshPage = res;
    });
  }


  public logout() {
  	this.costFilterService.saveCostLocation([])
  	this.authService.setLoggedIn(false)
    this.authService.doLogout();
    this.socketService.disconnect();
    this.idleTimeoutService.stopTimer();
  }

  public getUserInfo(){
    this.sessionService.getUserData().subscribe((data:any) => {
      this.firstName = data.firstName;
      this.userImage = data.userImage;
    });
  }

  public filterCostsByLocation() {
    if(this.location) { 
      this.costFilterService.saveCostLocation(this.clone(this.location));
      this.savedLocations = [];
      this.savedLocations = this.savedLocations.concat(this.location)
      this.costFilterSet=true;
    }
  }

  public updateFilterLocations(e) {
    this.location = e;
  }

  public resetCostFilter() {
    this.costFilterSet=false;
    this.savedLocations=[];
    this.location = [];
    this.refreshLocation.next([]);
    this.costFilterService.saveCostLocation([]);
  }

  public cancelSelection() {
    this.refreshLocation.next(this.clone(this.savedLocations));
    this.location = [];
    this.location = this.location.concat(this.savedLocations);
  }
}
