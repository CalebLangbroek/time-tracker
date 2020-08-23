import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Entry } from 'src/app/models/entry.model';
import { Constants } from 'src/app/constants/constants';
import { EntryService } from 'src/app/services/entry.service';

interface DayEntry {
	duration: number;
	entries: Entry[];
}

@Component({
	selector: 'app-entry-list',
	templateUrl: './entry-list.component.html',
	styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit, OnDestroy {
	groupedEntries: DayEntry[];
	isLoading: boolean;
	ENTRY_LIMIT = Constants.ENTRY_LIMIT;
	entryCount = 0;

	private entrySub: Subscription;

	constructor(private entryService: EntryService) {}

	ngOnInit() {
		this.isLoading = true;
		this.groupedEntries = [];

		// Setup entry subscription
		this.entryService
			.getAll()
			.subscribe(
				this.onNextEntries.bind(this),
				null,
				() => (this.isLoading = false)
			);
		this.entrySub = this.entryService.itemsSubject.subscribe(
			this.onNextEntries.bind(this)
		);
	}

	ngOnDestroy(): void {
		this.entrySub.unsubscribe();
	}

	/**
	 * Group entries by day.
	 * Entries for a day will be an array nested under the day.
	 * Each day should have the total duration for that day.
	 * @param entries Entries to group.
	 */
	private onNextEntries(entries: Entry[]) {
		entries = entries.sort(this.compareEntries);
		const groupedEntries: DayEntry[] = [];
		this.entryCount = entries.length;
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long',
		};

		for (const entry of entries) {
			const dateStr = entry.start.toLocaleDateString('en-US', options);

			if (!groupedEntries[dateStr]) {
				groupedEntries[dateStr] = {
					dateStr,
					duration: 0,
					entries: [],
				};
			}

			groupedEntries[dateStr].duration += entry.duration;
			groupedEntries[dateStr].entries.push(entry);
		}

		let i = 0;

		for (const date in groupedEntries) {
			groupedEntries[i] = groupedEntries[date];
			delete groupedEntries[date];
			i++;
		}

		this.groupedEntries = groupedEntries;
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
}
