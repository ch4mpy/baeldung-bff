import { Component, OnDestroy } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div>
      <button [disabled]="isLoginDisabled" (click)="login()">Login</button>
      <button [disabled]="!isLoginDisabled" (click)="logout()">Logout</button>
      <button (click)="goTo(['about'])">About</button>
    </div>
    <p>{{ message }}</p>
  `,
  styles: [],
})
export class HomeView implements OnDestroy {
  private loginUri?: string;
  message: string = '';
  private userSubscription?: Subscription;

  constructor(private user: UserService, private router: Router) {
    user.loginOptions.subscribe((opts) => {
      if (opts.length) {
        this.loginUri = opts[0].loginUri;
      }
    });
    this.userSubscription = user.valueChanges.subscribe((u) => {
      this.message = u.isAuthenticated
        ? `Hi ${u.name}, you are granted with ${u.roles}.`
        : 'You are not authenticated.';
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  get isLoginDisabled(): boolean {
    return !this.loginUri || this.user.current.isAuthenticated;
  }

  login() {
    if (this.loginUri) {
      this.user.login(this.loginUri, ['home']);
    }
  }

  logout() {
    this.user.logout();
  }

  goTo(where: string[]) {
    this.router.navigate(where);
  }
}
