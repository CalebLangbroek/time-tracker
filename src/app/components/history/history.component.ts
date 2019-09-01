import { Component, OnInit } from '@angular/core';

import { TrackerService } from 'src/app/services/tracker.service';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

	constructor(public tracker: TrackerService) { }

	ngOnInit() {
	}

}
