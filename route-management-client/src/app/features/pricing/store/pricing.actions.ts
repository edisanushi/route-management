import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AssignedSeasonRouteDto, BulkFillScope, PricingTableDto } from '../models/pricing.models';

export const PricingActions = createActionGroup({
  source: 'Pricing',
  events: {
    'Load Assigned Routes': emptyProps(),
    'Load Assigned Routes Success': props<{ routes: AssignedSeasonRouteDto[] }>(),
    'Load Assigned Routes Failure': props<{ error: string }>(),

    'Load Assigned Routes By Operator': props<{ tourOperatorId: number }>(),
    'Load Assigned Routes By Operator Success': props<{ routes: AssignedSeasonRouteDto[] }>(),
    'Load Assigned Routes By Operator Failure': props<{ error: string }>(),

    'Load Pricing Table': props<{ operatorSeasonRouteId: number }>(),
    'Load Pricing Table Success': props<{ data: PricingTableDto }>(),
    'Load Pricing Table Failure': props<{ error: string }>(),

    'Upsert Pricing': props<{ operatorSeasonRouteId: number }>(),
    'Upsert Pricing Success': emptyProps(),
    'Upsert Pricing Failure': props<{ error: string }>(),

    'Apply Bulk Fill': props<{
      scope: BulkFillScope;
      bookingClassId: number;
      price: number;
      seatsRequested: number;
      fromDate?: string;
      toDate?: string;
      daysOfWeek?: string[];
    }>(),

    'Update Cell': props<{
      date: string;
      bookingClassId: number;
      field: 'price' | 'seatsRequested';
      value: number;
    }>(),

    'Clear Pricing Table': emptyProps(),
    'Set Selected Tour Operator': props<{ tourOperatorId: number | null }>()
  }
});