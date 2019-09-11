import { TimeEntry } from './time-entry.model';

export interface DayEntry {
	date: string;
	entries: TimeEntry[];
}
