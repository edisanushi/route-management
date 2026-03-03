import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthActions } from '../../store/auth/auth.actions';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private store: Store,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        const isAuthEndpoint = request.url.includes('/auth/login') ||
                             request.url.includes('/auth/register');

        switch (error.status) {

        case 0:
          console.error('Cannot reach the server. Please check your connection.');
          break;

        case 401:
          if (!isAuthEndpoint) {
            console.warn('Session expired. Redirecting to login...');
            this.store.dispatch(AuthActions.logout());
          }
          break;

        case 403:
          console.warn('Access denied. You do not have permission.');
          this.router.navigate(['/unauthorized']);
          break;

        case 404:
          console.warn(`Resource not found: ${request.url}`);
          break;

        case 500:
          console.error('A server error occurred. Please try again later.');
          break;

        default:
          console.error(`Unexpected error: ${error.status}`);
          break;
      }

        return throwError(() => error);
      })
    );
  }
}