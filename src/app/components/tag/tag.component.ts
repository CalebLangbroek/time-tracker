import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TagService } from 'src/app/services/tag.service';

@Component({
	selector: 'app-tag',
	templateUrl: './tag.component.html',
	styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
	isEditVis: boolean;
	private isEditVisSub: Subscription;

	constructor(private tagService: TagService) {}

	ngOnInit() {
		this.isEditVis = this.tagService.isEditVisSubject.getValue();

		// Subscribe to opening and closing of edit component
		this.isEditVisSub = this.tagService.isEditVisSubject.subscribe(
			isEditVis => (this.isEditVis = isEditVis)
		);
	}

	ngOnDestroy() {
		this.isEditVisSub.unsubscribe();
	}

	/**
	 * Called when the add new tag button is clicked.
	 */
	onNewTag() {
		this.tagService.onShowEdit();
	}
}
