import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Notification } from '../models/notification.model';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {
	notifications = new Subject<Notification>();

	constructor() {}

	/**
	 * Emit a new notification to the notifications component.
	 * @param notification Notification to display.
	 */
	sendNotification(notification: Notification) {
		this.notifications.next(notification);
	}

	removeNotification() {

	}
}
