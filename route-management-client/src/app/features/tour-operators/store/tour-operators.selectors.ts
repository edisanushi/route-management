import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TourOperatorsState } from '../models/tour-operator.models';

export const selectTourOperatorsState = createFeatureSelector<TourOperatorsState>('tourOperators');

export const selectAllTourOperators = createSelector(selectTourOperatorsState, s => s.tourOperators);
export const selectSelectedTourOperator = createSelector(selectTourOperatorsState, s => s.selectedTourOperator);
export const selectTourOperatorsLoading = createSelector(selectTourOperatorsState, s => s.isLoading);
export const selectTourOperatorsError = createSelector(selectTourOperatorsState, s => s.error);