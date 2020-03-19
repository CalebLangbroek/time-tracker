import { Injectable } from '@angular/core';
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
	constructor(private auth: AuthService) {}

	/**
	 * Intercept HTTP requests and add the user's auth token to the request if it's present.
	 * @param req
	 * @param next
	 */
	intercept(req: HttpRequest<any>, next: HttpHandler) {
		return this.auth.user.pipe(
			take(1),
			exhaustMap(user => {
				if (!user || !user.getToken()) {
					return next.handle(req);
				}

				// Add auth request param
				const modifiedReq = req.clone({
					params: req.params.set('auth', user.getToken())
				});

				return next.handle(modifiedReq);
			})
		);
	}
}
