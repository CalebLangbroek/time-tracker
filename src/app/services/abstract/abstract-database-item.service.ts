import { BehaviorSubject, Observable } from 'rxjs';

import { UtilsService } from '../utils.service';
import { NotificationService } from '../notification.service';
import { AbstractDatabaseItemApiService } from './abstract-database-item-api.service';
import { GenericDatabaseItem } from 'src/app/models/generic-database-item.model';

/**
 * Abstract service for items in the database.
 * Acts as an interface between the api and components, for the specific item.
 */
export abstract class AbstractDatabaseItemService<
	T extends GenericDatabaseItem
> {
	private items: T[] = [];
	itemsSubject = new BehaviorSubject<T[]>([]);

	constructor(
		private api: AbstractDatabaseItemApiService<T>,
		private notificationService: NotificationService,
		private utils: UtilsService
	) {
		this.api.getAll().subscribe((items) => {
			this.items = items;
			this.itemsSubject.next(this.items);
		});
	}

	get(id: string): Observable<T> {
		return new Observable<T>((sub) => {
			const item = this.items.find((item) => item.id === id);

			if (item) {
				// If item is already loaded, find and return
				sub.next(item);
				sub.complete();
			} else {
				// Otherwise return from server
				this.api.get(id).subscribe((res) => {
					sub.next(res);
					sub.complete();
				}, this.utils.handleAPIError.bind(this.utils));
			}
		});
	}

	create(item: T) {
		this.api.create(item).subscribe((res) => {
			item.id = res.name;
			this.items.unshift(item);
			this.itemsSubject.next(this.items);
			this.notificationService.sendNotification({
				message: 'Created',
				type: 'success',
			});
		}, this.utils.handleAPIError.bind(this.utils));
	}

	update(item: T) {
		const index = this.items.findIndex(
			(tempItem) => tempItem.id === item.id
		);
		this.items[index] = item;

		this.api.update(item).subscribe(() => {
			this.notificationService.sendNotification({
				message: 'Saved',
				type: 'success',
			});
		}, this.utils.handleAPIError.bind(this.utils));

		this.itemsSubject.next(this.items);
	}

	delete(id: string) {
		this.api.delete(id).subscribe(() => {
			// Send notification
			this.notificationService.sendNotification({
				message: 'Deleted',
				type: 'success',
			});
		}, this.utils.handleAPIError.bind(this.utils));

		// Remove from local array
		this.items = this.items.filter((item) => item.id !== id);

		// Notify any subscribers
		this.itemsSubject.next(this.items);
	}
}
