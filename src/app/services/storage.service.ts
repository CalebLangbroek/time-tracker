import { Injectable } from '@angular/core';

import { TrackerEntry } from '../models/tracker-entry.model';

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
	getEntries(start?: number, end?: number): TrackerEntry[] {
		// Get entries from local storage
		const entriesStr = localStorage.getItem(STORE_KEY);

		// Return an empty array if nothing in local storage
		if (!entriesStr) {
			return [];
		}

		let entries: TrackerEntry[] = JSON.parse(entriesStr);

		// Set default start and end
		start = !start ? 0 : start;
		end = !end || end > entries.length ? entries.length : end;

		entries = entries.slice(start, end);

		// Re-create the dates and close the entries
		for (const entry of entries) {
			entry.start = new Date(entry.start);
			entry.end = new Date(entry.end);
			entry.isOpen = false;
		}

		return entries;
	}

	/**
	 * Save the entries to local storage.
	 * @param entries Entries to save.
	 */
	setEntries(entries: TrackerEntry[]) {
		localStorage.setItem(STORE_KEY, JSON.stringify(entries));
	}

	/**
	 * Remove the items from local storage.
	 */
	removeEntries() {
		localStorage.removeItem(STORE_KEY);
	}
}
