import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";

 @Injectable()
 export class CostFilterService {

   public locationSubject = new ReplaySubject(1); //A replay observer will replay the last location when a method subscribes to it.
   public locSet:boolean=false;

   constructor() {

   }

   public saveCostLocation(location) {
   	 this.locSet = true;
     this.locationSubject.next(location)
   }

   public getCostLocation() {
     return this.locationSubject;
   }

   public locationSet(){
   		return this.locSet;
   }

   public isEmpty(){
   	 return this.locationSubject.isEmpty();
   }

}