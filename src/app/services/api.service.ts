import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Entry } from '../models/entry.model';

const PROJECT_URL = environment.FIREBASE_PROJECT_URL;
const ENTRY_LIMIT = 50;

// Entry as stored on the server
interface ResponseEntry {
	name: string;
	start: Date;
	end: Date;
}

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	constructor(private auth: AuthService, private http: HttpClient) {}

	/**
	 * Get all of a user's entries.
	 * @return User's entries as an observable.
	 */
	getEntries(): Observable<Entry[]> {
		// Get the user
		const user = this.auth.user.getValue();

		// Add limitToLast to only get the newest entries
		return this.http
			.get(
				`${PROJECT_URL}/entries/${user.id}.json?orderBy="start"&limitToLast=${ENTRY_LIMIT}`
			)
			.pipe(
				map(res => {
					const result: Entry[] = [];
					for (const key in res) {
						result.push(this.convertToEntry(key, res[key]));
					}
					return result;
				}),
				catchError(this.handleError.bind(this))
			);
	}

	/**
	 * Get one of the user's entries.
	 * @param entryId Id of the entry to get.
	 */
	getEntry(entryId: string): Observable<Entry> {
		const user = this.auth.user.getValue();

		return this.http
			.get<Entry>(`${PROJECT_URL}/entries/${user.id}/${entryId}.json`)
			.pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Update an entry in the database.
	 * @param entry New entry values.
	 */
	putEntry(entry: Entry) {
		const user = this.auth.user.getValue();
		const entryId = entry.id;

		// Only keep fields we are saving
		const resEntry = this.clearEntryFields(entry);

		return this.http
			.patch(`${PROJECT_URL}/entries/${user.id}/${entryId}.json`, resEntry)
			.pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Create a new entry.
	 * @param entry New entry to create.
	 */
	setEntry(entry: Entry) {
		const user = this.auth.user.getValue();

		// Only keep fields we are saving
		const resEntry = this.clearEntryFields(entry);

		return this.http
			.post(`${PROJECT_URL}/entries/${user.id}.json`, resEntry)
			.pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Delete a specific entry from the database.
	 * @param entryId Id of the entry to delete.
	 */
	deleteEntry(entryId: string) {
		const user = this.auth.user.getValue();

		return this.http
			.delete(`${PROJECT_URL}/entries/${user.id}/${entryId}.json`)
			.pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Only keep the fields that are being saved in the database.
	 * @param entry Entry who's fields need clearing.
	 */
	private clearEntryFields(entry: Entry): ResponseEntry {
		return {
			name: entry.name,
			start: entry.start,
			end: entry.end
		};
	}

	/**
	 * Given an entry response from the server convert it to an entry the app can use.
	 * Start and end fields should become Date objects.
	 * @param entryId Id of the entry response.
	 * @param entry Entry data.
	 */
	private convertToEntry(entryId: string, resEntry: ResponseEntry): Entry {
		const start = new Date(resEntry.start);
		const end = new Date(resEntry.end);
		const duration = (end.getTime() - start.getTime()) / 1000;

		const entry: Entry = {
			id: entryId,
			name: resEntry.name,
			duration,
			start,
			end
		};

		return entry;
	}

	/**
	 * Handle an HTTP error.
	 * @param error Error to handle.
	 * @returns Error message as an Observable.
	 */
	private handleError(error: HttpErrorResponse): Observable<string> {
		return throwError(error.error.error);
	}
}
