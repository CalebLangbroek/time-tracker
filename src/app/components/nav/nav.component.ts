import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { NavBarService } from 'src/app/services/nav-bar.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
	isSignedIn: boolean;
	private userObservable: Subscription;

	constructor(private auth: AuthService, private navbar: NavBarService) {}

	ngOnInit() {
		// Subscribe to changes to the user so we can update the nav if they sign out
		this.auth.user.subscribe({
			next: this.setSignedIn.bind(this)
		});
	}

	ngOnDestroy() {
		this.userObservable.unsubscribe();
	}

	/**
	 * Sign the user out when they click the sign out button.
	 */
	onSignOut() {
		this.auth.signOut();
		this.navbar.closeNavBar();
	}

	onCloseNav() {
		this.navbar.closeNavBar();
	}

	/**
	 * Set the signed in status to true if the user is signed in and their token is valid.
	 * @param user User to check.
	 */
	private setSignedIn(user: User) {
		this.isSignedIn = !user || !user.getToken() ? false : true;
	}
}
