import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { PricingService } from '../services/pricing.service';
import { PricingActions } from './pricing.actions';
import { selectPricingRows } from './pricing.selectors';
import { NotificationService } from '../../../core/services/notification.service';
import { UpsertPricingDto } from '../models/pricing.models';

export class PricingEffects {
  private actions$ = inject(Actions);
  private pricingService = inject(PricingService);
  private store = inject(Store);
  private notification = inject(NotificationService);

  loadAssignedRoutes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PricingActions.loadAssignedRoutes),
      switchMap(() =>
        this.pricingService.getMyAssignedRoutes().pipe(
          map(routes => PricingActions.loadAssignedRoutesSuccess({ routes })),
          catchError(error => of(PricingActions.loadAssignedRoutesFailure({
            error: error.error?.message ?? 'Failed to load assigned routes.'
          })))
        )
      )
    )
  );

  loadAssignedRoutesByOperator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PricingActions.loadAssignedRoutesByOperator),
      switchMap(({ tourOperatorId }) =>
        this.pricingService.getAssignedRoutesByOperator(tourOperatorId).pipe(
          map(routes => PricingActions.loadAssignedRoutesByOperatorSuccess({ routes })),
          catchError(error => of(PricingActions.loadAssignedRoutesByOperatorFailure({
            error: error.error?.message ?? 'Failed to load assigned routes.'
          })))
        )
      )
    )
  );

  loadPricingTable$ = createEffect(() =>
  this.actions$.pipe(
    ofType(PricingActions.loadPricingTable),
    switchMap(({ operatorSeasonRouteId }) =>
      this.pricingService.getPricingTable(operatorSeasonRouteId).pipe(
        map(data => PricingActions.loadPricingTableSuccess({ data })),
        catchError(error => of(PricingActions.loadPricingTableFailure({
          error: error.error?.message ?? 'Failed to load pricing table.'
        })))
      )
    )
  )
);

  upsertPricing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PricingActions.upsertPricing),
      withLatestFrom(this.store.select(selectPricingRows)),
      exhaustMap(([{ operatorSeasonRouteId }, rows]) => {
        const dto: UpsertPricingDto = {
          rows: rows.map(row => ({
            date: row.date,
            bookingClassPricings: row.bookingClassPricings.map(bcp => ({
              bookingClassId: bcp.bookingClassId,
              price: bcp.price,
              seatsRequested: bcp.seatsRequested
            }))
          }))
        };
        return this.pricingService.upsertPricing(operatorSeasonRouteId, dto).pipe(
          map(() => PricingActions.upsertPricingSuccess()),
          catchError(error => of(PricingActions.upsertPricingFailure({
            error: error.error?.message ?? 'Failed to save pricing.'
          })))
        );
      })
    )
  );

  upsertPricingSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PricingActions.upsertPricingSuccess),
      tap(() => this.notification.success('Pricing saved successfully.'))
    ),
    { dispatch: false }
  );

  failure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PricingActions.loadAssignedRoutesFailure,
        PricingActions.loadAssignedRoutesByOperatorFailure,
        PricingActions.loadPricingTableFailure,
        PricingActions.upsertPricingFailure
      ),
      tap(({ error }) => this.notification.error(error))
    ),
    { dispatch: false }
  );
}