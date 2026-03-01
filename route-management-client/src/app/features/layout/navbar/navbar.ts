import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthActions } from '../../../store/auth/auth.actions';
import { selectUserEmail, selectIsAdmin } from '../../../store/auth/auth.selectors';

@Component({
  selector:    'app-navbar',
  templateUrl: './navbar.html',
  styleUrls:   ['./navbar.scss'],
  standalone:  false
})
export class Navbar implements OnInit {

  userEmail$: Observable<string | null>;
  isAdmin$:   Observable<boolean>;

  constructor(private store: Store) {
    this.userEmail$ = this.store.select(selectUserEmail);
    this.isAdmin$   = this.store.select(selectIsAdmin);
  }

  ngOnInit(): void {}

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}