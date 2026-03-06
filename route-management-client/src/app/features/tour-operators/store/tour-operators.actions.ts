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

    'Clear Selected Tour Operator': emptyProps()
  }
});