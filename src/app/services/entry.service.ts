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

	/**
	 * Set the tag of an entry at a given index.
	 * @param index Index of the entry to set.
	 * @param tag Tag to set.
	 */
	addEntryTag(index: number, tag: Tag) {
		// this.api.putEntryTag(this.entries[index], tag).subscribe(() => {
		// 	// Send notification
		// 	this.notification.sendNotification({
		// 		message: 'Tag saved',
		// 		type: 'success'
		// 	});
		// }, this.handleAPIError.bind(this));
	}

	/**
	 * Remove an entry from the array at a given index.
	 * The re-sort the array.
	 * @param index Index of the entry to delete
	 */
	deleteEntryTag(index: number) {
		// this.api.deleteEntryTag(this.entries[index].id).subscribe(() => {
		// 	// Send notification
		// 	this.notification.sendNotification({
		// 		message: 'Tag deleted',
		// 		type: 'success'
		// 	});
		// }, this.handleAPIError.bind(this));
		// this.entries[index].tag = undefined;
	}
}
