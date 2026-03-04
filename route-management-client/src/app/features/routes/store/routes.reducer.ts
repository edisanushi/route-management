import { createReducer, on } from '@ngrx/store';
import { RoutesActions } from './routes.actions';
import { RoutesState, BookingClassesState } from '../models/route.models';

export interface RoutesFeatureState {
  routes: RoutesState;
  bookingClasses: BookingClassesState;
}

const initialRoutesState: RoutesState = {
  routes: [],
  selectedRoute: null,
  isLoading: false,
  error: null
};

const initialBookingClassesState: BookingClassesState = {
  bookingClasses: [],
  isLoading: false,
  error: null
};

export const routesReducer = createReducer(
  initialRoutesState,
  on(RoutesActions.loadRoutes, state => ({ ...state, isLoading: true, error: null })),
  on(RoutesActions.loadRoutesSuccess, (state, { routes }) => ({ ...state, isLoading: false, routes })),
  on(RoutesActions.loadRoutesFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(RoutesActions.loadRoute, state => ({ ...state, isLoading: true, error: null })),
  on(RoutesActions.loadRouteSuccess, (state, { route }) => ({ ...state, isLoading: false, selectedRoute: route })),
  on(RoutesActions.loadRouteFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(RoutesActions.createRouteSuccess, (state, { route }) => ({
    ...state,
    routes: [...state.routes, route]
  })),

  on(RoutesActions.updateRouteSuccess, (state, { route }) => ({
    ...state,
    routes: state.routes.map(r => r.id === route.id ? route : r),
    selectedRoute: route
  })),

  on(RoutesActions.deleteRouteSuccess, (state, { id }) => ({
    ...state,
    routes: state.routes.filter(r => r.id !== id)
  })),

  on(RoutesActions.clearSelectedRoute, state => ({ ...state, selectedRoute: null }))
);

export const bookingClassesReducer = createReducer(
  initialBookingClassesState,
  on(RoutesActions.loadBookingClasses, state => ({ ...state, isLoading: true, error: null })),
  on(RoutesActions.loadBookingClassesSuccess, (state, { bookingClasses }) => ({ ...state, isLoading: false, bookingClasses })),
  on(RoutesActions.loadBookingClassesFailure, (state, { error }) => ({ ...state, isLoading: false, error }))
);