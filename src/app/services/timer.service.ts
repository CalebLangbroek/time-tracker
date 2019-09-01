import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TimerService {
	intervalId: any;
	duration: number;

	constructor() {
		this.duration = 0;
	}

	public startTimer(): void {
		this.intervalId = setInterval(this.updateTimer.bind(this), 1000);
	}

	public stopTimer(): void {
		clearInterval(this.intervalId);
		this.clearTimer();
	}

	public getDuration(): number {
		return this.duration;
	}

	private clearTimer(): void {
		this.duration = 0;
	}

	private updateTimer(): void {
		this.duration++;
	}
}
