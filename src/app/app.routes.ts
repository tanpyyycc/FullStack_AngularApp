import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    title: 'Home',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'leaders',
    title: 'Gym Leaders',
    loadComponent: () => import('./leader-list/leader-list').then((m) => m.LeaderList),
  },
  {
    path: 'leaders/new',
    title: 'Register a Gym Leader',
    loadComponent: () => import('./leader-form/leader-form').then((m) => m.LeaderForm),
  },
  {
    path: 'leaders/:id/edit',
    title: 'Edit Gym Leader',
    loadComponent: () => import('./leader-form/leader-form').then((m) => m.LeaderForm),
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
  },
];
