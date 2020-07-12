import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { Project } from '../models/project.model';
import { AbstractDatabaseItemApiService } from './abstract/abstract-database-item-api.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectApiService extends AbstractDatabaseItemApiService<Project> {
	constructor(
		private authP: AuthService,
		private httpP: HttpClient,
		private utilsP: UtilsService
	) {
		super(authP, utilsP, httpP, 'projects');
	}

	clearFields<Project>(item: any): Project {
		const project:any = {
			name: item.name,
			desc: item.desc,
			color: item.color,
			hours: item.hours,
		};

		return project as Project;
	}
}
