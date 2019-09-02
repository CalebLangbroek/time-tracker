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
		this.trackerEntries = [
			{
				name: 'Test one',
				duration: 20,
				start: new Date(),
			},
			{
				name: 'Test two',
				duration: 10,
				start: new Date()
			}
		];
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
		// Save the entry into the service
		this.trackerEntries.push({
			name, duration: this.timer.getDuration(),
			start: this.startDate,
			end: new Date(),
			opened: false
		});

		// Sort the entries in reverse chronological order
		this.trackerEntries.sort(this.compareTrackerEntries);

		// Stop the timer
		this.timer.stopTimer();
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

	setTrackerEntryStartTime(index: number, time: string) {
		// this.trackerEntries[index].start.setMinutes(time);
		// this.trackerEntries[index].start.setHours(time);
	}

	setTrackerEntryStartDate(index: number, date: string) {

	}

	/**
	 * Remove an entry from the array at a given index.
	 * The re-sort the array.
	 * @param index Index of the entry to delete
	 */
	deleteTrackerEntry(index: number) {
		this.trackerEntries.splice(index, 1);

		// Sort the entries in reverse chronological order
		this.trackerEntries.sort(this.compareTrackerEntries);
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
