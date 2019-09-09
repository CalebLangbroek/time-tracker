import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

const DURATION = 2000;
const MAX_LENGTH = 5;

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
	notifications: Notification[];
	notificationsObservable: Subscription;

	constructor(private notificationService: NotificationService) { }

	ngOnInit() {
		this.notifications = [];

		// Subscribe here so we can know of new notifications
		this.notificationsObservable = this.notificationService.notifications
			.subscribe({
				next: this.setNotification.bind(this)
			});
	}

	ngOnDestroy() {
		this.notificationsObservable.unsubscribe();
	}

	/**
	 * Add a notification to the list of displayed notifications.
	 * Remove it after a set duration.
	 * @param notification Notification to display.
	 */
	setNotification(notification: Notification) {
		// Check that the notifications array does not exceed the max size
		const size = this.notifications.length;

		if (size > MAX_LENGTH) {
			// Remove the oldest
			this.removeOldestNotification();
		}

		// Display the notification
		this.notifications.push(notification);

		// Set timeout to remove notification after set time
		setTimeout(() => this.removeOldestNotification(), DURATION);
	}

	/**
	 * Remove a notification at an index.
	 * @param index Index of notification to remove.
	 */
	removeNotification(index: number) {
		this.notifications.splice(index, 1);
	}

	/**
	 * Remove the oldest notification.
	 */
	removeOldestNotification() {
		this.notifications.splice(0, 1);
	}
}
