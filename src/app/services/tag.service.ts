import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Tag } from '../models/tag.model';

@Injectable({
	providedIn: 'root'
})
export class TagService {
	private tags: Tag[];
	tagsSubject = new BehaviorSubject<Tag[]>([]);
	isEditVisSubject = new BehaviorSubject<boolean>(false);

	constructor() {
		this.tags = [];
		this.tagsSubject.next(this.tags);
	}

	getTags() {

	}

	/**
	 *
	 */
	onShowEdit() {
		this.isEditVisSubject.next(true);
	}

	onCancelEdit() {
		this.isEditVisSubject.next(false);
	}

	setTag(name: string, color: string) {
		const newTag: Tag = {
			name,
			color
		};

		this.tags.unshift(newTag);
		this.tagsSubject.next(this.tags);
	}

	setTagName(index: number, name: string) {}

	deleteTag(index: number) {
		// Remove from array


		// Post
	}
}
