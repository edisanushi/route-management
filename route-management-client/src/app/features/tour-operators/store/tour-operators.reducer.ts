import { createReducer, on } from '@ngrx/store';
import { TourOperatorsActions } from './tour-operators.actions';
import { TourOperatorsState } from '../models/tour-operator.models';

const initialState: TourOperatorsState = {
  tourOperators: [],
  selectedTourOperator: null,
  isLoading: false,
  error: null
};

export const tourOperatorsReducer = createReducer(
  initialState,

  on(TourOperatorsActions.loadTourOperators, state => ({ ...state, isLoading: true, error: null })),
  on(TourOperatorsActions.loadTourOperatorsSuccess, (state, { tourOperators }) => ({ ...state, isLoading: false, tourOperators })),
  on(TourOperatorsActions.loadTourOperatorsFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(TourOperatorsActions.loadTourOperator, state => ({ ...state, isLoading: true, error: null })),
  on(TourOperatorsActions.loadTourOperatorSuccess, (state, { tourOperator }) => ({ ...state, isLoading: false, selectedTourOperator: tourOperator })),
  on(TourOperatorsActions.loadTourOperatorFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(TourOperatorsActions.loadMyProfile, state => ({ ...state, isLoading: true, error: null })),
  on(TourOperatorsActions.loadMyProfileSuccess, (state, { tourOperator }) => ({ ...state, isLoading: false, selectedTourOperator: tourOperator })),
  on(TourOperatorsActions.loadMyProfileFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(TourOperatorsActions.createTourOperator, state => ({ ...state, isLoading: true, error: null })),
  on(TourOperatorsActions.createTourOperatorSuccess, (state, { tourOperator }) => ({
    ...state,
    isLoading: false,
    tourOperators: [...state.tourOperators, tourOperator]
  })),
  on(TourOperatorsActions.createTourOperatorFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(TourOperatorsActions.updateTourOperator, state => ({ ...state, isLoading: true, error: null })),
  on(TourOperatorsActions.updateTourOperatorSuccess, (state, { tourOperator }) => ({
    ...state,
    isLoading: false,
    tourOperators: state.tourOperators.map(t => t.id === tourOperator.id ? tourOperator : t),
    selectedTourOperator: tourOperator
  })),
  on(TourOperatorsActions.updateTourOperatorFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(TourOperatorsActions.updateMyProfile, state => ({ ...state, isLoading: true, error: null })),
  on(TourOperatorsActions.updateMyProfileSuccess, (state, { tourOperator }) => ({
    ...state,
    isLoading: false,
    selectedTourOperator: tourOperator
  })),
  on(TourOperatorsActions.updateMyProfileFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(TourOperatorsActions.deleteTourOperatorSuccess, (state, { id }) => ({
    ...state,
    tourOperators: state.tourOperators.filter(t => t.id !== id)
  })),
  on(TourOperatorsActions.deleteTourOperatorFailure, (state, { error }) => ({ ...state, error })),

  on(TourOperatorsActions.clearSelectedTourOperator, state => ({
    ...state,
    selectedTourOperator: null,
    isLoading: false
  })),
);