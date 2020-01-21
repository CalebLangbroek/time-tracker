import { Component, OnInit, OnDestroy } from '@angular/core';

import { TrackerService } from 'src/app/services/tracker.service';
import { Entry } from '../../models/entry.model';
import { Subscription } from 'rxjs';

interface DayEntry {
	duration: number;
	entries: Entry[];
}

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
	private entriesSubscription: Subscription;
	groupedEntries: DayEntry[];
	isLoading: boolean;

	constructor(private tracker: TrackerService) {}

	ngOnInit() {
		this.isLoading = true;
		this.groupedEntries = [];

		// Setup entry subscription
		this.entriesSubscription = this.tracker.entriesSubject.subscribe({
			next: this.groupEntriesByDay.bind(this)
		});

		this.tracker.getEntries().finally(() => (this.isLoading = false));
	}

	ngOnDestroy() {
		this.entriesSubscription.unsubscribe();
	}

	onChangeName(index: number, name: string) {
		this.tracker.setEntryName(index, name);
	}

	onClickDelete(index: number) {
		this.tracker.deleteEntry(index);
	}

	onClickEdit(dayIndex: number, entryIndex: number) {
		const entry = this.groupedEntries[dayIndex].entries[entryIndex];
		entry.isOpen = !entry.isOpen;
	}

	onSaveEntry(
		index: number,
		startTime: string,
		startDate: string,
		endTime: string,
		endDate: string
	) {
		this.tracker.setEntryStartEnd(
			index,
			startTime,
			startDate,
			endTime,
			endDate
		);
	}

	/**
	 * Group entries by day.
	 * Entries for a day will be an array nested under the day.
	 * Each day should have the total duration for that day.
	 * @param entries Entries to group.
	 */
	private groupEntriesByDay(entries: Entry[]) {
		const groupedEntries = [];

		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			const dateStr = entry.start.toDateString();

			if (!groupedEntries[dateStr]) {
				groupedEntries[dateStr] = {
					dateStr,
					duration: 0,
					entries: []
				};
			}

			entry.actualIndex = i;
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
}
