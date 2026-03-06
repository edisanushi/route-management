import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { TourOperatorService } from '../services/tour-operator.service';
import { TourOperatorsActions } from './tour-operators.actions';
import { NotificationService } from '../../../core/services/notification.service';

export class TourOperatorsEffects {
  private actions$ = inject(Actions);
  private tourOperatorService = inject(TourOperatorService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  loadTourOperators$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.loadTourOperators),
      exhaustMap(() =>
        this.tourOperatorService.getAll().pipe(
          map(tourOperators => TourOperatorsActions.loadTourOperatorsSuccess({ tourOperators })),
          catchError(error => of(TourOperatorsActions.loadTourOperatorsFailure({
            error: error.error?.message ?? 'Failed to load tour operators.'
          })))
        )
      )
    )
  );

  loadTourOperator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.loadTourOperator),
      exhaustMap(({ id }) =>
        this.tourOperatorService.getById(id).pipe(
          map(tourOperator => TourOperatorsActions.loadTourOperatorSuccess({ tourOperator })),
          catchError(error => of(TourOperatorsActions.loadTourOperatorFailure({
            error: error.error?.message ?? 'Failed to load tour operator.'
          })))
        )
      )
    )
  );

  loadMyProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.loadMyProfile),
      exhaustMap(() =>
        this.tourOperatorService.getMyProfile().pipe(
          map(tourOperator => TourOperatorsActions.loadMyProfileSuccess({ tourOperator })),
          catchError(error => of(TourOperatorsActions.loadMyProfileFailure({
            error: error.error?.message ?? 'Failed to load profile.'
          })))
        )
      )
    )
  );

  createTourOperator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.createTourOperator),
      exhaustMap(({ dto }) =>
        this.tourOperatorService.create(dto).pipe(
          map(tourOperator => TourOperatorsActions.createTourOperatorSuccess({ tourOperator })),
          catchError(error => of(TourOperatorsActions.createTourOperatorFailure({
            error: error.error?.message ?? 'Failed to create tour operator.'
          })))
        )
      )
    )
  );

  createTourOperatorSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.createTourOperatorSuccess),
      tap(() => {
        this.notification.success('Tour operator created successfully.');
        this.router.navigate(['/tour-operators']);
      })
    ),
    { dispatch: false }
  );

  updateTourOperator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.updateTourOperator),
      exhaustMap(({ id, dto }) =>
        this.tourOperatorService.update(id, dto).pipe(
          map(tourOperator => TourOperatorsActions.updateTourOperatorSuccess({ tourOperator })),
          catchError(error => of(TourOperatorsActions.updateTourOperatorFailure({
            error: error.error?.message ?? 'Failed to update tour operator.'
          })))
        )
      )
    )
  );

  updateTourOperatorSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.updateTourOperatorSuccess),
      tap(() => {
        this.notification.success('Tour operator updated successfully.');
        this.router.navigate(['/tour-operators']);
      })
    ),
    { dispatch: false }
  );

  updateMyProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.updateMyProfile),
      exhaustMap(({ id, dto }) =>
        this.tourOperatorService.updateProfile(id, dto).pipe(
          map(tourOperator => TourOperatorsActions.updateMyProfileSuccess({ tourOperator })),
          catchError(error => of(TourOperatorsActions.updateMyProfileFailure({
            error: error.error?.message ?? 'Failed to update profile.'
          })))
        )
      )
    )
  );

  updateMyProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.updateMyProfileSuccess),
      tap(() => this.notification.success('Profile updated successfully.'))
    ),
    { dispatch: false }
  );

  deleteTourOperator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.deleteTourOperator),
      exhaustMap(({ id }) =>
        this.tourOperatorService.delete(id).pipe(
          map(() => TourOperatorsActions.deleteTourOperatorSuccess({ id })),
          catchError(error => of(TourOperatorsActions.deleteTourOperatorFailure({
            error: error.error?.message ?? 'Failed to delete tour operator.'
          })))
        )
      )
    )
  );

  deleteTourOperatorSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourOperatorsActions.deleteTourOperatorSuccess),
      tap(() => this.notification.success('Tour operator deleted successfully.'))
    ),
    { dispatch: false }
  );

  failure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TourOperatorsActions.loadTourOperatorsFailure,
        TourOperatorsActions.loadTourOperatorFailure,
        TourOperatorsActions.loadMyProfileFailure,
        TourOperatorsActions.createTourOperatorFailure,
        TourOperatorsActions.updateTourOperatorFailure,
        TourOperatorsActions.updateMyProfileFailure,
        TourOperatorsActions.deleteTourOperatorFailure
      ),
      tap(({ error }) => this.notification.error(error))
    ),
    { dispatch: false }
  );
}
