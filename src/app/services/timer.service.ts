import { Injectable } from '@angular/core';

import { interval, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TimerService {
	private intervalSub: Subscription;
	private duration: number;
	private isStarted: boolean;

	constructor() {
		this.duration = 0;
		this.isStarted = false;
	}

	startTimer(): void {
		this.isStarted = true;
		this.intervalSub = interval(1000).subscribe(() => this.duration++);
	}

	stopTimer(): number {
		// Check that we have a timer started
		if (!this.isStarted) {
			return;
		}

		this.isStarted = false;
		this.intervalSub.unsubscribe();
		const duration = this.duration;
		this.duration = 0;
		return duration;
	}

	getDuration(): number {
		return this.duration;
	}

	getIsStarted(): boolean {
		return this.isStarted;
	}
}
