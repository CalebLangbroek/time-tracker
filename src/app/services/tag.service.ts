import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Tag } from '../models/tag.model';
import { TagApiService } from './tag-api.service';
import { NotificationService } from './notification.service';

@Injectable({
	providedIn: 'root'
})
export class TagService {
	private tags: Tag[];
	tagsSubject = new BehaviorSubject<Tag[]>([]);
	isEditVisSubject = new BehaviorSubject<boolean>(false);

	constructor(
		private tagAPI: TagApiService,
		private notification: NotificationService
	) {
		this.tags = [];

		this.tagAPI.getTags().subscribe(resTags => {
			this.tags = resTags;
			this.tagsSubject.next(this.tags);
		}, this.handleAPIError.bind(this));
	}

	/**
	 * Show the tag-edit component.
	 */
	onShowEdit() {
		this.isEditVisSubject.next(true);
	}

	/**
	 * Hide the tag-edit component.
	 */
	onCancelEdit() {
		this.isEditVisSubject.next(false);
	}

	setTag(name: string, color: string) {
		const newTag: Tag = {
			name,
			color
		};

		this.tagAPI.setTag(newTag).subscribe(resTag => {
			// Save with the new ID
			newTag.id = resTag.name;

			// Add to the list of tags
			this.tags.unshift(newTag);

			// Notify any subscribers
			this.tagsSubject.next(this.tags);
		}, this.handleAPIError.bind(this));
	}

	setTagName(index: number, name: string) {}

	/**
	 * Remove a tag from the array at a given index.
	 * @param tagID ID of the tag to delete.
	 */
	deleteTag(tagID: string) {
		this.tagAPI.deleteTag(tagID).subscribe(() => {
			// Send notification
			this.notification.sendNotification({
				message: 'Tag deleted',
				type: 'success'
			});
		}, this.handleAPIError.bind(this));

		// Remove tag from local array
		this.tags = this.tags.filter(tag => tag.id !== tagID);

		// Notify any subscribers
		this.tagsSubject.next(this.tags);
	}

	/**
	 * Send a new notification if an API error occurs.
	 * @param err Error message as a string.
	 */
	private handleAPIError(err: string) {
		this.notification.sendNotification({
			message: err,
			type: 'danger'
		});
	}
}
