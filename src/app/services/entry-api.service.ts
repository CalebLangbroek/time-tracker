import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractDatabaseItemApiService } from './abstract/abstract-database-item-api.service';
import { Entry } from '../models/entry.model';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';

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

	clearFields<Entry>(item: any): Entry {
		const entry: any = {
			name: item.name,
			start: item.start.getTime(),
			end: item.end.getTime(),
		};

		return entry as Entry;
	}
}
