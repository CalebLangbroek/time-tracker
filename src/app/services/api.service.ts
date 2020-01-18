import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Entry } from '../models/entry.model';

const PROJECT_URL = environment.FIREBASE_PROJECT_URL;

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	constructor(private auth: AuthService, private http: HttpClient) {}

	getEntries(): Observable<Entry[]> {
		const user = this.auth.user.getValue();

		return this.http.get(`${PROJECT_URL}/entries/${user.id}.json`).pipe(
			map(res => {
				const result: Entry[] = [];
				for (const key in res) {
					result.push(this.convertToEntry(key, res[key]));
				}
				return result;
			})
		);
	}

	getEntry(entryId: string): Observable<Entry> {
		return this.http.get<Entry>(`${PROJECT_URL}/entries/${entryId}.json`);
	}

	putEntry(entry: Entry) {
		const user = this.auth.user.getValue();
		const entryId = entry.id;

		// Only keep fields we are saving
		entry = this.clearEntryFields(entry);

		return this.http.put(
			`${PROJECT_URL}/entries/${user.id}/${entryId}.json`,
			entry
		);
	}

	setEntry(entry: Entry) {
		const user = this.auth.user.getValue();

		// Only keep fields we are saving
		entry = this.clearEntryFields(entry);

		return this.http.post(`${PROJECT_URL}/entries/${user.id}.json`, entry);
	}

	deleteEntry(entryId: string) {
		const user = this.auth.user.getValue();

		return this.http.delete(
			`${PROJECT_URL}/entries/${user.id}/${entryId}.json`
		);
	}

	private clearEntryFields(entry: Entry): Entry {
		return {
			name: entry.name,
			duration: entry.duration,
			start: entry.start,
			end: entry.end
		};
	}

	private convertToEntry(entryId: string, entry: Entry): Entry {
		entry.id = entryId;
		entry.start = new Date(entry.start);
		entry.end = new Date(entry.end);
		return entry;
	}
}
