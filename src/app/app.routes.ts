import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing/landing';
import { Dashboard } from './pages/dashboard/dashboard';
import { EditResume } from './pages/edit-resume/edit-resume';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'resume/:id/edit', component: EditResume, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
