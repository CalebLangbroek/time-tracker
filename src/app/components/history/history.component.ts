import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { TrackerService } from 'src/app/services/tracker.service';
import { Entry } from '../../models/entry.model';
import { Tag } from 'src/app/models/tag.model';
import { TagService } from 'src/app/services/tag.service';

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
	private entriesSub: Subscription;
	private tagsSub: Subscription;
	groupedEntries: DayEntry[];
	isLoading: boolean;
	tags: Tag[];

	constructor(
		private tracker: TrackerService,
		private tagService: TagService
	) {}

	ngOnInit() {
		this.isLoading = true;
		this.groupedEntries = [];

		// Setup entry subscription
		this.entriesSub = this.tracker.entriesSubject.subscribe({
			next: this.groupEntriesByDay.bind(this)
		});

		this.tracker.getEntries().finally(() => (this.isLoading = false));

		// Get tags
		this.tags = this.tagService.tagsSubject.getValue();

		this.tagsSub = this.tagService.tagsSubject.subscribe(
			tags => (this.tags = tags)
		);
	}

	ngOnDestroy() {
		this.entriesSub.unsubscribe();
		this.tagsSub.unsubscribe();
	}

	onChangeName(index: number, name: string) {
		this.tracker.setEntryName(index, name);
	}

	onChangeTag(index: number, tag: Tag, dayIndex: number, entryIndex: number) {
		const entry = this.groupedEntries[dayIndex].entries[entryIndex];
		entry.showTagEdit = false;
		this.tracker.setEntryTag(index, tag);
	}

	onClickTagEdit(index: number, dayIndex: number, entryIndex: number) {
		const entry = this.groupedEntries[dayIndex].entries[entryIndex];
		entry.showTagEdit = true;
		this.tracker.deleteEntryTag(index);
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

	displayWithTag(tag: Tag) {
		return tag && tag.name ? tag.name : '';
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
