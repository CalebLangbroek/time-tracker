import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Constants } from '../constants/constants';
import { AuthErrorCodes } from '../enums/auth-error-codes.enum';
import { UserResponse } from '../models/user-response.model';

const SIGN_UP_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.FIREBASE_API_KEY}`;
const SIGN_IN_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.FIREBASE_API_KEY}`;
const REFRESH_ENDPOINT = `https://securetoken.googleapis.com/v1/token?key=${environment.FIREBASE_API_KEY}`;

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	user = new BehaviorSubject<User>(null);
	private tokenExpiryTimer: NodeJS.Timer;

	constructor(private http: HttpClient, private router: Router) {}

	/**
	 * Sign a user in with an email and password.
	 * @param email User's email.
	 * @param password User's password.
	 * @returns A promise that resolves to a string.
	 */
	signIn(email: String, password: String): Promise<string> {
		return this.makeAuthPost(SIGN_IN_ENDPOINT, {
			email,
			password,
			returnSecureToken: true
		});
	}

	/**
	 * Get the user's token from local storage and sign them in with it.
	 */
	signInFromLocalStorage() {
		const userJson = JSON.parse(localStorage.getItem(Constants.USER_DATA_KEY));

		if (!userJson) {
			return;
		}

		const user = new User(
			userJson.id,
			userJson.email,
			userJson.token,
			new Date(userJson.expiryDate),
			userJson.refreshToken
		);

		this.refreshToken(user);
	}

	/**
	 * Sign a user up with an email and password.
	 * @param email User's email.
	 * @param password User's password.
	 * @returns A promise that resolves to a string.
	 */
	signUp(email: String, password: String): Promise<string> {
		return this.makeAuthPost(SIGN_UP_ENDPOINT, {
			email,
			password,
			returnSecureToken: true
		});
	}

	/**
	 * Sign a user out.
	 */
	signOut(): void {
		this.user.next(null);
		localStorage.removeItem(Constants.USER_DATA_KEY);
		if(this.tokenExpiryTimer) {
			clearTimeout(this.tokenExpiryTimer);
		}
		this.router.navigate(['/signin']);
	}

	/**
	 * Make a post request to authenticate a user.
	 * @param url Url to POST to.
	 * @param body Request body.
	 * @returns A promise that resolves to a string.
	 */
	private makeAuthPost(url: string, body: any): Promise<string> {
		return this.http
			.post<UserResponse>(url, body)
			.pipe(
				map(this.handleSuccess.bind(this)),
				catchError(this.handleError.bind(this))
			)
			.toPromise();
	}

	/**
	 * Handle an auth post error.
	 * @param error Error to handle.
	 * @returns Error message as an Observable.
	 */
	private handleError(error: HttpErrorResponse): Observable<string> {
		let errorMessage = '';

		// Try and convert to a message to display to the user
		try {
			const errCodesMsg = AuthErrorCodes[error.error.error.message];
			errorMessage = errCodesMsg
				? errCodesMsg
				: 'An unknown error occurred';
		} catch (error) {
			errorMessage = 'An unknown error occurred';
		}

		return throwError(errorMessage);
	}

	/**
	 * Handle a successful auth post.
	 * @param res Response from the backend.
	 * @returns Success message.
	 */
	private handleSuccess(res: UserResponse): string {
		const expiresIn = new Date(
			new Date().getTime() + Number.parseFloat(res.expiresIn) * 1000
		);

		const user = new User(
			res.localId,
			res.email,
			res.idToken,
			expiresIn,
			res.refreshToken
		);

		this.authenticateUser(user);

		const message = 'Success!';
		return message;
	}

	/**
	 * Authenticate a user.
	 * Start a timeout to automatically refresh the user when their token expires.
	 * @param user User to authenticate.
	 */
	private authenticateUser(user: User): void {
		this.tokenExpiryTimer = setTimeout(
			() => this.refreshToken(user),
			user.expiryDate.getTime() - new Date().getTime()
		);
		this.user.next(user);
		localStorage.setItem(Constants.USER_DATA_KEY, JSON.stringify(user));
	}

	private refreshToken(user: User): void {
		if (!user.refreshToken) {
			this.signOut();
			return;
		}

		this.http
			.post<{
				expires_in: string;
				refresh_token: string;
				id_token: string;
			}>(REFRESH_ENDPOINT, {
				grant_type: 'refresh_token',
				refresh_token: user.refreshToken,
			})
			.pipe(
				map(
					(res): UserResponse => {
						return {
							idToken: res.id_token,
							email: user.email,
							refreshToken: res.refresh_token,
							expiresIn: res.expires_in,
							localId: user.id,
						};
					}
				),
				map(this.handleSuccess.bind(this)),
				catchError((err) => {
					this.signOut();
					return this.handleError(err);
				})
			).subscribe();
	}
}
