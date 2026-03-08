import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, take, takeUntil } from 'rxjs';
import { AssignedSeasonRouteDto } from '../models/pricing.models';
import { TourOperatorDto } from '../../tour-operators/models/tour-operator.models';
import { PricingActions } from '../store/pricing.actions';
import { selectAssignedRoutes, selectAssignedRoutesLoading, selectSelectedTourOperatorId } from '../store/pricing.selectors';
import { selectIsAdmin } from '../../../store/auth/auth.selectors';
import { TourOperatorsActions } from '../../tour-operators/store/tour-operators.actions';
import { selectAllTourOperators } from '../../tour-operators/store/tour-operators.selectors';

@Component({
  selector: 'app-pricing-list',
  templateUrl: './pricing-list.html',
  styleUrls: ['./pricing-list.scss'],
  standalone: false
})
export class PricingList implements OnInit, OnDestroy {
  assignedRoutes$!: Observable<AssignedSeasonRouteDto[]>;
  isLoading$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;
  tourOperators$!: Observable<TourOperatorDto[]>;
  selectedOperatorId$!: Observable<number | null>;
  private destroy$ = new Subject<void>();

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.assignedRoutes$ = this.store.select(selectAssignedRoutes);
    this.isLoading$ = this.store.select(selectAssignedRoutesLoading);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.tourOperators$ = this.store.select(selectAllTourOperators);
    this.selectedOperatorId$ = this.store.select(selectSelectedTourOperatorId);

    this.isAdmin$.pipe(
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(isAdmin => {
      if (isAdmin) {
        this.store.dispatch(TourOperatorsActions.loadTourOperators());
        this.store.select(selectSelectedTourOperatorId).pipe(
          take(1),
          filter(id => id !== null),
          takeUntil(this.destroy$)
        ).subscribe(id => {
          this.store.dispatch(PricingActions.loadAssignedRoutesByOperator({ tourOperatorId: id! }));
        });
      } else {
        this.store.dispatch(PricingActions.loadAssignedRoutes());
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onOperatorChange(tourOperatorId: number): void {
    this.store.dispatch(PricingActions.setSelectedTourOperator({ tourOperatorId }));
    this.store.dispatch(PricingActions.loadAssignedRoutesByOperator({ tourOperatorId }));
  }

  onRowClick(row: AssignedSeasonRouteDto): void {
    this.router.navigate(['/pricing', row.operatorSeasonRouteId]);
  }
}