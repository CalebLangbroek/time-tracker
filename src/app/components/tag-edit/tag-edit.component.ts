import { Component, OnInit } from '@angular/core';

import { TagService } from 'src/app/services/tag.service';
import { Constants } from 'src/app/constants/constants';

const TAG_MAX_LENGTH = 95;

@Component({
	selector: 'app-tag-edit',
	templateUrl: './tag-edit.component.html',
	styleUrls: ['./tag-edit.component.scss'],
})
export class TagEditComponent implements OnInit {
	tagName = '';
	tagColor = Constants.DEFAULT_COLOR;
	TAG_MAX_LENGTH = TAG_MAX_LENGTH;

	constructor(private tagService: TagService) {}

	ngOnInit() {}

	onSave() {
		this.tagService.createTag(this.tagName, this.tagColor);

		this.tagName = '';
		this.tagColor = Constants.DEFAULT_COLOR;
	}

	onCancel() {
		this.tagService.onCancelEdit();
	}
}
