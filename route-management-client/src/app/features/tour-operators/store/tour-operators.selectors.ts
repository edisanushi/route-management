import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TourOperatorsState } from '../models/tour-operator.models';

export const selectTourOperatorsState = createFeatureSelector<TourOperatorsState>('tourOperators');

export const selectAllTourOperators = createSelector(selectTourOperatorsState, s => s.tourOperators);
export const selectSelectedTourOperator = createSelector(selectTourOperatorsState, s => s.selectedTourOperator);
export const selectTourOperatorsLoading = createSelector(selectTourOperatorsState, s => s.isLoading);
export const selectTourOperatorsError = createSelector(selectTourOperatorsState, s => s.error);

export const selectBookingClassIds = createSelector(selectTourOperatorsState, s => s.bookingClassIds);
export const selectBookingClassesLoading = createSelector(selectTourOperatorsState, s => s.bookingClassesLoading);

export const selectSeasonRouteIds = createSelector(selectTourOperatorsState, s => s.seasonRouteIds);
export const selectSeasonRoutesLoading = createSelector(selectTourOperatorsState, s => s.seasonRoutesLoading);

export const selectRouteSeasonIds = createSelector(selectTourOperatorsState, s => s.routeSeasonIds);
export const selectRouteSeasonsLoading = createSelector(selectTourOperatorsState, s => s.routeSeasonsLoading);
