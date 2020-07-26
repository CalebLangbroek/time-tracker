import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AbstractDatabaseItemApiService } from './abstract/abstract-database-item-api.service';
import { Entry } from '../models/entry.model';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { Constants } from '../constants/constants';
import { Tag } from '../models/tag.model';

@Injectable({
	providedIn: 'root',
})
export class EntryApiService extends AbstractDatabaseItemApiService<Entry> {
	constructor(
		private authE: AuthService,
		private httpE: HttpClient,
		private utilsE: UtilsService
	) {
		super(authE, utilsE, httpE, 'entries');
	}

	getAll() {
		return super.getAll(
			new HttpParams()
				.set('orderBy', '"start"')
				.set('limitToLast', `${Constants.ENTRY_LIMIT}`)
		);
	}

	/**
	 * Update an entry in the database.
	 * @param entry New entry values.
	 */
	addEntryTag(entry: Entry, tag: Tag) {
		// const user = this.auth.user.getValue();
		// const entryId = entry.id;

		// return this.http
		// 	.patch(`${PROJECT_URL}/entries/${user.id}/${entryId}/tag.json`, tag)
		// 	.pipe(catchError(this.handleError.bind(this)));
	}

	deleteEntryTag(entryID: string) {
		// const user = this.auth.user.getValue();

		// return this.http
		// 	.delete(`${PROJECT_URL}/entries/${user.id}/${entryID}/tag.json`)
		// 	.pipe(catchError(this.handleError.bind(this)));
	}

	convert(id: string, item: Entry):Entry {
		item.start = new Date(item.start);
		item.end = new Date(item.end);
		item.duration = (item.end.getTime() - item.start.getTime()) / 1000;

		return super.convert(id, item);
	}

	clearFields<Entry>(item: any): Entry {
		const entry: any = {
			name: item.name,
			start: item.start.getTime(),
			end: item.end.getTime(),
		};

		return entry as Entry;
	}
}
