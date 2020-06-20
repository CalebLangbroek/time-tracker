import { Component, OnInit } from '@angular/core';

import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
	selector: 'app-projects',
	templateUrl: './projects.component.html',
	styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
	constructor(private projectService: ProjectService) {}

	ngOnInit() {}

	onNewTag() {
		// TODO: remove and add form for creating new tag
		const project: Project = {
			name: 'New Project',
			desc: 'A new test project',
			color: '#461D72',
			hours: 0,
		};

		this.projectService.createProject(project);
	}
}
