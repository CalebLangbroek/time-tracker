import { Component, OnInit } from '@angular/core';

import { TrackerService } from 'src/app/services/tracker.service';

@Component({
	selector: 'app-tracker',
	templateUrl: './tracker.component.html',
	styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit {
	started: boolean;
	trackerName: string;

	constructor(public tracker: TrackerService) { }

	ngOnInit() {
		this.started = false;
		this.trackerName = '';
	}

	onStart() {
		// Update the component status
		this.started = true;

		// Start the tracker
		this.tracker.startTracker();
	}

	onStop() {
		// Update the component status
		this.started = false;

		// Stop the tracker
		this.tracker.stopTracker(this.trackerName);

		// Reset the input field
		this.trackerName = '';
	}
}
