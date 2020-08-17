import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, BehaviorSubject } from 'rxjs';

import { TagService } from 'src/app/services/tag.service';
import { Entry } from '../../models/entry.model';
import { Tag } from 'src/app/models/tag.model';
import { Constants } from 'src/app/constants/constants';
import { EntryService } from 'src/app/services/entry.service';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

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
	private projectSub: Subscription;
	private tags: Tag[] = [];
	private projects: Project[] = [];
	groupedEntries: DayEntry[];
	isLoading: boolean;
	tagsSubject: BehaviorSubject<Tag[]>;
	projectSubject: BehaviorSubject<Project[]>;
	ENTRY_LIMIT = Constants.ENTRY_LIMIT;
	entryCount = 0;
	tagFilterValue = '';

	constructor(
		private entryService: EntryService,
		private tagService: TagService,
		private projectService: ProjectService
	) {}

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

		// Get tags
		this.tagsSubject = new BehaviorSubject<Tag[]>(this.tags);
		this.tagSub = this.tagService.itemsSubject.subscribe(
			this.onNextTags.bind(this)
		);
		this.tagService.getAll().subscribe(this.onNextTags.bind(this));

		// Get projects
		this.projectSubject = new BehaviorSubject<Project[]>(this.projects);
		this.projectSub = this.projectService.itemsSubject.subscribe(
			this.onNextProjects.bind(this)
		);
		this.projectService.getAll().subscribe(this.onNextProjects.bind(this));
	}

	ngOnDestroy() {
		this.entrySub.unsubscribe();
		this.tagSub.unsubscribe();
		this.projectSub.unsubscribe();
	}

	onChangeName(entry: Entry, name: string) {
		entry.name = name;
		this.entryService.update(entry);
	}

	onChangeProjectEdit(entry: Entry, event: any) {
		if (event.id) {
			this.entryService.addProject(entry.id, event as Project);
		} else {
			this.onFocusProjectEdit(event as string);
		}
	}

	onFocusProjectEdit(input: string) {
		this.projectSubject.next(
			this.projects.filter((project) =>
				project.name
					.toLocaleLowerCase()
					.includes(input.toLocaleLowerCase())
			)
		);
	}

	onClickProjectBadge(entry: Entry) {
		this.entryService.deleteProject(entry.id);
	}

	onChangeTagEdit(entry: Entry, tags: Tag[]) {
		if (!entry.tags) {
			entry.tags = [];
		}

		if (entry.tags.length > tags.length) {
			const tag = entry.tags.filter(
				(tempTag) => !tags.includes(tempTag)
			)[0];
			this.entryService.deleteTag(entry.id, tag.id);
		} else {
			const tag = tags.filter(
				(tempTag) => !entry.tags.includes(tempTag)
			)[0];
			this.entryService.addTag(entry.id, tag);
		}

		entry.tags = tags;
	}

	/**
	 * Filter tag names based on input.
	 *
	 * @param input String to filter tag names.
	 */
	onKeyupTagFilterEdit() {
		this.tagsSubject.next(
			this.tags.filter((tag) =>
				tag.name
					.toLocaleLowerCase()
					.includes(this.tagFilterValue.toLocaleLowerCase())
			)
		);
	}

	onOpenedChangeTagEdit(isOpen: boolean) {
		this.tagFilterValue = '';
		this.tagsSubject.next(this.tags);
	}

	onClickDelete(entry: Entry) {
		this.entryService.delete(entry.id);
	}

	onClickEdit(entry: Entry) {
		entry.isOpen = !entry.isOpen;
	}

	onSaveEntry(
		entry: Entry,
		startTime: string,
		startDate: string,
		endTime: string,
		endDate: string
	) {
		const start = new Date(`${startTime} ${startDate}`);
		const end = new Date(`${endTime} ${endDate}`);
		const duration = this.getDuration(start, end);

		entry.start = start;
		entry.end = end;
		entry.duration = duration;

		this.entryService.update(entry);
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

	private onNextTags(tags: Tag[]): void {
		this.tags = tags;
		this.tagsSubject.next(this.tags);
	}

	private onNextProjects(projects: Project[]): void {
		this.projects = projects;
		this.projectSubject.next(this.projects);
	}

	/**
	 * Calculate the duration of a entry.
	 * @param start Starting date.
	 * @param end Ending date.
	 */
	private getDuration(start: Date, end: Date): number {
		return (end.getTime() - start.getTime()) / 1000;
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

	private equalTags(x: Tag, y: Tag): boolean {
		if (!x || !y) return false;
		return x.id === y.id;
	}
}
