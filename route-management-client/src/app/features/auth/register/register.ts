import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthActions } from '../../../store/auth/auth.actions';
import {
  selectIsLoading,
  selectError
} from '../../../store/auth/auth.selectors';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: false
})
export class Register implements OnInit, OnDestroy {

  registerForm!: FormGroup;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  showPassword = false;
  showConfirmPassword = false;
  successMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions
  ) {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, 
    { 
      validators: this.passwordMatchValidator 
    });


    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      takeUntil(this.destroy$)
    ).subscribe(({ response }) => {
      this.successMessage = `User ${response.email} registered successfully.`;
      this.registerForm.reset();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  get passwordMismatch(): boolean {
    return this.registerForm.hasError('passwordMismatch') &&
           (this.confirmPassword?.touched ?? false);
  }

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }

  onSubmit(): void {
    this.successMessage = null;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(AuthActions.register({
      request: {
        email: this.registerForm.value.email,
        password:this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword
      }
    }));
  }

  private passwordMatchValidator(
    group: FormGroup
  ): { passwordMismatch: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}