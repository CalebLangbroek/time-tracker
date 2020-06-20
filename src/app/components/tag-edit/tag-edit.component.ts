import { Component, OnInit } from '@angular/core';

import { TagService } from 'src/app/services/tag.service';

const TAG_MAX_LENGTH = 95;
const DEFAULT_COLOR = '#ffffff';

@Component({
	selector: 'app-tag-edit',
	templateUrl: './tag-edit.component.html',
	styleUrls: ['./tag-edit.component.scss'],
})
export class TagEditComponent implements OnInit {
	tagName = '';
	tagColor = DEFAULT_COLOR;
	TAG_MAX_LENGTH = TAG_MAX_LENGTH;

	constructor(private tagService: TagService) {}

	ngOnInit() {}

	onSave() {
		this.tagService.createTag(this.tagName, this.tagColor);

		this.tagName = '';
		this.tagColor = DEFAULT_COLOR;
	}

	onCancel() {
		this.tagService.onCancelEdit();
	}
}
