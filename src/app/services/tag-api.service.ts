import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { Tag } from '../models/tag.model';
import { AbstractDatabaseItemApiService } from './abstract/abstract-database-item-api.service';

@Injectable({
	providedIn: 'root',
})
export class TagApiService extends AbstractDatabaseItemApiService<Tag> {
	constructor(
		private authT: AuthService,
		private httpT: HttpClient,
		private utilsT: UtilsService
	) {
		super(authT, utilsT, httpT, 'tags');
	}

	clearFields<Tag>(item: any): Tag {
		const tag: any = {
			name: item.name,
			color: item.color,
		};

		return tag as Tag;
	}
}
