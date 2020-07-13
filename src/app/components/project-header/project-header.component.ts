import { Component, OnInit, OnDestroy } from '@angular/core';
import {
	Router,
	NavigationStart,
	UrlSegment,
	PRIMARY_OUTLET,
} from '@angular/router';
import { Subscription } from 'rxjs';

enum ProjectRouteStates {
	PROJECTS,
	NEW,
	PROJECT,
	EDIT,
}

@Component({
	selector: 'app-project-header',
	templateUrl: './project-header.component.html',
	styleUrls: ['./project-header.component.scss'],
})
export class ProjectHeaderComponent implements OnInit, OnDestroy {
	private routerSub: Subscription;
	state: ProjectRouteStates;
	projectID = '';

	constructor(private router: Router) {}

	ngOnInit() {
		this.setStateOnURL(this.router.url);
		this.routerSub = this.router.events.subscribe(
			this.onNavigationStart.bind(this)
		);
	}

	ngOnDestroy() {
		this.routerSub.unsubscribe();
	}

	onNavigationStart(event: Event) {
		if (event instanceof NavigationStart) {
			this.setStateOnURL(event.url);
		}
	}

	setStateOnURL(url: string): void {
		const tree = this.router.parseUrl(url);

		if (!tree.root.children[PRIMARY_OUTLET]) {
			return;
		}

		const segments: UrlSegment[] = tree.root.children[
			PRIMARY_OUTLET
		].segments;

		this.projectID = '';

		switch (true) {
			case segments.length === 1:
				this.state = ProjectRouteStates.PROJECTS;
				break;
			case segments.length === 3:
				this.projectID = segments[1].toString();
				this.state = ProjectRouteStates.EDIT;
				break;
			case segments[1].toString() === 'new':
				this.state = ProjectRouteStates.NEW;
				break;
			default:
				this.projectID = segments[1].toString();
				this.state = ProjectRouteStates.PROJECT;
				break;
		}
	}

	getProjectRouteStates() {
		return ProjectRouteStates;
	}
}
