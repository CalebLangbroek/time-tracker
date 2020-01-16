import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router
} from '@angular/router';
import { take, map } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.auth.user.pipe(
			take(1),
			map(user => {
				if (!user || !user.getToken()) {
					return this.router.createUrlTree(['/signin']);
				}

				return true;
			})
		);
	}
}
