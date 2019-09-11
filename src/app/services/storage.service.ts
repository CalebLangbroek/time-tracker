import { Injectable } from '@angular/core';

import { DayEntry } from '../models/day-entry.model';

const STORE_KEY = 'time-tracker-entries';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	constructor() { }

	/**
	 * Retrieve time entries from local storage.
	 * @param start Start position to return. Defaults to start of the array.
	 * @param end End position to return. Defaults to end of the array.
	 */
	getEntries(start?: number, end?: number): DayEntry[] {
		// Get entries from local storage
		const dayEntriesStr = localStorage.getItem(STORE_KEY);

		// Return an empty array if nothing in local storage
		if (!dayEntriesStr) {
			return [];
		}

		let dayEntries: DayEntry[] = JSON.parse(dayEntriesStr);

		// Set default start and end
		start = !start ? 0 : start;
		end = !end || end > dayEntries.length ? dayEntries.length : end;

		dayEntries = dayEntries.slice(start, end);

		// Re-create the dates and close the entries
		for (const day of dayEntries) {
			for (const timeEntry of day.entries) {
				timeEntry.start = new Date(timeEntry.start);
				timeEntry.end = new Date(timeEntry.end);
				timeEntry.isOpen = false;
			}
		}

		return dayEntries;
	}

	/**
	 * Save the entries to local storage.
	 * @param entries Entries to save.
	 */
	setEntries(entries: DayEntry[]) {
		localStorage.setItem(STORE_KEY, JSON.stringify(entries));
	}

	/**
	 * Remove the items from local storage.
	 */
	removeEntries() {
		localStorage.removeItem(STORE_KEY);
	}
}
