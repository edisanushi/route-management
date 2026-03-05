import { createReducer, on } from '@ngrx/store';
import { SeasonsActions } from './seasons.actions';
import { SeasonsState, SeasonDto } from '../models/season.models';

const initialState: SeasonsState = {
  isLoading: false,
  error: null,
  seasons: []
};

export const seasonsReducer = createReducer(
  initialState,
  on(SeasonsActions.createSeason, state => ({ ...state, isLoading: true, error: null })),
  on(SeasonsActions.createSeasonSuccess, state => ({ ...state, isLoading: false })),
  on(SeasonsActions.createSeasonFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
  on(SeasonsActions.loadSeasons, state => ({ ...state, isLoading: true, error: null })),
  on(SeasonsActions.loadSeasonsSuccess, (state, { seasons }) => ({ ...state, isLoading: false, seasons })),
  on(SeasonsActions.loadSeasonsFailure, (state, { error }) => ({ ...state, isLoading: false, error }))
);