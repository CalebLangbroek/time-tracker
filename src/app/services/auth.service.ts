import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

const SIGN_UP_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.FIREBASE_API_KEY}`;
const SIGN_IN_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.FIREBASE_API_KEY}`;
const USER_DATA_KEY = 'userData';

interface UserResponse {
	idToken: string;
	email: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
	registered?: boolean;
}

enum AuthErrorCodes {
	EMAIL_EXISTS = 'This email already exists',
	TOO_MANY_ATTEMPTS_TRY_LATER = 'Too many attempts',
	EMAIL_NOT_FOUND = 'Email not found',
	INVALID_PASSWORD = 'Invalid password',
	USER_DISABLED = 'User disabled'
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	user = new BehaviorSubject<User>(null);
	private tokenExpiryTimer: any;

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
		const userJson = JSON.parse(localStorage.getItem(USER_DATA_KEY));

		if(!userJson) {
			return;
		}

		const user = new User(
			userJson.id,
			userJson.email,
			userJson.token,
			new Date(userJson.expiryDate)
		);

		if (user.getToken()) {
			this.authenticateUser(user);
		}
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
		localStorage.removeItem(USER_DATA_KEY);
		clearTimeout(this.tokenExpiryTimer);
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
		// Convert it to a message to display to the user
		let errorMessage = AuthErrorCodes[error.error.error.message];

		if (!errorMessage) {
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
			new Date().getTime() + +res.expiresIn * 1000
		);

		const user = new User(res.localId, res.email, res.idToken, expiresIn);

		this.authenticateUser(user);

		const message = 'Success!';
		return message;
	}

	/**
	 * Authenticate a user.
	 * @param user User to authenticate.
	 */
	private authenticateUser(user: User): void {
		const expiresIn = user.expiryDate.getTime() - new Date().getTime();
		this.startTokenExpiryTimer(expiresIn);

		this.user.next(user);
		localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
		this.router.navigate(['/']);
	}

	/**
	 * Start a timeout to automatically sign the user out when their token expires.
	 * @param expiresIn Time in milliseconds before signing out.
	 */
	private startTokenExpiryTimer(expiresIn: number): void {
		this.tokenExpiryTimer = setTimeout(() => this.signOut(), expiresIn);
	}
}
