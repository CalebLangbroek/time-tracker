import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';

import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { TrackerComponent } from './components/tracker/tracker.component';
import { HistoryComponent } from './components/history/history.component';
import { DurationPipe } from './pipes/duration.pipe';

@NgModule({
	declarations: [
		AppComponent,
		NavComponent,
		HomeComponent,
		TrackerComponent,
		HistoryComponent,
		DurationPipe,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatIconModule,
		MatCardModule,
		MatDividerModule,
		MatInputModule,
		FormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
