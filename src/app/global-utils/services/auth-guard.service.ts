import {Injectable}             from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}    from '@angular/router';
import {AuthService} from './auth.service';
import {SessionService} from './session.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService, private router:Router,
    private sessionService: SessionService) {
  }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    
    if (this.authService.isLoggedIn()) {
      if(state.url.substring(0,6)=='/admin') { //trying to access admin area
        this.sessionService.isAdmin().subscribe((admin) => {
          if(admin) { 
            return true; 
          } else {
            this.router.navigate(['']);
            return false;
          }
        });
      } else {
         return true;
      }
      return true;
    } else {
      // Store the attempted URL for redirecting
      this.authService.redirectUrl = state.url;

      // Navigate to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
