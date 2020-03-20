import { Component, OnInit } from '@angular/core';
import { TagService } from 'src/app/services/tag.service';

const DEFAULT_COLOR = '#ffffff';

@Component({
	selector: 'app-tag-edit',
	templateUrl: './tag-edit.component.html',
	styleUrls: ['./tag-edit.component.scss']
})
export class TagEditComponent implements OnInit {
	tagName: string;
	tagColor: string;

	constructor(private tagService: TagService) {}

	ngOnInit() {
		this.tagName = '';
		this.tagColor = DEFAULT_COLOR;
	}

	onSave() {
		this.tagService.setTag(this.tagName, this.tagColor);

		this.tagName = '';
		this.tagColor = DEFAULT_COLOR;
	}

	onCancel() {
		this.tagService.onCancelEdit();
	}
}
