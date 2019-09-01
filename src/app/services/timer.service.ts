import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TimerService {
	intervalId: any;
	time: number;

	constructor() {
		this.time = 0;
	}

	public startTimer(): void {
		this.intervalId = setInterval(this.updateTimer.bind(this), 1000);
	}

	public stopTimer(): void {
		clearInterval(this.intervalId);
		this.clearTimer();
	}

	public getTime(): string {
		// Get the minutes and seconds that have passed
		let minutes = (this.time / 60).toFixed(0);
		let seconds = (this.time % 60).toFixed(0);

		// Pad the times with a 0 if less than 10
		if (parseInt(minutes) < 10) {
			minutes = `0${minutes}`;
		}
		if (parseInt(seconds) < 10) {
			seconds = `0${seconds}`;
		}

		// Return the time
		return `${minutes}:${seconds}`;
	}

	private clearTimer(): void {
		this.time = 0;
	}

	private updateTimer(): void {
		this.time++;
	}
}
