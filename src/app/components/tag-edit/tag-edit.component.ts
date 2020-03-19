import { Component, OnInit } from '@angular/core';
import { TagService } from 'src/app/services/tag.service';

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
		this.tagColor = '#ffffff';
	}

	onSave() {
		this.tagService.setTag(this.tagName, this.tagColor);

		this.tagColor = this.tagName = '';
	}

	onCancel() {
		this.tagService.onCancelEdit();
	}
}
