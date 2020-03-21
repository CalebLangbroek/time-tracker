import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Tag } from '../models/tag.model';

const PROJECT_URL = environment.FIREBASE_PROJECT_URL;

@Injectable({
	providedIn: 'root'
})
export class TagApiService {
	constructor(private auth: AuthService, private http: HttpClient) {}

	getTags(): Observable<Tag[]> {
		const user = this.auth.user.getValue();

		return this.http.get<Tag[]>(`${PROJECT_URL}/tags/${user.id}.json`).pipe(
			map(res => {
				const result: Tag[] = [];
				for (const key in res) {
					result.push(this.convertToTag(key, res[key]));
				}
				return result;
			}),
			catchError(this.handleError.bind(this))
		);
	}

	getTag(tagID: string): Observable<Tag> {
		const user = this.auth.user.getValue();

		return this.http
			.get<Tag>(`${PROJECT_URL}/tags/${user.id}/${tagID}.json`)
			.pipe(
				map(res => {
					res.id = tagID;
					return res;
				}),
				catchError(this.handleError.bind(this))
			);
	}

	/**
	 * Create a new tag.
	 * @param tag New tag to create.
	 */
	setTag(tag: Tag): Observable<{ name: string }> {
		const user = this.auth.user.getValue();

		return this.http
			.post(`${PROJECT_URL}/tags/${user.id}.json`, tag)
			.pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Delete a specific tag from the database.
	 * @param tagID ID of the tag to delete.
	 */
	deleteTag(tagID: string) {
		const user = this.auth.user.getValue();

		return this.http
			.delete(`${PROJECT_URL}/tags/${user.id}/${tagID}.json`)
			.pipe(catchError(this.handleError.bind(this)));
	}

	private convertToTag(tagID: string, resTag: Tag): Tag {
		resTag.id = tagID;
		return resTag;
	}

	/**
	 * Handle an HTTP error.
	 * @param error Error to handle.
	 * @returns Error message as an Observable.
	 */
	private handleError(error: HttpErrorResponse): Observable<string> {
		if (error instanceof HttpErrorResponse) {
			return throwError(error.error.error);
		} else {
			return throwError('An unknown error occurred');
		}
	}
}
