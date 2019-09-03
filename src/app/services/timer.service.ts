import { Injectable } from '@angular/core';

import { interval, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TimerService {
	private intervalSub: Subscription;
	private duration: number;

	constructor() {
		this.duration = 0;
	}

	startTimer(): void {
		this.intervalSub = interval(1000).subscribe(() => this.duration++);
	}

	stopTimer(): number {
		this.intervalSub.unsubscribe();
		const duration = this.duration;
		this.clearTimer();
		return duration;
	}

	getDuration(): number {
		return this.duration;
	}

	private clearTimer(): void {
		this.duration = 0;
	}
}
