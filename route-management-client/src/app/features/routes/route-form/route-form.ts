import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BookingClassDto, RouteDto } from '../models/route.models';
import { RoutesActions } from '../store/routes.actions';
import { selectAllBookingClasses, selectSelectedRoute, selectRoutesLoading } from '../store/routes.selectors';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.html',
  styleUrls: ['./route-form.scss'],
  standalone: false
})
export class RouteForm implements OnInit, OnDestroy {
  form!: FormGroup;
  bookingClasses$!: Observable<BookingClassDto[]>;
  isLoading$!: Observable<boolean>;
  selectedRoute$!: Observable<RouteDto | null>;
  isEditMode = false;
  routeId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.bookingClasses$ = this.store.select(selectAllBookingClasses);
    this.isLoading$ = this.store.select(selectRoutesLoading);
    this.selectedRoute$ = this.store.select(selectSelectedRoute);
    
    this.form = this.fb.group({
      origin: ['', [Validators.required, Validators.maxLength(200)]],
      destination: ['', [Validators.required, Validators.maxLength(200)]],
      bookingClassIds: [[], [Validators.required, Validators.minLength(1)]]
    });

    this.store.dispatch(RoutesActions.loadBookingClasses());

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.routeId = +id;
      this.store.dispatch(RoutesActions.loadRoute({ id: this.routeId }));

      this.selectedRoute$.pipe(takeUntil(this.destroy$)).subscribe(route => {
        if (route) {
          this.form.patchValue({
            origin: route.origin,
            destination: route.destination,
            bookingClassIds: route.bookingClassIds
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(RoutesActions.clearSelectedRoute());
    this.destroy$.next();
    this.destroy$.complete();
  }

  get origin() { return this.form.get('origin'); }
  get destination() { return this.form.get('destination'); }
  get bookingClassIds() { return this.form.get('bookingClassIds'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.value;
    if (this.isEditMode && this.routeId) {
      this.store.dispatch(RoutesActions.updateRoute({ id: this.routeId, dto }));
    } else {
      this.store.dispatch(RoutesActions.createRoute({ dto }));
    }
  }

  onCancel(): void {
    window.history.back();
  }
}