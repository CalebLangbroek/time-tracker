import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { UtilsService } from '../utils.service';
import { environment } from 'src/environments/environment';
import { GenericDatabaseItem } from 'src/app/models/generic-database-item.model';

const PROJECT_URL = environment.FIREBASE_PROJECT_URL;

export abstract class AbstractDatabaseItemApiService<
	T extends GenericDatabaseItem
> {
	constructor(
		private auth: AuthService,
		private utils: UtilsService,
		private http: HttpClient,
		private baseURL: string
	) {}

	getAll(): Observable<T[]> {
		const user = this.auth.user.getValue();

		return this.http
			.get<T[]>(`${PROJECT_URL}/${this.baseURL}/${user.id}.json`)
			.pipe(
				map((res) => {
					const result: T[] = [];
					for (const key in res) {
						result.push(this.convert(key, res[key]));
					}
					return result;
				}),
				catchError(this.utils.handleHTTPError.bind(this.utils))
			);
	}

	get(id: string): Observable<T> {
		const user = this.auth.user.getValue();

		return this.http
			.get<T>(`${PROJECT_URL}/${this.baseURL}/${user.id}/${id}.json`)
			.pipe(
				map((res) => {
					res.id = id;
					return res;
				}),
				catchError(this.utils.handleHTTPError.bind(this.utils))
			);
	}

	/**
	 * Create a new database item.
	 * @param item New item to create.
	 */
	create(item: T): Observable<{ name: string }> {
		const user = this.auth.user.getValue();

		return this.http
			.post(`${PROJECT_URL}/${this.baseURL}/${user.id}.json`, item)
			.pipe(catchError(this.utils.handleHTTPError.bind(this.utils)));
	}

	/**
	 * Delete a specific item from the database.
	 * @param id ID of the item to delete.
	 */
	delete(id: string) {
		const user = this.auth.user.getValue();

		return this.http
			.delete(`${PROJECT_URL}/${this.baseURL}/${user.id}/${id}.json`)
			.pipe(catchError(this.utils.handleHTTPError.bind(this.utils)));
	}

	/**
	 * Update a item in the database.
	 * @param item New item values.
	 */
	update(item: T) {
		const user = this.auth.user.getValue();
		const id = item.id;
		const resItem = this.clearFields(item);

		return this.http
			.patch(
				`${PROJECT_URL}/${this.baseURL}/${user.id}/${id}.json`,
				resItem
			)
			.pipe(catchError(this.utils.handleHTTPError.bind(this.utils)));
	}

	private convert(id: string, item: T): T {
		item.id = id;
		return item;
	}

	/**
	 * Only keep the fields that are being saved in the database.
	 * Should be implemented in the implementing class.
	 *
	 * @param item Item who's fields need clearing.
	 */
	abstract clearFields<T>(item: T): T;
}
