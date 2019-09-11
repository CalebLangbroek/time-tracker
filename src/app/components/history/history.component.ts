import { Component, OnInit, OnDestroy } from '@angular/core';

import { TrackerService } from 'src/app/services/tracker.service';
import { DayEntry } from '../../models/day-entry.model';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
	dayEntries: DayEntry[];

	constructor(private tracker: TrackerService) { }

	ngOnInit() {
		this.dayEntries = this.tracker.getDayEntries();
	}

	ngOnDestroy() {
	}

	onChangeName(dayIndex: number, timeIndex: number, name: string) {
		this.tracker.setTimeEntryName(dayIndex, timeIndex, name);
	}

	onClickDelete(dayIndex: number, timeIndex: number) {
		this.tracker.deleteTimeEntry(dayIndex, timeIndex);
	}

	onClickEdit(dayIndex: number, timeIndex: number) {
		this.dayEntries[dayIndex].entries[timeIndex].isOpen = !this.dayEntries[dayIndex].entries[timeIndex].isOpen;
	}

	onSaveEntry(dayIndex: number, timeIndex: number, startTime: string, startDate: string, endTime: string, endDate: string) {
		this.tracker.setTimeEntryStartEnd(dayIndex, timeIndex, startTime, startDate, endTime, endDate);
	}
 }
