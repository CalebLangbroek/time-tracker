import { Injectable } from '@angular/core';

import { TimerService } from './timer.service';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import { TrackerEntry } from '../models/tracker-entry.model';

@Injectable({
	providedIn: 'root'
})
export class TrackerService {
	private startDate: Date;
	trackerEntries: TrackerEntry[];

	constructor(private timer: TimerService, private storage: StorageService, private notification: NotificationService) {
		// Get our entries from local storage
		this.trackerEntries = this.storage.getEntries();
	}

	getTrackerEntries() {
		return this.trackerEntries;
	}

	startTracker() {
		this.startDate = new Date();
		// Start the timer
		this.timer.startTimer();
	}

	stopTracker(name: string) {
		// Stop the timer and get its duration
		const duration = this.timer.stopTimer();

		// Save the entry to the beginning of the array
		this.trackerEntries.unshift({
			name,
			duration,
			start: this.startDate,
			end: new Date(),
			isOpen: false
		});

		// Save the entries
		this.storage.setEntries(this.trackerEntries);
	}

	getTimerDuration(): number {
		return this.timer.getDuration();
	}

	/**
	 * Set the name of an entry at a given index.
	 * @param index Index of the entry to set.
	 * @param name Value to set the name to.
	 */
	setTrackerEntryName(index: number, name: string) {
		this.trackerEntries[index].name = name;

		// Save the entries
		this.storage.setEntries(this.trackerEntries);

		// Send notification
		this.notification.sendNotification({ message: 'Entry saved', type: 'success' });
	}

	/**
	 * Save the times and dates for the tracker entry.
	 * @param index Index of the tracker entry in the array.
	 * @param startTime New start time in form 'HH:mm'.
	 * @param startDate .
	 * @param endTime New end time in form 'HH:mm'.
	 * @param endDate .
	 */
	setTrackerEntry(index: number, startTime: string, startDate: string, endTime: string, endDate: string) {
		const start = new Date(`${startTime} ${startDate}`);
		const end = new Date(`${endTime} ${endDate}`);
		const duration = this.getDuration(start, end);

		this.trackerEntries[index].start = start;
		this.trackerEntries[index].end = end;
		this.trackerEntries[index].duration = duration;

		// Sort the entries in reverse chronological order
		this.trackerEntries.sort(this.compareTrackerEntries);

		// Save the entries
		this.storage.setEntries(this.trackerEntries);

		// Send notification
		this.notification.sendNotification({ message: 'Entry saved', type: 'success' });
	}

	/**
	 * Calculate the duration of a tracker entry.
	 * @param start Starting date.
	 * @param end Ending date.
	 */
	getDuration(start: Date, end: Date): number {
		return (end.getTime() - start.getTime()) / 1000;
	}

	/**
	 * Remove an entry from the array at a given index.
	 * The re-sort the array.
	 * @param index Index of the entry to delete
	 */
	deleteTrackerEntry(index: number) {
		this.trackerEntries.splice(index, 1);

		// Save the entries
		this.storage.setEntries(this.trackerEntries);

		// Send notification
		this.notification.sendNotification({ message: 'Entry deleted', type: 'success' });
	}

	/**
	 * Compares two tracker entries.
	 * @param x First tracker entry to be compared.
	 * @param y Second tracker entry to be compared.
	 * @returns -1 if x is before y, 0 if x and y are equal, and 1 if y is before x.
	 */
	private compareTrackerEntries(x: TrackerEntry, y: TrackerEntry): number {
		if (x.start.getTime() > y.start.getTime()) {
			return -1;
		}

		if (x.start.getTime() < y.start.getTime()) {
			return 1;
		}

		return 0;
	}
}
