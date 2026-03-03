import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../../store/auth/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.html',
  styleUrls: ['./unauthorized.scss'],
  standalone: false
})
export class Unauthorized {

  isAuthenticated$: Observable<boolean>;

  constructor(
    private router: Router,
    private store: Store
  ) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  goBack(): void {
    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/auth/login']);
      }
    }).unsubscribe();
  }
}