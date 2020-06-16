import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { TagComponent } from './components/tag/tag.component';
import { TagsComponent } from './components/tags/tags.component';
import { ProjectsComponent } from './components/projects/projects.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'signin', component: AuthComponent },
	{ path: 'signup', component: AuthComponent },
	{ path: 'tags', component: TagsComponent, canActivate: [AuthGuard] },
	{ path: 'tags/:id', component: TagComponent, canActivate: [AuthGuard] },
	{ path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
	{ path: '**', component: HomeComponent, canActivate: [AuthGuard] }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
