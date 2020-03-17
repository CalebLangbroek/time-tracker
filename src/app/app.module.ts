import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { TrackerComponent } from './components/tracker/tracker.component';
import { HistoryComponent } from './components/history/history.component';
import { DurationPipe } from './pipes/duration.pipe';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { TagComponent } from './components/tag/tag.component';
import { TagEditComponent } from './components/tag-edit/tag-edit.component';
import { TagListComponent } from './components/tag-list/tag-list.component';

@NgModule({
	declarations: [
		AppComponent,
		NavComponent,
		HomeComponent,
		TrackerComponent,
		HistoryComponent,
		DurationPipe,
		NotificationsComponent,
		AuthComponent,
		TagComponent,
		TagEditComponent,
		TagListComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatIconModule,
		MatCardModule,
		MatDividerModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
		MatExpansionModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatTooltipModule,
		MatSnackBarModule,
		HttpClientModule,
		MatProgressSpinnerModule,
		MatListModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptorService,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
