import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SeasonsState } from '../models/season.models';

export const selectSeasonsState = createFeatureSelector<SeasonsState>('seasons');

export const selectSeasonsLoading = createSelector(selectSeasonsState, s => s.isLoading);
export const selectAllSeasons = createSelector(selectSeasonsState, s => s.seasons);
export const selectSeasonsError = createSelector(selectSeasonsState, s => s.error);