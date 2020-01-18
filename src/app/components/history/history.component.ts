import { Component, OnInit, OnDestroy } from '@angular/core';

import { TrackerService } from 'src/app/services/tracker.service';
import { Entry } from '../../models/entry.model';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
	entries: Entry[];
	isLoading = false;

	constructor(private tracker: TrackerService) {}

	ngOnInit() {
		this.isLoading = true;
		this.tracker
			.getEntries()
			.then(entries => (this.entries = entries))
			.finally(() => (this.isLoading = false));
	}

	ngOnDestroy() {}

	onChangeName(index: number, name: string) {
		this.tracker.setEntryName(index, name);
	}

	onClickDelete(index: number) {
		this.tracker.deleteEntry(index);
	}

	onClickEdit(index: number) {
		this.entries[index].isOpen = !this.entries[index].isOpen;
	}

	onSaveEntry(
		index: number,
		startTime: string,
		startDate: string,
		endTime: string,
		endDate: string
	) {
		this.tracker.setEntryStartEnd(
			index,
			startTime,
			startDate,
			endTime,
			endDate
		);
	}
}
