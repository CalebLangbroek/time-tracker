import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription, BehaviorSubject } from 'rxjs';

import { EntryService } from 'src/app/services/entry.service';
import { ProjectService } from 'src/app/services/project.service';
import { TagService } from 'src/app/services/tag.service';
import { Entry } from 'src/app/models/entry.model';
import { Project } from 'src/app/models/project.model';
import { Tag } from 'src/app/models/tag.model';

@Component({
	selector: 'app-entry',
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit, OnDestroy {
	@Input() entry: Entry;

	tagsSubject: BehaviorSubject<Tag[]>;
	projectSubject: BehaviorSubject<Project[]>;
	tagFilterValue = '';
	isOpen = false;

	private tagSub: Subscription;
	private projectSub: Subscription;
	private tags: Tag[] = [];
	private projects: Project[] = [];

	constructor(
		private entryService: EntryService,
		private tagService: TagService,
		private projectService: ProjectService
	) {}

	ngOnInit() {
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
		this.tagSub.unsubscribe();
		this.projectSub.unsubscribe();
	}

	onNameChange() {
		this.entryService.update(this.entry);
	}

	onProjectChange(event: any) {
		if (event.id) {
			this.entryService.addProject(this.entry.id, event as Project);
		} else {
			this.onProjectFocus(event as string);
		}
	}

	onProjectBadgeClick() {
		this.entryService.deleteProject(this.entry.id);
	}

	onProjectFocus(input: string) {
		this.projectSubject.next(
			this.projects.filter((project) =>
				project.name
					.toLocaleLowerCase()
					.includes(input.toLocaleLowerCase())
			)
		);
	}

	onDeleteClick() {
		this.entryService.delete(this.entry.id);
	}

	onEditClick() {
		this.isOpen = !this.isOpen;
	}

	onTagsChange(tags: Tag[]) {
		if (!this.entry.tags) {
			this.entry.tags = [];
		}

		if (this.entry.tags.length > tags.length) {
			const tag = this.entry.tags.filter(
				(tempTag) => !tags.includes(tempTag)
			)[0];
			this.entryService.deleteTag(this.entry.id, tag.id);
		} else {
			const tag = tags.filter(
				(tempTag) => !this.entry.tags.includes(tempTag)
			)[0];
			this.entryService.addTag(this.entry.id, tag);
		}

		this.entry.tags = tags;
	}

	onTagsOpenedChange() {
		this.tagFilterValue = '';
		this.tagsSubject.next(this.tags);
	}

	/**
	 * Filter tag names based on input.
	 */
	onTagFilterKeyup() {
		console.log(this.tagFilterValue);
		this.tagsSubject.next(
			this.tags.filter((tag) =>
				tag.name
					.toLocaleLowerCase()
					.includes(this.tagFilterValue.toLocaleLowerCase())
			)
		);
	}

	onEntrySubmit(
		startTime: string,
		startDate: string,
		endTime: string,
		endDate: string
	) {
		const start = new Date(`${startTime} ${startDate}`);
		const end = new Date(`${endTime} ${endDate}`);
		const duration = this.getDuration(start, end);

		this.entry.start = start;
		this.entry.end = end;
		this.entry.duration = duration;

		this.entryService.update(this.entry);
	}

	equalTags(x: Tag, y: Tag): boolean {
		if (!x || !y) return false;
		return x.id === y.id;
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
}
