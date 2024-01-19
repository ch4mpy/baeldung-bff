import { Routes } from '@angular/router';
import { AboutView } from './about.view';
import { HomeView } from './home.view';

export const routes: Routes = [
  { path: 'home', component: HomeView },
  { path: 'about', component: AboutView },
  { path: '**', redirectTo: '/home' },
];
