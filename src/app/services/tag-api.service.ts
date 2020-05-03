import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Tag } from '../models/tag.model';

const PROJECT_URL = environment.FIREBASE_PROJECT_URL;

interface ResponseTag {
	name: string;
	color: string;
}

@Injectable({
	providedIn: 'root',
})
export class TagApiService {
	constructor(private auth: AuthService, private http: HttpClient) {}

	getTags(): Observable<Tag[]> {
		const user = this.auth.user.getValue();

		return this.http.get<Tag[]>(`${PROJECT_URL}/tags/${user.id}.json`).pipe(
			map((res) => {
				const result: Tag[] = [];
				for (const key in res) {
					result.push(this.convertToTag(key, res[key]));
				}
				return result;
			}),
			catchError(this.handleHTTPError.bind(this))
		);
	}

	getTag(tagID: string): Observable<Tag> {
		const user = this.auth.user.getValue();

		return this.http
			.get<Tag>(`${PROJECT_URL}/tags/${user.id}/${tagID}.json`)
			.pipe(
				map((res) => {
					res.id = tagID;
					return res;
				}),
				catchError(this.handleHTTPError.bind(this))
			);
	}

	/**
	 * Create a new tag.
	 * @param tag New tag to create.
	 */
	createTag(tag: Tag): Observable<{ name: string }> {
		const user = this.auth.user.getValue();

		return this.http
			.post(`${PROJECT_URL}/tags/${user.id}.json`, tag)
			.pipe(catchError(this.handleHTTPError.bind(this)));
	}

	/**
	 * Delete a specific tag from the database.
	 * @param tagID ID of the tag to delete.
	 */
	deleteTag(tagID: string) {
		const user = this.auth.user.getValue();

		return this.http
			.delete(`${PROJECT_URL}/tags/${user.id}/${tagID}.json`)
			.pipe(catchError(this.handleHTTPError.bind(this)));
	}

	/**
	 * Update a tag in the database.
	 * @param tag New tag values.
	 */
	updateTag(tag: Tag) {
		const user = this.auth.user.getValue();
		const tagID = tag.id;

		const resTag = this.clearFields(tag);

		return this.http
			.patch(`${PROJECT_URL}/tags/${user.id}/${tagID}.json`, resTag)
			.pipe(catchError(this.handleHTTPError.bind(this)));
	}

	/**
	 * Only keep the fields that are being saved in the database.
	 * @param tag Tag who's fields need clearing.
	 */
	private clearFields(tag: Tag): ResponseTag {
		return {
			name: tag.name,
			color: tag.color,
		};
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
	private handleHTTPError(error: HttpErrorResponse): Observable<string> {
		if (error instanceof HttpErrorResponse) {
			return throwError(error.error.error);
		} else {
			return throwError('An unknown error occurred');
		}
	}
}
