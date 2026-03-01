import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit{
  
  title = 'Route Fare Management Platform';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.restoreSession());
  }
}