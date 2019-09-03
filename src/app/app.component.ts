import { Component, OnInit, HostListener } from '@angular/core';

const NAV_BREAK_POINT = 768;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	innerWidth: any;
	isMobile: boolean;
	showSideNav: boolean;

	// Add event listener on resize to account for mobile rotation
	@HostListener('window:resize', [])
	onResize() {
		this.innerWidth = window.innerWidth;
		this.setBoolChecks();
	}

	constructor() { }

	ngOnInit() {
		this.innerWidth = window.innerWidth;
		this.setBoolChecks();
	}

	/**
	 * Set boolean variables.
	 */
	setBoolChecks() {
		if (this.innerWidth <= NAV_BREAK_POINT) {
			this.isMobile = true;
			this.showSideNav = false;
		} else {
			this.isMobile = false;
			this.showSideNav = true;
		}
	}

	onClickNavToggle() {
		this.showSideNav = !this.showSideNav;
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
