import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    title: 'Home',
    loadComponent: () => import('./components/home').then((m) => m.Home),
  },
  {
    path: 'leaders',
    title: 'Gym Leaders',
    loadComponent: () => import('./components/leader-list').then((m) => m.LeaderList),
  },
  {
    path: 'leaders/new',
    title: 'Register a Gym Leader',
    loadComponent: () => import('./components/leader-form').then((m) => m.LeaderForm),
  },
  {
    path: 'leaders/:id/edit',
    title: 'Edit Gym Leader',
    loadComponent: () => import('./components/leader-form').then((m) => m.LeaderForm),
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () => import('./components/notfound').then((m) => m.NotFound),
  },
];