import { Injectable } from '@angular/core';

import { TimerService } from './timer.service';

import { TrackerEntry } from '../models/tracker-entry.model';

@Injectable({
	providedIn: 'root'
})
export class TrackerService {
	startDate: Date;
	trackerEntries: TrackerEntry[];

	constructor(private timer: TimerService) {
		this.trackerEntries = [];
	}

	public startTracker() {
		this.startDate = new Date();
		// Start the timer
		this.timer.startTimer();
	}

	public stopTracker(name: string) {
		// Save the entry into the service
		this.trackerEntries.push({name, duration: this.timer.getDuration(), start: this.startDate});

		// Sort the entries in reverse chronological order
		this.trackerEntries.sort(this.compareTrackerEntries);

		// Stop the timer
		this.timer.stopTimer();
	}

	public getTimerDuration(): number {
		return this.timer.getDuration();
	}

	/**
	 * Compares two tracker entries.
	 * @param x First tracker entry to be compared.
	 * @param y Second tracker entry to be compared.
	 * @returns -1 if x is newer than y, 0 if x and y are equal, and 1 if y is newer than x.
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
