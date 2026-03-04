import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { RouteService } from '../services/route.service';
import { BookingClassService } from '../services/booking-class.service';
import { RoutesActions } from './routes.actions';
import { NotificationService } from '../../../core/services/notification.service';

export class RoutesEffects {
  private actions$ = inject(Actions);
  private routeService = inject(RouteService);
  private bookingClassService = inject(BookingClassService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  loadRoutes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutesActions.loadRoutes),
      exhaustMap(() =>
        this.routeService.getAll().pipe(
          map(routes => RoutesActions.loadRoutesSuccess({ routes })),
          catchError(error => of(RoutesActions.loadRoutesFailure({
            error: error.error?.message ?? 'Failed to load routes.'
          })))
        )
      )
    )
  );

  loadBookingClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutesActions.loadBookingClasses),
      exhaustMap(() =>
        this.bookingClassService.getAll().pipe(
          map(bookingClasses => RoutesActions.loadBookingClassesSuccess({ bookingClasses })),
          catchError(error => of(RoutesActions.loadBookingClassesFailure({
            error: error.error?.message ?? 'Failed to load booking classes.'
          })))
        )
      )
    )
  );

  loadRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutesActions.loadRoute),
      exhaustMap(({ id }) =>
        this.routeService.getById(id).pipe(
          map(route => RoutesActions.loadRouteSuccess({ route })),
          catchError(error => of(RoutesActions.loadRouteFailure({
            error: error.error?.message ?? 'Failed to load route.'
          })))
        )
      )
    )
  );

  createRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutesActions.createRoute),
      exhaustMap(({ dto }) =>
        this.routeService.create(dto).pipe(
          map(route => RoutesActions.createRouteSuccess({ route })),
          catchError(error => of(RoutesActions.createRouteFailure({
            error: error.error?.message ?? 'Failed to create route.'
          })))
        )
      )
    )
  );

  createRouteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutesActions.createRouteSuccess),
      tap(() => {
        this.notification.success('Route created successfully.');
        this.router.navigate(['/routes']);
      })
    ),
    { dispatch: false }
  );

  updateRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutesActions.updateRoute),
      exhaustMap(({ id, dto }) =>
        this.routeService.update(id, dto).pipe(
          map(route => RoutesActions.updateRouteSuccess({ route })),
          catchError(error => of(RoutesActions.updateRouteFailure({
            error: error.error?.message ?? 'Failed to update route.'
          })))
        )
      )
    )
  );

  updateRouteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutesActions.updateRouteSuccess),
      tap(() => {
        this.notification.success('Route updated successfully.');
        this.router.navigate(['/routes']);
      })
    ),
    { dispatch: false }
  );

  deleteRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutesActions.deleteRoute),
      exhaustMap(({ id }) =>
        this.routeService.delete(id).pipe(
          map(() => RoutesActions.deleteRouteSuccess({ id })),
          catchError(error => of(RoutesActions.deleteRouteFailure({
            error: error.error?.message ?? 'Failed to delete route.'
          })))
        )
      )
    )
  );

  deleteRouteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutesActions.deleteRouteSuccess),
      tap(() => this.notification.success('Route deleted successfully.'))
    ),
    { dispatch: false }
  );

  failure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        RoutesActions.loadRoutesFailure,
        RoutesActions.loadRouteFailure,
        RoutesActions.createRouteFailure,
        RoutesActions.updateRouteFailure,
        RoutesActions.deleteRouteFailure
      ),
      tap(({ error }) => this.notification.error(error))
    ),
    { dispatch: false }
  );
}