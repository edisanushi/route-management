import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';

function getExpiresAtFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (typeof payload.exp === 'number') {
      return new Date(payload.exp * 1000).toISOString();
    }
  } catch {
  }
  return '';
}

export class AuthEffects {

  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ request }) =>
        this.authService.login(request).pipe(
          map(response => AuthActions.loginSuccess({ response })),
          catchError(error => of(AuthActions.loginFailure({
            error: error.error?.message ?? 'Login failed. Please try again.'
          })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigate(['/dashboard']))
    ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ request }) =>
        this.authService.register(request).pipe(
          map(response => AuthActions.registerSuccess({ response })),
          catchError(error => of(AuthActions.registerFailure({
            error: error.error?.message ?? 'Registration failed. Please try again.'
          })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      })
    ),
    { dispatch: false }
  );

  restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreSession),
      map(() => {
        const token = this.authService.getToken();
        const user  = this.authService.getStoredUser();

        if (token && user && this.authService.isAuthenticated()) {
          const expiresAt = getExpiresAtFromToken(token);
          return AuthActions.restoreSessionSuccess({
            response: {
              token,
              email:     user.email,
              role:      user.role,
              expiresAt
            }
          });
        }

        return AuthActions.logout();
      })
    )
  );
}