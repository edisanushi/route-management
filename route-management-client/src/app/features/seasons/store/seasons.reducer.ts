import { createReducer, on } from '@ngrx/store';
import { SeasonsActions } from './seasons.actions';
import { SeasonsState } from '../models/season.models';

const initialState: SeasonsState = {
  isLoading: false,
  error: null,
  seasons: [],
  selectedSeason: null
};

export const seasonsReducer = createReducer(
  initialState,
  on(SeasonsActions.createSeason, state => ({ ...state, isLoading: true, error: null })),
  on(SeasonsActions.createSeasonSuccess, state => ({ ...state, isLoading: false })),
  on(SeasonsActions.createSeasonFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(SeasonsActions.loadSeasons, state => ({ ...state, isLoading: true, error: null })),
  on(SeasonsActions.loadSeasonsSuccess, (state, { seasons }) => ({ ...state, isLoading: false, seasons })),
  on(SeasonsActions.loadSeasonsFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(SeasonsActions.loadSeason, state => ({ ...state, isLoading: true, error: null })),
  on(SeasonsActions.loadSeasonSuccess, (state, { season }) => ({ ...state, isLoading: false, selectedSeason: season })),
  on(SeasonsActions.loadSeasonFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(SeasonsActions.updateSeasonSuccess, (state, { season }) => ({
    ...state,
    seasons: state.seasons.map(s => s.id === season.id ? season : s),
    selectedSeason: season
  })),
  on(SeasonsActions.updateSeasonFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(SeasonsActions.deleteSeasonSuccess, (state, { id }) => ({
    ...state,
    seasons: state.seasons.filter(s => s.id !== id)
  })),
  on(SeasonsActions.deleteSeasonFailure, (state, { error }) => ({ ...state, error })),

  on(SeasonsActions.clearSelectedSeason, state => ({ ...state, selectedSeason: null }))
);