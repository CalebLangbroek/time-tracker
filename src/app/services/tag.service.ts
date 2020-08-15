import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Tag } from '../models/tag.model';
import { TagApiService } from './tag-api.service';
import { NotificationService } from './notification.service';
import { AbstractDatabaseItemService } from './abstract/abstract-database-item.service';
import { UtilsService } from './utils.service';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class TagService extends AbstractDatabaseItemService<Tag> {
	isEditVisSubject = new BehaviorSubject<boolean>(false);

	constructor(
		protected api: TagApiService,
		protected notificationService: NotificationService,
		protected utils: UtilsService,
		protected auth: AuthService
	) {
		super(api, notificationService, utils, auth);
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
}
