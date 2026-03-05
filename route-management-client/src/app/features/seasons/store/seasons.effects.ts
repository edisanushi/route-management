import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { SeasonService } from '../services/season.service';
import { SeasonsActions } from './seasons.actions';
import { NotificationService } from '../../../core/services/notification.service';

export class SeasonsEffects {
  private actions$ = inject(Actions);
  private seasonService = inject(SeasonService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  createSeason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SeasonsActions.createSeason),
      exhaustMap(({ dto }) =>
        this.seasonService.create(dto).pipe(
          map(() => SeasonsActions.createSeasonSuccess()),
          catchError(error => of(SeasonsActions.createSeasonFailure({
            error: error.error?.message ?? 'Failed to create season.'
          })))
        )
      )
    )
  );

  createSeasonSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SeasonsActions.createSeasonSuccess),
      tap(() => {
        this.notification.success('Season created successfully.');
        this.router.navigate(['/seasons']);
      })
    ),
    { dispatch: false }
  );

  createSeasonFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SeasonsActions.createSeasonFailure),
      tap(({ error }) => this.notification.error(error))
    ),
    { dispatch: false }
  );

  loadSeasons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SeasonsActions.loadSeasons),
      exhaustMap(() =>
        this.seasonService.getAll().pipe(
          map(seasons => SeasonsActions.loadSeasonsSuccess({ seasons })),
          catchError(error => of(SeasonsActions.loadSeasonsFailure({
            error: error.error?.message ?? 'Failed to load seasons.'
          })))
        )
      )
    )
  );

  loadSeasonsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SeasonsActions.loadSeasonsFailure),
      tap(({ error }) => this.notification.error(error))
    ),
    { dispatch: false }
  );

  loadSeason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SeasonsActions.loadSeason),
      exhaustMap(({ id }) =>
        this.seasonService.getById(id).pipe(
          map(season => SeasonsActions.loadSeasonSuccess({ season })),
          catchError(error => of(SeasonsActions.loadSeasonFailure({
            error: error.error?.message ?? 'Failed to load season.'
          })))
        )
      )
    )
  );

  updateSeason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SeasonsActions.updateSeason),
      exhaustMap(({ id, dto }) =>
        this.seasonService.update(id, dto).pipe(
          map(season => SeasonsActions.updateSeasonSuccess({ season })),
          catchError(error => of(SeasonsActions.updateSeasonFailure({
            error: error.error?.message ?? 'Failed to update season.'
          })))
        )
      )
    )
  );

  updateSeasonSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SeasonsActions.updateSeasonSuccess),
      tap(() => {
        this.notification.success('Season updated successfully.');
        this.router.navigate(['/seasons']);
      })
    ),
    { dispatch: false }
  );

  deleteSeason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SeasonsActions.deleteSeason),
      exhaustMap(({ id }) =>
        this.seasonService.delete(id).pipe(
          map(() => SeasonsActions.deleteSeasonSuccess({ id })),
          catchError(error => of(SeasonsActions.deleteSeasonFailure({
            error: error.error?.message ?? 'Failed to delete season.'
          })))
        )
      )
    )
  );

  deleteSeasonSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SeasonsActions.deleteSeasonSuccess),
      tap(() => this.notification.success('Season deleted successfully.'))
    ),
    { dispatch: false }
  );

  failureEffects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        SeasonsActions.loadSeasonFailure,
        SeasonsActions.updateSeasonFailure,
        SeasonsActions.deleteSeasonFailure
      ),
      tap(({ error }) => this.notification.error(error))
    ),
    { dispatch: false }
  );

}