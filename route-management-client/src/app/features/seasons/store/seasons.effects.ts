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

}