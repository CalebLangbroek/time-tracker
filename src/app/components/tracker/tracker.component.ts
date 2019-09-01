import { Component, OnInit } from '@angular/core';

import { TrackerService } from 'src/app/services/tracker.service';

@Component({
	selector: 'app-tracker',
	templateUrl: './tracker.component.html',
	styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit {
	started: boolean;
	
	constructor(public tracker: TrackerService) { }

	ngOnInit() {
		this.started = false;
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
		this.tracker.stopTracker();	
	}
}
