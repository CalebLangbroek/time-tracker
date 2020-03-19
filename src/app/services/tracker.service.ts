import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { TimerService } from './timer.service';
import { NotificationService } from './notification.service';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Entry } from '../models/entry.model';
import { User } from '../models/user.model';

@Injectable({
	providedIn: 'root'
})
export class TrackerService {
	private startDate: Date;
	private entries: Entry[];
	entriesSubject = new Subject<Entry[]>();
	trackerName: string;

	constructor(
		private timer: TimerService,
		private notification: NotificationService,
		private api: ApiService,
		private auth: AuthService
	) {
		// Subscribe to the user so we can clear the timer and entries when they sign out
		this.auth.user.subscribe(this.observeUser.bind(this));
		this.trackerName = '';
	}

	/**
	 * Fetch the entries from the API and emit them once finished
	 */
	getEntries(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (!this.entries) {
				this.api.getEntries().subscribe(entries => {
					this.entries = entries;
					this.entries.sort(this.compareEntries);
					this.entriesSubject.next(this.entries);
					resolve();
				}, err => {
					this.handleAPIError(err);
					reject();
				} );
			} else {
				this.entriesSubject.next(this.entries);
				resolve();
			}
		});
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
			isOpen: false
		};

		this.api.setEntry(entry).subscribe((resEntry: { name: string }) => {
			entry.id = resEntry.name;

			// Save the entry to the beginning of the array
			this.entries.unshift(entry);

			// Emit so any subscribers update
			this.entriesSubject.next(this.entries);
		}, this.handleAPIError.bind(this));
	}

	getTimerIsStarted(): boolean {
		return this.timer.getIsStarted();
	}

	getTimerDuration(): number {
		return this.timer.getDuration();
	}

	/**
	 * Set the name of an entry at a given index.
	 * @param index Index of the entry to set.
	 * @param name Value to set the name to.
	 */
	setEntryName(index: number, name: string) {
		this.entries[index].name = name;

		this.api.putEntry(this.entries[index]).subscribe(() => {
			// Send notification
			this.notification.sendNotification({
				message: 'Entry saved',
				type: 'success'
			});
		}, this.handleAPIError.bind(this));
	}

	/**
	 * Save the start and end of an entry.
	 * @param index Index of the entry in the array.
	 * @param startTime New start time in form 'HH:mm'.
	 * @param startDate .
	 * @param endTime New end time in form 'HH:mm'.
	 * @param endDate .
	 */
	setEntryStartEnd(
		index: number,
		startTime: string,
		startDate: string,
		endTime: string,
		endDate: string
	) {
		// Get the new variables
		const start = new Date(`${startTime} ${startDate}`);
		const end = new Date(`${endTime} ${endDate}`);
		const duration = this.getDuration(start, end);

		// Assign the new values
		this.entries[index].start = start;
		this.entries[index].end = end;
		this.entries[index].duration = duration;

		this.api.putEntry(this.entries[index]).subscribe(() => {
			// Send notification
			this.notification.sendNotification({
				message: 'Entry saved',
				type: 'success'
			});
		}, this.handleAPIError.bind(this));

		// Sort the entries in reverse chronological order
		this.entries.sort(this.compareEntries);

		// Emit so any subscribers update
		this.entriesSubject.next(this.entries);
	}

	/**
	 * Remove an entry from the array at a given index.
	 * The re-sort the array.
	 * @param index Index of the entry to delete
	 */
	deleteEntry(index: number) {
		this.api.deleteEntry(this.entries[index].id).subscribe(() => {
			// Send notification
			this.notification.sendNotification({
				message: 'Entry deleted',
				type: 'success'
			});
		}, this.handleAPIError.bind(this));

		this.entries.splice(index, 1);

		// Emit so any subscribers update
		this.entriesSubject.next(this.entries);
	}

	/**
	 * Calculate the duration of a entry.
	 * @param start Starting date.
	 * @param end Ending date.
	 */
	private getDuration(start: Date, end: Date): number {
		return (end.getTime() - start.getTime()) / 1000;
	}

	/**
	 * Compares two entries.
	 * @param x First entry to be compared.
	 * @param y Second entry to be compared.
	 * @returns -1 if x is before y, 0 if x and y are equal, and 1 if y is before x.
	 */
	private compareEntries(x: Entry, y: Entry): number {
		if (x.start.getTime() > y.start.getTime()) {
			return -1;
		}

		if (x.start.getTime() < y.start.getTime()) {
			return 1;
		}

		return 0;
	}

	/**
	 * Send a new notification if an API error occurs.
	 * @param err Error message as a string.
	 */
	private handleAPIError(err: string) {
		this.notification.sendNotification({
			message: err,
			type: 'danger'
		});
	}

	/**
	 * User observer, so we can clear the timer and entries when the user signs out.
	 * @param user Current user.
	 */
	private observeUser(user: User) {
		// User is still signed in
		if (user) {
			return;
		}

		// User has been signed out
		this.timer.stopTimer();
		this.entries = null;
	}
}
