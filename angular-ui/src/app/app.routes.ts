import { Routes } from '@angular/router';
import { HomeView } from './home.view';
import { AboutView } from './about.view';

export const routes: Routes = [
  { path: 'home', component: HomeView },
  { path: 'about', component: AboutView },
  { path: '**',   redirectTo: '/home' }
];
