import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, BehaviorSubject } from 'rxjs';

import { TagService } from 'src/app/services/tag.service';
import { Entry } from '../../models/entry.model';
import { Tag } from 'src/app/models/tag.model';
import { Constants } from 'src/app/constants/constants';
import { EntryService } from 'src/app/services/entry.service';

interface DayEntry {
	duration: number;
	entries: Entry[];
}

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, OnDestroy {
	private entrySub: Subscription;
	private tagSub: Subscription;
	private tags: Tag[];
	groupedEntries: DayEntry[];
	isLoading: boolean;
	tagsSubject: BehaviorSubject<Tag[]>;
	ENTRY_LIMIT = Constants.ENTRY_LIMIT;
	entryCount = 0;

	constructor(
		private entryService: EntryService,
		private tagService: TagService
	) {}

	ngOnInit() {
		this.isLoading = true;
		this.groupedEntries = [];

		// Setup entry subscription
		this.entryService
			.getAll()
			.subscribe(
				this.groupEntriesByDay.bind(this),
				null,
				() => (this.isLoading = false)
			);
		this.entrySub = this.entryService.itemsSubject.subscribe(
			this.groupEntriesByDay.bind(this)
		);

		this.tagService.getAll().subscribe((tags) => (this.tags = tags));
		this.tagsSubject = new BehaviorSubject<Tag[]>(this.tags);

		// Get tags
		this.tagSub = this.tagService.itemsSubject.subscribe((tags) => {
			this.tags = tags;
			this.tagsSubject.next(this.tags);
		});
	}

	ngOnDestroy() {
		this.entrySub.unsubscribe();
		this.tagSub.unsubscribe();
	}

	onChangeName(dayIndex: number, entryIndex: number, name: string) {
		this.groupedEntries[dayIndex].entries[entryIndex].name = name;
		this.entryService.update(
			this.groupedEntries[dayIndex].entries[entryIndex]
		);
	}

	onChangeTagEdit(index: number, event: any) {
		if (event.id) {
			// Have a tag, should save it
			this.saveTag(index, event as Tag);
		} else {
			// Otherwise filter the list of tags
			this.filterTagList(event as string);
		}
	}

	onFocusTagEdit(input: string) {
		this.filterTagList(input);
	}

	onClickTagBadge(index: number) {
		this.entryService.deleteEntryTag(index);
	}

	onClickDelete(dayIndex: number, entryIndex: number) {
		this.entryService.delete(
			this.groupedEntries[dayIndex].entries[entryIndex].id
		);
	}

	onClickEdit(dayIndex: number, entryIndex: number) {
		const entry = this.groupedEntries[dayIndex].entries[entryIndex];
		entry.isOpen = !entry.isOpen;
	}

	onSaveEntry(
		dayIndex: number,
		entryIndex: number,
		startTime: string,
		startDate: string,
		endTime: string,
		endDate: string
	) {
		const start = new Date(`${startTime} ${startDate}`);
		const end = new Date(`${endTime} ${endDate}`);
		const duration = this.getDuration(start, end);

		const entry = this.groupedEntries[dayIndex].entries[entryIndex];
		entry.start = start;
		entry.end = end;
		entry.duration = duration;

		this.entryService.update(entry);
	}

	/**
	 * Set the tag for an entry.
	 *
	 * @param index Index in the tracker service's entry array.
	 * @param tag Tag to add to entry.
	 */
	private saveTag(index: number, tag: Tag) {
		this.entryService.addEntryTag(index, tag);
	}

	/**
	 * Filter tag names based on input.
	 *
	 * @param input String to filter tag names.
	 */
	private filterTagList(input: string) {
		this.tagsSubject.next(
			this.tags.filter((tag) =>
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
		this.entryCount = entries.length;

		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			const options = {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				weekday: 'long',
			};
			const dateStr = entry.start.toLocaleDateString('en-US', options);

			if (!groupedEntries[dateStr]) {
				groupedEntries[dateStr] = {
					dateStr,
					duration: 0,
					entries: [],
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

	/**
	 * Calculate the duration of a entry.
	 * @param start Starting date.
	 * @param end Ending date.
	 */
	private getDuration(start: Date, end: Date): number {
		return (end.getTime() - start.getTime()) / 1000;
	}
}
