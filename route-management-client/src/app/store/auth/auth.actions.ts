import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse } from '../../core/models/auth.models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {

    'Login': props<{ request: LoginRequest }>(),
    'Login Success': props<{ response: AuthResponse }>(),
    'Login Failure': props<{ error: string }>(),

    'Register': props<{ request: RegisterRequest }>(),
    'Register Success': props<{ response: RegisterResponse }>(),
    'Register Failure': props<{ error: string }>(),

    'Logout': emptyProps(),
    'Restore Session': emptyProps(),
    'Restore Session Success': props<{ response: AuthResponse }>(),
  }
});