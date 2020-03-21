import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Tag } from 'src/app/models/tag.model';
import { TagService } from 'src/app/services/tag.service';

@Component({
	selector: 'app-tag',
	templateUrl: './tag.component.html',
	styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit, OnDestroy {
	private tagSub: Subscription;
	tag: Tag;
	isLoading: boolean;

	constructor(
		private route: ActivatedRoute,
		private tagService: TagService
	) {}

	ngOnInit() {
		// Initialize the tag as empty
		this.tag = {
			name: '',
			color: ''
		};

		// Fetch the tag from the database
		this.isLoading = true;
		const tagID = this.route.snapshot.params['id'];
		this.tagSub = this.tagService
			.getTag(tagID)
			.subscribe(this.tagSubNextCallback.bind(this));
	}

	ngOnDestroy() {
		this.tagSub.unsubscribe();
	}

	private tagSubNextCallback(tag: Tag) {
		this.tag = tag;
		this.isLoading = false;
	}
}
