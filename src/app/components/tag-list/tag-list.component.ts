import { Component, OnInit } from '@angular/core';

import { TagService } from 'src/app/services/tag.service';

@Component({
	selector: 'app-tag-list',
	templateUrl: './tag-list.component.html',
	styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {
	tagsLength: number;
	displayedColumns: string[] = ['name', 'color'];

	constructor(private tagService: TagService) {}

	ngOnInit() {
		this.tagsLength  = this.tagService.tagsSubject.getValue().length;
	}
}
