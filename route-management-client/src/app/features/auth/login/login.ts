import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { AuthActions } from '../../../store/auth/auth.actions';
import { selectIsLoading, selectError } from '../../../store/auth/auth.selectors';

@Component({
  selector:    'app-login',
  templateUrl: './login.html',
  styleUrls:   ['./login.scss'],
  standalone:  false
})
export class Login implements OnInit, OnDestroy {

  loginForm!:  FormGroup;
  isLoading$:  Observable<boolean>;
  error$:      Observable<string | null>;
  showPassword = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb:    FormBuilder,
    private store: Store
  ) {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$     = this.store.select(selectError);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get email()    { return this.loginForm.get('email');    }
  get password() { return this.loginForm.get('password'); }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(AuthActions.login({
      request: {
        email:    this.loginForm.value.email,
        password: this.loginForm.value.password
      }
    }));
  }
}