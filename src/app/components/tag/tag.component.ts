import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Tag } from 'src/app/models/tag.model';
import { TagService } from 'src/app/services/tag.service';

@Component({
	selector: 'app-tag',
	templateUrl: './tag.component.html',
	styleUrls: ['./tag.component.scss'],
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
			color: '',
		};

		// Fetch the tag from the database
		this.isLoading = true;
		this.tag.id = this.route.snapshot.params['id'];
		this.tagSub = this.tagService
			.get(this.tag.id)
			.subscribe(this.tagSubNextCallback.bind(this));
	}

	ngOnDestroy() {
		this.tagSub.unsubscribe();
	}

	onSave(name: string, color: string) {
		this.tag.name = name;
		this.tag.color = color;
		this.tagService.update(this.tag);
	}

	private tagSubNextCallback(tag: Tag) {
		this.tag = tag;
		this.isLoading = false;
	}
}
