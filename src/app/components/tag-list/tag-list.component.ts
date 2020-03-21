import { Component, OnInit, OnDestroy } from '@angular/core';

import { TagService } from 'src/app/services/tag.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Tag } from 'src/app/models/tag.model';

@Component({
	selector: 'app-tag-list',
	templateUrl: './tag-list.component.html',
	styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit, OnDestroy {
	private tagsSubs: Subscription;
	isLoading: boolean;
	tags: Tag[];
	displayedColumns: string[] = ['name', 'color', 'delete', 'edit'];
	tagsSubject: BehaviorSubject<Tag[]>;

	constructor(private tagService: TagService) {}

	ngOnInit() {
		// TODO: Add loading feature
		this.isLoading = false;

		// Get tags
		this.tags = this.tagService.tagsSubject.getValue();
		this.tagsSubject = new BehaviorSubject<Tag[]>(this.tags);

		// Subscribe to tag changes
		this.tagsSubs = this.tagService.tagsSubject.subscribe(tags => {
			this.tags = tags;
			this.tagsSubject.next(this.tags);
		});
	}

	ngOnDestroy() {
		this.tagsSubs.unsubscribe();
	}

	onClickDelete(tagID: string) {
		this.tagService.deleteTag(tagID);
	}

	onFilterKeyUp(input: string) {
		this.tagsSubject.next(
			this.tags.filter(tag =>
				tag.name.toLocaleLowerCase().includes(input.toLocaleLowerCase())
			)
		);
	}
}
