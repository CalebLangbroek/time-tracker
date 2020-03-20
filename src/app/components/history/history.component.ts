import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, BehaviorSubject } from 'rxjs';

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
	private entriesSubs: Subscription;
	private tagsSubs: Subscription;
	private tags: Tag[];
	groupedEntries: DayEntry[];
	isLoading: boolean;
	tagsSubject: BehaviorSubject<Tag[]>;

	constructor(
		private tracker: TrackerService,
		private tagService: TagService
	) {}

	ngOnInit() {
		this.isLoading = true;
		this.groupedEntries = [];

		// Setup entry subscription
		this.entriesSubs = this.tracker.entriesSubject.subscribe({
			next: this.groupEntriesByDay.bind(this)
		});

		this.tracker.getEntries().finally(() => (this.isLoading = false));

		this.tags = this.tagService.tagsSubject.getValue();
		this.tagsSubject = new BehaviorSubject<Tag[]>(this.tags);

		// Get tags
		this.tagsSubs = this.tagService.tagsSubject.subscribe(tags => {
			this.tags = tags;
			this.tagsSubject.next(this.tags);
		});
	}

	ngOnDestroy() {
		this.entriesSubs.unsubscribe();
		this.tagsSubs.unsubscribe();
	}

	onChangeName(index: number, name: string) {
		this.tracker.setEntryName(index, name);
	}

	onChangeTagEdit(
		index: number,
		dayIndex: number,
		entryIndex: number,
		event: any
	) {
		if (event.id) {
			// Have a tag, should save it
			this.saveTag(index, entryIndex, dayIndex, event as Tag);
		} else {
			// Otherwise filter the list of tags
			this.filterTagList(event as string);
		}
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

	/**
	 * Set the tag for an entry.
	 *
	 * @param index Index in the tracker service's entry array
	 * @param dayIndex Day index.
	 * @param entryIndex Entry index.
	 * @param tag Tag to add to entry.
	 */
	private saveTag(
		index: number,
		dayIndex: number,
		entryIndex: number,
		tag: Tag
	) {
		const entry = this.groupedEntries[dayIndex].entries[entryIndex];
		entry.showTagEdit = false;
		this.tracker.setEntryTag(index, tag);
	}

	/**
	 * Filter tag names based on input.
	 *
	 * @param input String to filter tag names.
	 */
	private filterTagList(input: string) {
		this.tagsSubject.next(
			this.tags.filter(tag =>
				tag.name.toLocaleLowerCase().includes(input.toLocaleLowerCase())
			)
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
			const options = {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				weekday: 'long'
			};
			const dateStr = entry.start.toLocaleDateString('en-US', options);

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
