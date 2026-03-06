import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TourOperatorDto } from '../models/tour-operator.models';
import { TourOperatorsActions } from '../store/tour-operators.actions';
import { selectSelectedTourOperator, selectTourOperatorsLoading } from '../store/tour-operators.selectors';

@Component({
  selector: 'app-tour-operator-profile',
  templateUrl: './tour-operator-profile.html',
  styleUrls: ['./tour-operator-profile.scss'],
  standalone: false
})
export class TourOperatorProfile implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading$!: Observable<boolean>;
  profile$!: Observable<TourOperatorDto | null>;
  profileId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectTourOperatorsLoading);
    this.profile$ = this.store.select(selectSelectedTourOperator);

    this.form = this.fb.group({
      contactPerson: [null, Validators.maxLength(200)],
      contactEmail: [null, [Validators.email, Validators.maxLength(200)]],
      phoneNumber: [null, Validators.maxLength(50)]
    });

    this.store.dispatch(TourOperatorsActions.loadMyProfile());

    this.profile$.pipe(takeUntil(this.destroy$)).subscribe(profile => {
      if (profile) {
        this.profileId = profile.id;
        this.form.patchValue({
          contactPerson: profile.contactPerson,
          contactEmail: profile.contactEmail,
          phoneNumber: profile.phoneNumber
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(TourOperatorsActions.clearSelectedTourOperator());
    this.destroy$.next();
    this.destroy$.complete();
  }

  get contactPerson() { return this.form.get('contactPerson'); }
  get contactEmail() { return this.form.get('contactEmail'); }
  get phoneNumber() { return this.form.get('phoneNumber'); }

  onSubmit(): void {
    if (this.form.invalid || !this.profileId) {
      this.form.markAllAsTouched();
      return;
    }

    const nullIfEmpty = (v: string | null) => v?.trim() || null;

    this.store.dispatch(TourOperatorsActions.updateMyProfile({
      id: this.profileId,
      dto: {
        contactPerson: nullIfEmpty(this.form.value.contactPerson),
        contactEmail: nullIfEmpty(this.form.value.contactEmail),
        phoneNumber: nullIfEmpty(this.form.value.phoneNumber)
      }
    }));
  }
}