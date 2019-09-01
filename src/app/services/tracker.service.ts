import { Injectable } from '@angular/core';

import { TimerService } from './timer.service';

@Injectable({
	providedIn: 'root'
})
export class TrackerService {
	startDate: Date;
	endDate: Date;
	
	timeEntries: string[];

	constructor(private timer: TimerService) {
		this.timeEntries = [];
	}

	public startTracker() {
		this.startDate = new Date();
		// Start the timer
		this.timer.startTimer();
	}

	public stopTracker() {
		this.endDate = new Date();
		this.timeEntries.push(this.timer.getTime());
		this.timer.stopTimer();
	}

	public getTimerTime() {
		return this.timer.getTime();
	}
}
