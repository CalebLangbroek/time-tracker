import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { Project } from '../models/project.model';
import { environment } from 'src/environments/environment';

const PROJECT_URL = environment.FIREBASE_PROJECT_URL;

@Injectable({
	providedIn: 'root',
})
export class ProjectApiService {
	constructor(
		private auth: AuthService,
		private http: HttpClient,
		private utils: UtilsService
	) {}

	getProjects(): Observable<Project[]> {
		const user = this.auth.user.getValue();

		return this.http
			.get<Project[]>(`${PROJECT_URL}/projects/${user.id}.json`)
			.pipe(
				map((res) => {
					const result: Project[] = [];
					for (const key in res) {
						result.push(this.convertToProject(key, res[key]));
					}
					return result;
				}),
				catchError(this.utils.handleHTTPError.bind(this))
			);
	}

	createProject(project: Project): Observable<{ id: string }> {
		const user = this.auth.user.getValue();

		return this.http
			.post(`${PROJECT_URL}/projects/${user.id}.json`, project)
			.pipe(catchError(this.utils.handleHTTPError.bind(this)));
	}

	private convertToProject(tagID: string, resTag: Project): Project {
		resTag.id = tagID;
		return resTag;
	}
}
