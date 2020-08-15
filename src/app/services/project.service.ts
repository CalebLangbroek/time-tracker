import { Injectable } from '@angular/core';

import { Project } from '../models/project.model';
import { AbstractDatabaseItemService } from './abstract/abstract-database-item.service';
import { ProjectApiService } from './project-api.service';
import { NotificationService } from './notification.service';
import { UtilsService } from './utils.service';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectService extends AbstractDatabaseItemService<Project> {
	constructor(
		protected api: ProjectApiService,
		protected notificationService: NotificationService,
		protected utils: UtilsService,
		protected auth: AuthService
	) {
		super(api, notificationService, utils, auth);
	}
}
