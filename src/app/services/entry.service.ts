import { Injectable } from '@angular/core';

import { Entry } from '../models/entry.model';
import { AbstractDatabaseItemService } from './abstract/abstract-database-item.service';
import { UtilsService } from './utils.service';
import { TimerService } from './timer.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { EntryApiService } from './entry-api.service';

@Injectable({
	providedIn: 'root',
})
export class EntryService extends AbstractDatabaseItemService<Entry> {
	private startDate: Date;
	trackerName = '';

	constructor(
		private timer: TimerService,
		private notificationServiceE: NotificationService,
		private apiE: EntryApiService,
		private utilsE: UtilsService,
		private authE: AuthService
	) {
		super(apiE, notificationServiceE, utilsE, authE);
	}

	startTracker() {
		this.startDate = new Date();
		// Start the timer
		this.timer.startTimer();
	}

	stopTracker(name: string) {
		// Stop the timer and get its duration
		const duration = this.timer.stopTimer();

		const entry: Entry = {
			name,
			duration,
			start: this.startDate,
			end: new Date(),
			isOpen: false,
		};

		super.create(entry);
	}

	getTimerIsStarted(): boolean {
		return this.timer.getIsStarted();
	}

	getTimerDuration(): number {
		return this.timer.getDuration();
	}
}
