import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
	isSignIn = true;
	isLoading = false;

	constructor(
		private auth: AuthService,
		private notification: NotificationService,
		private router: Router
	) {}

	ngOnInit() {
		this.isSignIn = this.router.url.includes('signin');
	}

	/**
	 * Change between sign in and sign up modes.
	 */
	onChangeMode() {
		const url = this.isSignIn ? '/signup' : '/signin';
		this.router.navigate([url]);
	}

	/**
	 * Submit the form to backend for validation.
	 * Either signs a user up or signs them in.
	 * @param form Auth form
	 */
	onFormSubmitted(form: NgForm) {
		// Ensure the form is valid before submitting
		if (!form.valid) {
			return;
		}

		this.isLoading = true;

		const email = form.value.email;
		const password = form.value.password;
		let authPromise: Promise<string>;

		if (this.isSignIn) {
			authPromise = this.auth.signIn(email, password);
		} else {
			authPromise = this.auth.signUp(email, password);
		}

		authPromise
			.then(successMessage => {
				this.notification.sendNotification({
					message: successMessage,
					type: 'success'
				});
				this.router.navigate(['/']);
			})
			.catch(errorMessage =>
				this.notification.sendNotification({
					message: errorMessage,
					type: 'danger'
				})
			)
			.finally(() => (this.isLoading = false));
	}
}
