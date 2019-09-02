import { Component, OnInit, OnDestroy } from '@angular/core';

import { TrackerService } from 'src/app/services/tracker.service';
import { TrackerEntry } from 'src/app/models/tracker-entry.model';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
	trackerEntries: TrackerEntry[];

	constructor(private tracker: TrackerService) { }

	ngOnInit() {
		this.trackerEntries = this.tracker.getTrackerEntries();
	}

	ngOnDestroy() {
	}

	onChangeName(index: number, name: string) {
		this.tracker.setTrackerEntryName(index, name);
	}

	onClickDelete(index: number) {
		this.tracker.deleteTrackerEntry(index);
	}

	onClickTime(index: number) {
		this.trackerEntries[index].opened = !this.trackerEntries[index].opened;
	}

	onChangeStartTime(index: number, time: string) {

	}

	onChangeStartDate(index: number, time: string) {

	}

	onChangeEndTime(index: number, time: string) {

	}

	onChangeEndDate(index: number, time: string) {

	}
 }
