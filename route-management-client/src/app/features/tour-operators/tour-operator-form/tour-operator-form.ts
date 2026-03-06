import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TourOperatorDto } from '../models/tour-operator.models';
import { TourOperatorsActions } from '../store/tour-operators.actions';
import { selectSelectedTourOperator, selectTourOperatorsLoading } from '../store/tour-operators.selectors';

@Component({
  selector: 'app-tour-operator-form',
  templateUrl: './tour-operator-form.html',
  styleUrls: ['./tour-operator-form.scss'],
  standalone: false
})
export class TourOperatorForm implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading$!: Observable<boolean>;
  selectedTourOperator$!: Observable<TourOperatorDto | null>;
  isEditMode = false;
  operatorId: number | null = null;
  showPassword = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectTourOperatorsLoading);
    this.selectedTourOperator$ = this.store.select(selectSelectedTourOperator);

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.operatorId = +id;

      this.form = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(200)]],
        contactPerson: [null, Validators.maxLength(200)],
        contactEmail: [null, [Validators.email, Validators.maxLength(200)]],
        phoneNumber: [null, Validators.maxLength(50)]
      });

      this.store.dispatch(TourOperatorsActions.loadTourOperator({ id: this.operatorId }));

      this.selectedTourOperator$.pipe(takeUntil(this.destroy$)).subscribe(op => {
          if (op) {
            this.form.patchValue({
              name: op.name,
              contactPerson: op.contactPerson,
              contactEmail: op.contactEmail,
              phoneNumber: op.phoneNumber
            });
          }
        });
    } else {
      this.form = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(200)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        contactPerson: [null, Validators.maxLength(200)],
        contactEmail: [null, [Validators.email, Validators.maxLength(200)]],
        phoneNumber: [null, Validators.maxLength(50)]
      });
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(TourOperatorsActions.clearSelectedTourOperator());
    this.destroy$.next();
    this.destroy$.complete();
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get contactPerson() { return this.form.get('contactPerson'); }
  get contactEmail() { return this.form.get('contactEmail'); }
  get phoneNumber() { return this.form.get('phoneNumber'); }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const nullIfEmpty = (v: string | null) => v?.trim() || null;

    if (this.isEditMode && this.operatorId) {
      this.store.dispatch(TourOperatorsActions.updateTourOperator({
        id: this.operatorId,
        dto: {
          name: raw.name,
          contactPerson: nullIfEmpty(raw.contactPerson),
          contactEmail: nullIfEmpty(raw.contactEmail),
          phoneNumber: nullIfEmpty(raw.phoneNumber)
        }
      }));
    } else {
      this.store.dispatch(TourOperatorsActions.createTourOperator({
        dto: {
          name: raw.name,
          email: raw.email,
          password: raw.password,
          contactPerson: nullIfEmpty(raw.contactPerson),
          contactEmail: nullIfEmpty(raw.contactEmail),
          phoneNumber: nullIfEmpty(raw.phoneNumber)
        }
      }));
    }
  }

  onCancel(): void {
    window.history.back();
  }

}
