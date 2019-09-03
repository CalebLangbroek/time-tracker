import { Injectable } from '@angular/core';

import { TimerService } from './timer.service';
import { TrackerEntry } from '../models/tracker-entry.model';

@Injectable({
	providedIn: 'root'
})
export class TrackerService {
	private startDate: Date;
	trackerEntries: TrackerEntry[];

	constructor(private timer: TimerService) {
		// TODO: Remove test data
		this.trackerEntries = [];

		for (let i = 0; i < 5; i++) {
			this.trackerEntries.push({
				name: 'Test ' + i.toString(),
				duration: 0,
				start: new Date(),
				end: new Date()
			});
		}
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
	}

	/**
	 * Set a new time for a tracker entry.
	 * @param index Index of the tracker entry in the array.
	 * @param time New time in form 'HH:mm'.
	 */
	setTrackerEntryTime(index: number, time: string, prop: string) {
		// Check that we are updating start or end
		if (prop !== 'start' && prop !== 'end') {
			return;
		}

		// Get the hours and minutes from the time
		const timeSplit = time.split(':');
		const hours = parseInt(timeSplit[0], 10);
		const minutes = parseInt(timeSplit[1], 10);

		// Set the hours and minutes
		this.trackerEntries[index][prop].setHours(hours);
		this.trackerEntries[index][prop].setMinutes(minutes);

		// Update the tracker's duration
		this.calculateTrackerEntryDuration(index);

		// Sort the entries in reverse chronological order
		this.trackerEntries.sort(this.compareTrackerEntries);
	}

	setTrackerEntryDate(index: number, fullDate: string, prop: string) {
		// Check that we are updating start or end
		if (prop !== 'start' && prop !== 'end') {
			return;
		}

		// Get the date, month, and year from the full date
		const fullDateSplit = fullDate.split('/');
		const date = parseInt(fullDateSplit[1], 10);
		const month = parseInt(fullDateSplit[0], 10) - 1;
		const year = parseInt(fullDateSplit[2], 10);

		// Set the date, month, and year
		this.trackerEntries[index][prop].setDate(date);
		this.trackerEntries[index][prop].setMonth(month);
		this.trackerEntries[index][prop].setFullYear(year);

		// Update the tracker's duration
		this.calculateTrackerEntryDuration(index);

		// Sort the entries in reverse chronological order
		this.trackerEntries.sort(this.compareTrackerEntries);
	}

	/**
	 * Calculate the duration of a tracker entry.
	 * @param index Index of the tracker entry in the array.
	 */
	calculateTrackerEntryDuration(index: number) {
		const trackerEntry = this.trackerEntries[index];
		const duration = (trackerEntry.end.getTime() - trackerEntry.start.getTime()) / 1000;
		this.trackerEntries[index].duration = duration;
	}

	/**
	 * Remove an entry from the array at a given index.
	 * The re-sort the array.
	 * @param index Index of the entry to delete
	 */
	deleteTrackerEntry(index: number) {
		this.trackerEntries.splice(index, 1);
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
