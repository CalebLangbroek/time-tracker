import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

const NOTIFICATION_DURATION = 2000;

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
	notificationsObservable: Subscription;

	constructor(private notificationService: NotificationService, private snackBar: MatSnackBar) { }

	ngOnInit() {
		// Subscribe here so we can know of new notifications
		this.notificationsObservable = this.notificationService.notifications
			.subscribe({
				next: this.setNotification.bind(this)
			});
	}

	ngOnDestroy() {
		this.notificationsObservable.unsubscribe();
	}

	setNotification(notification: Notification) {
		// Display the notification
		this.snackBar.open(notification.message, '', {
			duration: NOTIFICATION_DURATION,
		});
	}

}
