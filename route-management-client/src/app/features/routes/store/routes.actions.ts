import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RouteDto, RouteFormDto, BookingClassDto } from '../models/route.models';

export const RoutesActions = createActionGroup({
  source: 'Routes',
  events: {
    'Load Routes': emptyProps(),
    'Load Routes Success': props<{ routes: RouteDto[] }>(),
    'Load Routes Failure': props<{ error: string }>(),

    'Load Booking Classes': emptyProps(),
    'Load Booking Classes Success': props<{ bookingClasses: BookingClassDto[] }>(),
    'Load Booking Classes Failure': props<{ error: string }>(),

    'Load Route': props<{ id: number }>(),
    'Load Route Success': props<{ route: RouteDto }>(),
    'Load Route Failure': props<{ error: string }>(),

    'Create Route': props<{ dto: RouteFormDto }>(),
    'Create Route Success': props<{ route: RouteDto }>(),
    'Create Route Failure': props<{ error: string }>(),

    'Update Route': props<{ id: number; dto: RouteFormDto }>(),
    'Update Route Success': props<{ route: RouteDto }>(),
    'Update Route Failure': props<{ error: string }>(),

    'Delete Route': props<{ id: number }>(),
    'Delete Route Success': props<{ id: number }>(),
    'Delete Route Failure': props<{ error: string }>(),

    'Clear Selected Route': emptyProps(),
  }
});