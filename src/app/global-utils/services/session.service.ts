import { Injectable, OnInit } from '@angular/core';
import { AppConfig } from "../../global-utils/services/appConfig.service";
import { Http, URLSearchParams } from "@angular/http";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";
import { GalleryService } from "./gallery.service";

 @Injectable()
 export class SessionService implements OnInit {

   private apiUrl:string;
   private account;
   public adminSubject = new ReplaySubject(1);
   public userData = new ReplaySubject(1);
   public showSideBarMenu:boolean = false;

   constructor(public authHttp:Http, public appConfig:AppConfig, public galleryService: GalleryService) {
     this.apiUrl = this.appConfig.apiUrl;
   }

   ngOnInit(){
   }

  isAdmin() {
    return this.adminSubject;
  }

  isSelentaModule(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appConfig.fetchSelentaModule().subscribe((active: any) => {
        resolve(active);
      });
    });
  }  

  saveAccount(account) {
    this.account = account;

    //Checks in account whether user is admin
    let admin = this.account.role.entities.some((entity) => {
      return entity.name == 'admin' && entity.permissions && entity.permissions.read == true;
    })
    
    if (admin)  { 
      this.adminSubject.next(true) 
    } else { 
       this.adminSubject.next(false);
    }

    //Get user image
    if(this.account.user.gallery){
      this.galleryService.getGallery(this.account.user.gallery).subscribe((gallery) => {
          let data = {
            firstName : this.account.user.firstName,
            userImage: gallery.sizes[0].url
          }
          this.userData.next(data);
        })
    } else {
      let data = {
          firstName : this.account.user.firstName,
          userImage: null
        }
        this.userData.next(data);
    }
  }

  getUserData() {
    return this.userData;
  }

  userLanguage() {
    if(this.account) {
      return this.account.user.language;
    } else {
      return 'es'
    }
  }

  getAccount() {
    return this.account;
  }

}