import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RoutesState, BookingClassesState } from '../models/route.models';

export const selectRoutesState = createFeatureSelector<RoutesState>('routes');
export const selectBookingClassesState = createFeatureSelector<BookingClassesState>('bookingClasses');

export const selectAllRoutes = createSelector(selectRoutesState, state => state.routes);
export const selectSelectedRoute = createSelector(selectRoutesState, state => state.selectedRoute);
export const selectRoutesLoading = createSelector(selectRoutesState, state => state.isLoading);
export const selectRoutesError = createSelector(selectRoutesState, state => state.error);

export const selectAllBookingClasses = createSelector(selectBookingClassesState, state => state.bookingClasses);
export const selectBookingClassesLoading = createSelector(selectBookingClassesState, state => state.isLoading);