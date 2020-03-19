import { Component, OnInit } from '@angular/core';

import { TagService } from 'src/app/services/tag.service';

@Component({
	selector: 'app-tag-list',
	templateUrl: './tag-list.component.html',
	styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {
	tagsLength: number;
	filter: string;
	displayedColumns: string[] = ['name', 'color', 'delete'];

	constructor(private tagService: TagService) {}

	ngOnInit() {
		this.filter = '';

		// TODO: Add loading spinner, fix tags length to update with observable
		this.tagsLength = this.tagService.tagsSubject.getValue().length;
	}

	onClickDelete(tagID: string) {
		this.tagService.deleteTag(tagID);
	}
}
