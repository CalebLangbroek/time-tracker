import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'signin', component: AuthComponent },
	{ path: 'signup', component: AuthComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
