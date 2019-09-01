import { Component, OnInit, HostListener } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	// Add event listener on resize to account for mobile rotation
	@HostListener('window:resize', [])
	onResize() {
		this.innerWidth = window.innerWidth;
		this.setBoolChecks();
	}

	// Window pixel width for mobile
	readonly mobileBreakPoint = 576;

	innerWidth: any;
	isMobile: boolean;
	showSideNav: boolean;

	constructor() { }

	ngOnInit() {
		this.innerWidth = window.innerWidth;
		this.setBoolChecks();
	}

	/**
	 * Set boolean variables.
	 */
	setBoolChecks() {
		if (this.innerWidth < this.mobileBreakPoint) {
			this.isMobile = true;
			this.showSideNav = false;
		} else {
			this.isMobile = false;
			this.showSideNav = true;
		}
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