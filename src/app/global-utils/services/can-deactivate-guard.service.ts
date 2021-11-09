import { Injectable }    from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Subject }    from 'rxjs/Rx';
import { AuthService } from './auth.service'

export interface CanComponentDeactivate {
 canDeactivate: () => Subject<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

	private logginOut:boolean = false;

	constructor(private authService: AuthService){
		this.authService.isLoggingOut().subscribe((logginOut:boolean) => {
			this.logginOut = logginOut;
		})		
	}

  canDeactivate(component: CanComponentDeactivate) {
  	if(this.logginOut) return true;
    else return component.canDeactivate ? component.canDeactivate() : true;
  }
}