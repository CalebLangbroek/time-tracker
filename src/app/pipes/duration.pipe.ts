import { Pipe, PipeTransform } from '@angular/core';

export const SECONDS_IN_HOUR = 3600;
export const SECONDS_IN_MINUTE = 60;

@Pipe({
	name: 'duration'
})
export class DurationPipe implements PipeTransform {

	transform(duration: number): string {
		if (this.hasHours(duration)) {
			return this.parseWithHours(duration);
		}

		return this.parseWithoutHours(duration);
	}

	/**
	 * Check if a duration has more than 60 minutes.
	 * @param duration Duration in seconds.
	 */
	hasHours(duration: number): boolean {
		return (duration >= SECONDS_IN_HOUR);
	}

	/**
	 * Format the duration string with hours included.
	 * @param duration Duration in seconds.
	 */
	parseWithHours(duration: number): string {
		// Get the hours, minutes, and seconds that have passed
		// Need to take the floor so we don't round up when half way through an hour or minute
		let hours = Math.floor(duration / SECONDS_IN_HOUR).toFixed(0);
		let minutes = Math.floor(duration % SECONDS_IN_HOUR / SECONDS_IN_MINUTE).toFixed(0);
		let seconds = (duration % SECONDS_IN_HOUR % SECONDS_IN_MINUTE).toFixed(0);

		// Pad the string
		hours = this.padStringWithZero(hours);
		minutes = this.padStringWithZero(minutes);
		seconds = this.padStringWithZero(seconds);

		// Return the duration
		return `${hours}:${minutes}:${seconds}`;
	}

	/**
	 * Format the duration string without hours included.
	 * @param duration Duration in seconds.
	 */
	parseWithoutHours(duration: number): string {
		let minutes = Math.floor(duration / SECONDS_IN_MINUTE).toFixed(0);
		let seconds = (duration % SECONDS_IN_MINUTE).toFixed(0);

		// Pad the string
		minutes = this.padStringWithZero(minutes);
		seconds = this.padStringWithZero(seconds);

		// Return the duration
		return `${minutes}:${seconds}`;
	}

	/**
	 * Pad the str with a 0 if less than 10.
	 * @param str A string to pad.
	 */
	padStringWithZero(str: string): string {
		if (parseInt(str, 10) < 10) {
			str = `0${str}`;
		}
		return str;
	}
}
