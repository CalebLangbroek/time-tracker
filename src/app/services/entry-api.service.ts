import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AbstractDatabaseItemApiService } from './abstract/abstract-database-item-api.service';
import { Entry } from '../models/entry.model';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { Constants } from '../constants/constants';
import { Tag } from '../models/tag.model';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Project } from '../models/project.model';

const PROJECT_URL = environment.FIREBASE_PROJECT_URL;

@Injectable({
	providedIn: 'root',
})
export class EntryApiService extends AbstractDatabaseItemApiService<Entry> {
	constructor(
		protected auth: AuthService,
		protected http: HttpClient,
		protected utils: UtilsService
	) {
		super(auth, http, utils, 'entries');
	}

	getAll() {
		return super.getAll(
			new HttpParams()
				.set('orderBy', '"start"')
				.set('limitToLast', `${Constants.ENTRY_LIMIT}`)
		);
	}

	addTag(entryID: string, tag: Tag) {
		const user = this.auth.user.getValue();

		const newTag = {};
		newTag[tag.id] = {
			name: tag.name,
		};

		return this.http
			.patch(
				`${PROJECT_URL}/${this.baseURL}/${user.id}/${entryID}/tags.json`,
				newTag
			)
			.pipe(catchError(this.utils.handleHTTPError.bind(this.utils)));
	}

	deleteTag(entryID: string, tagID: string) {
		const user = this.auth.user.getValue();

		return this.http
			.delete(
				`${PROJECT_URL}/${this.baseURL}/${user.id}/${entryID}/tags/${tagID}.json`
			)
			.pipe(catchError(this.utils.handleHTTPError.bind(this.utils)));
	}

	addProject(entryID: string, project: Project) {
		const user = this.auth.user.getValue();
		const newProject = this.clearProjectFields(project);

		return this.http
			.patch(
				`${PROJECT_URL}/${this.baseURL}/${user.id}/${entryID}/project.json`,
				newProject
			)
			.pipe(catchError(this.utils.handleHTTPError.bind(this.utils)));
	}

	deleteProject(entryID: string) {
		const user = this.auth.user.getValue();

		return this.http
			.delete(
				`${PROJECT_URL}/${this.baseURL}/${user.id}/${entryID}/project.json`
			)
			.pipe(catchError(this.utils.handleHTTPError.bind(this.utils)));
	}

	protected convert(id: string, item: Entry): Entry {
		item.start = new Date(item.start);
		item.end = new Date(item.end);
		item.duration = (item.end.getTime() - item.start.getTime()) / 1000;

		// Fill missing fields
		if (item.project) {
			item.project.desc = '';
			item.project.hours = 0;
		}

		if (!item.tags) {
			item.tags = [];
		}

		const tags: Tag[] = [];
		for (const key in item.tags) {
			tags.push({
				id: key,
				name: item.tags[key].name,
				color: item.tags[key].color,
			});
		}
		item.tags = tags;

		return super.convert(id, item);
	}

	protected clearFields<Entry>(item: any): Entry {
		const entry: any = {
			name: item.name,
			start: item.start.getTime(),
			end: item.end.getTime(),
		};

		return entry as Entry;
	}

	private clearProjectFields(project: Project): any {
		return {
			id: project.id,
			name: project.name,
			color: project.color,
		};
	}
}
