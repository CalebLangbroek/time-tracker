import { Injectable } from '@angular/core';

import { Project } from '../models/project.model';
import { BehaviorSubject } from 'rxjs';
import { ProjectApiService } from './project-api.service';
import { NotificationService } from './notification.service';
import { UtilsService } from './utils.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	private projects: Project[] = [];
	projectsSubject = new BehaviorSubject<Project[]>([]);

	constructor(
		private projectAPI: ProjectApiService,
		private notificationService: NotificationService,
		private utils: UtilsService
	) {
		this.projectAPI.getProjects().subscribe((resProjects) => {
			this.projects = resProjects;
			this.projectsSubject.next(this.projects);
		});
	}

	createProject(project: Project) {
		this.projectAPI.createProject(project).subscribe((res) => {
			project.id = res.id;
			this.projects.unshift(project);
			this.projectsSubject.next(this.projects);
			this.notificationService.sendNotification({
				message: 'Project created',
				type: 'success',
			});
		}, this.utils.handleAPIError.bind(this.utils));
	}
}
