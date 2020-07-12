import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import * as Chart from 'chart.js';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
	selector: 'app-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
	@ViewChild('chartCanvas', { static: true }) chartCanvas: ElementRef;

	private projectSub: Subscription;
	private projectID: string;
	project: Project;
	isLoading = true;

	constructor(
		private route: ActivatedRoute,
		private projectService: ProjectService
	) {}

	ngOnInit() {
		this.isLoading = true;
		this.projectID = this.route.snapshot.params['id'];

		if (this.projectID) {
			this.projectSub = this.projectService
				.get(this.projectID)
				.subscribe(this.onProjectLoaded.bind(this));
		} else {
			this.isLoading = false;
		}
	}

	ngOnDestroy() {
		if (this.projectSub) {
			this.projectSub.unsubscribe();
		}
	}

	onProjectLoaded(project: Project) {
		this.project = project;

		const chart = new Chart(
			this.chartCanvas.nativeElement as HTMLCanvasElement,
			{
				type: 'doughnut',
				data: {
					datasets: [
						{
							data: [10, 20, 30],
							backgroundColor: [
								'rgba(255, 99, 132, 0.2)',
								'rgba(54, 162, 235, 0.2)',
								'rgba(255, 206, 86, 0.2)',
							],
							borderColor: [
								'rgba(255, 99, 132, 1)',
								'rgba(54, 162, 235, 1)',
								'rgba(255, 206, 86, 1)',
							],
						},
					],
					labels: ['Red', 'Yellow', 'Blue'],
				},
			}
		);

		chart.render();

		this.isLoading = false;
	}
}
