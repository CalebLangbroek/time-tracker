import { Component, OnInit } from '@angular/core';
import { TagService } from 'src/app/services/tag.service';

@Component({
	selector: 'app-tag-edit',
	templateUrl: './tag-edit.component.html',
	styleUrls: ['./tag-edit.component.scss']
})
export class TagEditComponent implements OnInit {
	constructor(private tagService: TagService) {}

	ngOnInit() {}

	onSave(name: string) {
		console.log(name);
	}

	onCancel() {
		this.tagService.onCancelEdit();
	}
}
