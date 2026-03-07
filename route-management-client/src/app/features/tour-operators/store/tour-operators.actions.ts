import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TourOperatorDto, TourOperatorFormDto, TourOperatorUpdateDto, TourOperatorProfileDto } from '../models/tour-operator.models';

export const TourOperatorsActions = createActionGroup({
  source: 'TourOperators',
  events: {
    'Load Tour Operators': emptyProps(),
    'Load Tour Operators Success': props<{ tourOperators: TourOperatorDto[] }>(),
    'Load Tour Operators Failure': props<{ error: string }>(),

    'Load Tour Operator': props<{ id: number }>(),
    'Load Tour Operator Success': props<{ tourOperator: TourOperatorDto }>(),
    'Load Tour Operator Failure': props<{ error: string }>(),

    'Load My Profile': emptyProps(),
    'Load My Profile Success': props<{ tourOperator: TourOperatorDto }>(),
    'Load My Profile Failure': props<{ error: string }>(),

    'Create Tour Operator': props<{ dto: TourOperatorFormDto }>(),
    'Create Tour Operator Success': props<{ tourOperator: TourOperatorDto }>(),
    'Create Tour Operator Failure': props<{ error: string }>(),

    'Update Tour Operator': props<{ id: number; dto: TourOperatorUpdateDto }>(),
    'Update Tour Operator Success': props<{ tourOperator: TourOperatorDto }>(),
    'Update Tour Operator Failure': props<{ error: string }>(),

    'Update My Profile': props<{ id: number; dto: TourOperatorProfileDto }>(),
    'Update My Profile Success': props<{ tourOperator: TourOperatorDto }>(),
    'Update My Profile Failure': props<{ error: string }>(),

    'Delete Tour Operator': props<{ id: number }>(),
    'Delete Tour Operator Success': props<{ id: number }>(),
    'Delete Tour Operator Failure': props<{ error: string }>(),

    'Clear Selected Tour Operator': emptyProps(),

    'Load Booking Class Ids': props<{ id: number }>(),
    'Load Booking Class Ids Success': props<{ bookingClassIds: number[] }>(),
    'Load Booking Class Ids Failure': props<{ error: string }>(),

    'Update Booking Classes': props<{ id: number; bookingClassIds: number[] }>(),
    'Update Booking Classes Success': emptyProps(),
    'Update Booking Classes Failure': props<{ error: string }>(),

    'Load Season Route Ids': props<{ id: number; seasonId: number }>(),
    'Load Season Route Ids Success': props<{ routeIds: number[] }>(),
    'Load Season Route Ids Failure': props<{ error: string }>(),

    'Update Season Routes': props<{ id: number; seasonId: number; routeIds: number[] }>(),
    'Update Season Routes Success': emptyProps(),
    'Update Season Routes Failure': props<{ error: string }>(),

    'Load Route Season Ids': props<{ id: number; routeId: number }>(),
    'Load Route Season Ids Success': props<{ seasonIds: number[] }>(),
    'Load Route Season Ids Failure': props<{ error: string }>(),

    'Update Route Seasons': props<{ id: number; routeId: number; seasonIds: number[] }>(),
    'Update Route Seasons Success': emptyProps(),
    'Update Route Seasons Failure': props<{ error: string }>(),

    'Reset Assignment State': emptyProps(),
  }
});
