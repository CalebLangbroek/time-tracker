import { Injectable } from '@angular/core';

import { TimerService } from './timer.service';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import { DayEntry } from '../models/day-entry.model';
import { TimeEntry } from '../models/time-entry.model';

@Injectable({
	providedIn: 'root'
})
export class TrackerService {
	private startDate: Date;
	dayEntries: DayEntry[];

	constructor(private timer: TimerService, private storage: StorageService, private notification: NotificationService) {
		// Get our entries from local storage
		this.dayEntries = this.storage.getEntries();
	}

	getDayEntries() {
		return this.dayEntries;
	}

	startTracker() {
		this.startDate = new Date();
		// Start the timer
		this.timer.startTimer();
	}

	stopTracker(name: string) {
		// Stop the timer and get its duration
		const duration = this.timer.stopTimer();

		const entry: TimeEntry = {
			name,
			duration,
			start: this.startDate,
			end: new Date(),
			isOpen: false
		};

		// Get the day entry that the entry will be stored in
		const dateStr = this.formatDate(this.startDate);
		const dayEntry = this.getDayEntry(dateStr);

		// Save the entry to the beginning of the array
		dayEntry.entries.unshift(entry);

		// Save the entries
		this.storage.setEntries(this.dayEntries);
	}

	getTimerDuration(): number {
		return this.timer.getDuration();
	}

	/**
	 * Search for a the day entry for a certain day in the day entries.
	 * Add it to the array of day entries if it isn't there.
	 * @param date Date to look for. Should be in the form: "YYYY-MM-DD".
	 * @return Day entry with the date that was searched for.
	 */
	getDayEntry(date: string) {
		// Search for the day entry
		let dayEntry = this.dayEntries.find(el => {
			return el.date === date;
		});

		// Add the date if it doesn't exist
		if (!dayEntry) {
			dayEntry = {
				date,
				entries: []
			};
			this.dayEntries.push(dayEntry);
			this.dayEntries.sort(this.compareDayEntries);
		}

		return dayEntry;
	}

	/**
	 * Set the name of an entry at a given index.
	 * @param index Index of the entry to set.
	 * @param name Value to set the name to.
	 */
	setTimeEntryName(dayIndex: number, timeIndex: number, name: string) {
		this.dayEntries[dayIndex].entries[timeIndex].name = name;

		// Save the entries
		this.storage.setEntries(this.dayEntries);

		// Send notification
		this.notification.sendNotification({ message: 'Entry saved', type: 'success' });
	}

	/**
	 * Save the start and end of a time entry.
	 * @param index Index of the time entry in the array.
	 * @param startTime New start time in form 'HH:mm'.
	 * @param startDate .
	 * @param endTime New end time in form 'HH:mm'.
	 * @param endDate .
	 */
	setTimeEntryStartEnd(dayIndex: number, timeIndex: number, startTime: string, startDate: string, endTime: string, endDate: string) {
		// Get the new variables
		const start = new Date(`${startTime} ${startDate}`);
		const end = new Date(`${endTime} ${endDate}`);
		const duration = this.getDuration(start, end);

		// TODO: if start date changes add to new day entry, remove from old

		// Assign the new values
		this.dayEntries[dayIndex].entries[timeIndex].start = start;
		this.dayEntries[dayIndex].entries[timeIndex].end = end;
		this.dayEntries[dayIndex].entries[timeIndex].duration = duration;

		// Sort the time entries in reverse chronological order
		this.dayEntries[dayIndex].entries.sort(this.compareTimeEntries);

		// Save the entries
		this.storage.setEntries(this.dayEntries);

		// Send notification
		this.notification.sendNotification({ message: 'Entry saved', type: 'success' });
	}

	/**
	 * Calculate the duration of a time entry.
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
	deleteTimeEntry(dayIndex: number, timeIndex: number) {
		this.dayEntries[dayIndex].entries.splice(timeIndex, 1);

		// Save the entries
		this.storage.setEntries(this.dayEntries);

		// Send notification
		this.notification.sendNotification({ message: 'Entry deleted', type: 'success' });
	}

	/**
	 * Return the date from a Date object in the form 'YYYY-MM-DD'
	 * @param dateObj Date to format.
	 */
	private formatDate(dateObj: Date) {
		return dateObj.toISOString().slice(0, 10);
	}

	/**
	 * Compares two day entries.
	 * @param x First day entry to be compared.
	 * @param y Second day entry to be compared.
	 * @returns -1 if x is before y, 0 if x and y are equal, and 1 if y is before x.
	 */
	private compareDayEntries(x: DayEntry, y: DayEntry): number {
		// Remove dashes so we can find the newest
		const xDateNum = parseInt(x.date.replace('-', ''), 10);
		const yDateNum = parseInt(y.date.replace('-', ''), 10);

		if (xDateNum > yDateNum) {
			return -1;
		}

		if (xDateNum < yDateNum) {
			return 1;
		}

		return 0;
	}

	/**
	 * Compares two time entries.
	 * @param x First time entry to be compared.
	 * @param y Second time entry to be compared.
	 * @returns -1 if x is before y, 0 if x and y are equal, and 1 if y is before x.
	 */
	private compareTimeEntries(x: TimeEntry, y: TimeEntry): number {
		if (x.start.getTime() > y.start.getTime()) {
			return -1;
		}

		if (x.start.getTime() < y.start.getTime()) {
			return 1;
		}

		return 0;
	}
}
