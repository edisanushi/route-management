import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../core/models/auth.models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser      = createSelector(selectAuthState, state => state.user);
export const selectToken     = createSelector(selectAuthState, state => state.token);
export const selectIsLoading = createSelector(selectAuthState, state => state.isLoading);
export const selectError     = createSelector(selectAuthState, state => state.error);

export const selectIsAuthenticated = createSelector(
  selectToken,
  selectUser,
  (token, user) => !!token && !!user
);

export const selectUserEmail = createSelector(
  selectUser,
  user => user?.email ?? null
);

export const selectUserRole = createSelector(
  selectUser,
  user => user?.role ?? null
);

export const selectIsAdmin = createSelector(
  selectUser,
  user => user?.role === 'Admin'
);

export const selectIsTourOperator = createSelector(
  selectUser,
  user => user?.role === 'TourOperatorMember'
);