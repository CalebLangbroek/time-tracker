import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';
import { Constants } from 'src/app/constants/constants';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-project-edit',
	templateUrl: './project-edit.component.html',
	styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditComponent implements OnInit, OnDestroy {
	private projectSub: Subscription;
	project: Project;
	isLoading = true;

	constructor(
		private route: ActivatedRoute,
		private projectService: ProjectService
	) {}

	ngOnInit() {
		this.project = {
			name: '',
			color: Constants.DEFAULT_COLOR,
			desc: '',
			hours: 0,
		};

		this.isLoading = true;
		this.project.id = this.route.snapshot.params['id'];

		if (this.project.id) {
			this.projectSub = this.projectService
				.get(this.project.id)
				.subscribe((project) => {
					this.project = project;
					this.isLoading = false;
				});
		} else {
			this.isLoading = false;
		}
	}

	ngOnDestroy() {
		if (this.projectSub) {
			this.projectSub.unsubscribe();
		}
	}

	onFormSubmit() {
		if (this.project.id) {
			this.projectService.update(this.project);
		} else {
			this.projectService.create(this.project);
			// TODO: navigate to this project
		}
	}
}
