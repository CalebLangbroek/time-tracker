import { Component, OnInit, OnDestroy } from '@angular/core';

import { EntryService } from 'src/app/services/entry.service';

@Component({
	selector: 'app-tracker',
	templateUrl: './tracker.component.html',
	styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, OnDestroy {
	isStarted: boolean;
	trackerName: string;

	constructor(public entryService: EntryService) { }

	ngOnInit() {
		this.isStarted = this.entryService.getTimerIsStarted();
		this.trackerName = this.entryService.trackerName;
	}

	ngOnDestroy() {
		// Save the tracker name in persistent service
		this.entryService.trackerName = this.trackerName;
	}

	onStart() {
		// Update the component status
		this.isStarted = true;

		// Start the tracker
		this.entryService.startTracker();
	}

	onStop() {
		// Update the component status
		this.isStarted = false;

		// Stop the tracker
		this.entryService.stopTracker(this.trackerName);

		// Reset the input field
		this.trackerName = '';
	}
}
