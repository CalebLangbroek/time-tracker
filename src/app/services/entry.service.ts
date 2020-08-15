import { Injectable } from '@angular/core';

import { Entry } from '../models/entry.model';
import { AbstractDatabaseItemService } from './abstract/abstract-database-item.service';
import { UtilsService } from './utils.service';
import { TimerService } from './timer.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { EntryApiService } from './entry-api.service';
import { Tag } from '../models/tag.model';

@Injectable({
	providedIn: 'root',
})
export class EntryService extends AbstractDatabaseItemService<Entry> {
	private startDate: Date;
	trackerName = '';

	constructor(
		private timer: TimerService,
		protected notificationService: NotificationService,
		protected api: EntryApiService,
		protected utils: UtilsService,
		protected auth: AuthService
	) {
		super(api, notificationService, utils, auth);
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

	addTag(entryID: string, tag: Tag): void {
		const index = this.items.findIndex((entry) => entry.id === entryID);

		if (!this.items[index].tags) {
			this.items[index].tags = [];
		}

		this.items[index].tags.push(tag);

		this.api.addTag(entryID, tag).subscribe(() => {
			this.notificationService.sendNotification({
				message: 'Tag added',
				type: 'success',
			});
		}, this.utils.handleAPIError.bind(this.utils));
	}

	deleteTag(entryID: string, tagID: string): void {
		const index = this.items.findIndex((entry) => entry.id === entryID);
		this.items[index].tags = this.items[index].tags.filter(
			(tag) => tag.id !== tagID
		);

		this.api.deleteTag(entryID, tagID).subscribe(() => {
			this.notificationService.sendNotification({
				message: 'Tag removed',
				type: 'success',
			});
		}, this.utils.handleAPIError.bind(this.utils));
	}
}
