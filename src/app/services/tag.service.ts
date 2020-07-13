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
		private apiT: TagApiService,
		private notificationServiceT: NotificationService,
		private utilsT: UtilsService,
		private authT: AuthService
	) {
		super(apiT, notificationServiceT, utilsT, authT);
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
