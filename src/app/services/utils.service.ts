import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
	providedIn: 'root',
})
export class UtilsService {
	constructor(private notification: NotificationService) {}

	/**
	 * Handle an HTTP error.
	 * @param error Error to handle.
	 * @returns Error message as an Observable.
	 */
	public handleHTTPError(error: HttpErrorResponse): Observable<string> {
		if (error instanceof HttpErrorResponse) {
			return throwError(error.error.error);
		} else {
			return throwError('An unknown error occurred');
		}
	}

	/**
	 * Send a new notification if an API error occurs.
	 * @param err Error message as a string.
	 */
	public handleAPIError(err: string):void {
		this.notification.sendNotification({
			message: err,
			type: 'danger',
		});
	}
}
