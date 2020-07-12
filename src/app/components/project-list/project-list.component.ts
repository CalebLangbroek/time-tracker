import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project.model';

@Component({
	selector: 'app-project-list',
	templateUrl: './project-list.component.html',
	styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit, OnDestroy {
	private projectSub: Subscription;
	projects : Project[];

	constructor(private projectService: ProjectService) {}

	ngOnInit() {
		this.projects = this.projectService.itemsSubject.getValue();

		this.projectSub = this.projectService.itemsSubject.subscribe(projects => {
			this.projects = projects;
		})
	}

	ngOnDestroy() {
		this.projectSub.unsubscribe();
	}

	onClickDelete(projectID: string) {
		this.projectService.delete(projectID);
	}
}
