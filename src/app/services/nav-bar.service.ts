import { Injectable,  } from '@angular/core';
import { Subject } from 'rxjs';

const NAV_BREAK_POINT = 768;

@Injectable({
	providedIn: 'root'
})
export class NavBarService {
	private isMobile: boolean;
	private showSideNav: boolean;
	showSideNavSubject = new Subject<boolean>();
	isMobileSubject = new Subject<boolean>();


	constructor() {
		this.setBoolChecks();
	}

	getIsMobile() {
		return this.isMobile;
	}

	getShowSideNav() {
		return this.showSideNav;
	}

	/**
	 * Set boolean variables.
	 */
	setBoolChecks() {
		if (window.innerWidth <= NAV_BREAK_POINT) {
			this.isMobile = true;
			this.showSideNav = false;
		} else {
			this.isMobile = false;
			this.showSideNav = true;
		}

		this.showSideNavSubject.next(this.showSideNav);
		this.isMobileSubject.next(this.isMobile);
	}

	closeNavBar() {
		this.showSideNav = false;
		this.showSideNavSubject.next(this.showSideNav);
	}

	openNavBar() {
		this.showSideNav = true;
		this.showSideNavSubject.next(this.showSideNav);
	}
}
