import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../core/models/auth.models';
import { AuthActions } from './auth.actions';

export const initialState: AuthState = {
  user:      null,
  token:     null,
  isLoading: false,
  error:     null
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, state => ({
    ...state,
    isLoading: true,
    error:     null
  })),

  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    error:     null,
    token:     response.token,
    user: {
      email:     response.email,
      role:      response.role,
      expiresAt: response.expiresAt
    }
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(AuthActions.register, state => ({
    ...state,
    isLoading: true,
    error:     null
  })),

  on(AuthActions.registerSuccess, state => ({
    ...state,
    isLoading: false,
    error:     null
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(AuthActions.logout, () => ({
    ...initialState
  })),

  on(AuthActions.restoreSession, state => ({
    ...state,
    isLoading: true
  })),

  on(AuthActions.restoreSessionSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    error: null,
    token: response.token,
    user: {
      email: response.email,
      role: response.role,
      expiresAt: response.expiresAt
    }
  }))
);