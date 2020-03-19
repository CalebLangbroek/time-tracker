import { Component, OnInit, OnDestroy } from '@angular/core';

import { TrackerService } from 'src/app/services/tracker.service';

@Component({
	selector: 'app-tracker',
	templateUrl: './tracker.component.html',
	styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, OnDestroy {
	isStarted: boolean;
	trackerName: string;

	constructor(public tracker: TrackerService) { }

	ngOnInit() {
		this.isStarted = this.tracker.getTimerIsStarted();
		this.trackerName = this.tracker.trackerName;
	}

	ngOnDestroy() {
		// Save the tracker name in persistent service
		this.tracker.trackerName = this.trackerName;
	}

	onStart() {
		// Update the component status
		this.isStarted = true;

		// Start the tracker
		this.tracker.startTracker();
	}

	onStop() {
		// Update the component status
		this.isStarted = false;

		// Stop the tracker
		this.tracker.stopTracker(this.trackerName);

		// Reset the input field
		this.trackerName = '';
	}
}
