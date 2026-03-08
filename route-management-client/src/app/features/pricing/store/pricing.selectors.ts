import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PricingState } from '../models/pricing.models';

export const selectPricingState = createFeatureSelector<PricingState>('pricing');

export const selectAssignedRoutes = createSelector(selectPricingState, state => state.assignedRoutes);
export const selectAssignedRoutesLoading = createSelector(selectPricingState, state => state.assignedRoutesLoading);
export const selectPricingRows = createSelector(selectPricingState, state => state.rows);
export const selectTableLoading = createSelector(selectPricingState, state => state.tableLoading);
export const selectSaving = createSelector(selectPricingState, state => state.saving);
export const selectPricingError = createSelector(selectPricingState, state => state.error);
export const selectPricingTitle = createSelector(
  selectPricingState,
  s => s.origin && s.destination
    ? `${s.origin} → ${s.destination} · ${s.seasonName}`
    : ''
);
export const selectSelectedTourOperatorId = createSelector(
  selectPricingState,
  s => s.selectedTourOperatorId
);