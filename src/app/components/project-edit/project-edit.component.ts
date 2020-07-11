import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
	selector: 'app-project-edit',
	templateUrl: './project-edit.component.html',
	styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditComponent implements OnInit {
	project: Project;
	isLoading = true;

	constructor(
		private route: ActivatedRoute,
		private projectService: ProjectService
	) {}

	ngOnInit() {
		this.project = {
			name: '',
			color: '',
			desc: '',
			hours: 0
		};

		this.isLoading = true;
		this.project.id = this.route.snapshot.params['id'];
	}

	onFormSubmit() {
		if (this.project.id) {
			// TODO
		} else {
			this.projectService.createProject(this.project);
		}
	}
}
