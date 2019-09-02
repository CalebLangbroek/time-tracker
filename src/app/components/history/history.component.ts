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

	onClickEdit(index: number) {
		this.trackerEntries[index].isOpen = !this.trackerEntries[index].isOpen;
	}

	onChangeTime(index: number, time: string, prop: string) {
		if (!time) {
			return;
		}

		this.tracker.setTrackerEntryTime(index, time, prop);
	}

	onChangeDate(index: number, date: string, prop: string) {
		if (!date) {
			return;
		}

		this.tracker.setTrackerEntryDate(index, date, prop);
	}
 }
