import { Routes }       from '@angular/router';
import { AuthGuard }          from '../global-utils/services/auth-guard.service';
import { AuthService }        from '../global-utils/services/auth.service';
import { LoginComponent }     from './login.component';

export const LoginRoutes: Routes = [
  { path: 'login', component: LoginComponent }
];
