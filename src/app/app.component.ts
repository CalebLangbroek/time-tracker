import { Component, OnInit, HostListener} from '@angular/core';

import { AuthService } from './services/auth.service';
import { NavBarService } from './services/nav-bar.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	isMobile: boolean;
	showSideNav: boolean;

	// Add event listener on resize to account for mobile rotation
	@HostListener('window:resize', [])
	onResize() {
		this.navbar.setBoolChecks();
	}

	constructor(private auth: AuthService, private navbar: NavBarService) {}

	ngOnInit() {
		this.isMobile = this.navbar.getIsMobile();
		this.showSideNav =  this.navbar.getShowSideNav();

		// Setup subscriptions to navbar
		this.navbar.showSideNavSubject.subscribe({
			next: showSideNav => this.showSideNav = showSideNav
		});

		this.navbar.isMobileSubject.subscribe({
			next: isMobile => this.isMobile = isMobile
		});

		this.auth.signInFromLocalStorage();
	}

	onClickNavToggle() {
		this.navbar.openNavBar();
	}

	/**
	 * Show the side nav on swipe right.
	 */
	onSwipeRight() {
		this.showSideNav = true;
	}

	/**
	 * Hide the side nav on swipe left on mobile, always show the side nav on larger devices.
	 */
	onSwipeLeft() {
		this.showSideNav = this.isMobile ? false : true;
	}
}
