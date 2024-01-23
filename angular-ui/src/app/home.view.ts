import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationComponent } from './navigation.component';
import { UserService } from './auth/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavigationComponent],
  template: `<app-navigation
      [destination]="['about']"
      label="About"
    ></app-navigation>
    <p>{{ message }}</p>`,
  styles: [],
})
export class HomeView {
  message = '';

  private userSubscription?: Subscription;

  constructor(user: UserService) {
    this.userSubscription = user.valueChanges.subscribe((u) => {
      this.message = u.isAuthenticated
        ? `Hi ${u.name}, you are granted with [${
            u.roles.length ? '"' : ''
          }${u.roles.join('", "')}${u.roles.length ? '"' : ''}].`
        : 'You are not authenticated.';
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
}
