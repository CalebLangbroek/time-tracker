import { Injectable } from '@angular/core';

import { Project } from '../models/project.model';
import { AbstractDatabaseItemService } from './abstract/abstract-database-item.service';
import { ProjectApiService } from './project-api.service';
import { NotificationService } from './notification.service';
import { UtilsService } from './utils.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectService extends AbstractDatabaseItemService<Project> {
	constructor(
		private apiP: ProjectApiService,
		private notificationServiceP: NotificationService,
		private utilsP: UtilsService
	) {
		super(apiP, notificationServiceP, utilsP);
	}
}
