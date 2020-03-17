import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TagService {
	isEditVisSubject = new Subject<boolean>();

	constructor() {
		this.isEditVisSubject.next(false);
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

	setTag() {

	}

	setTagName() {

	}
}
