import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable, filter, take } from 'rxjs';
import { RouteDto, BookingClassDto } from '../models/route.models';
import { RoutesActions } from '../store/routes.actions';
import { selectAllRoutes, selectRoutesLoading, selectAllBookingClasses } from '../store/routes.selectors';
import { selectIsAdmin, selectIsTourOperator } from '../../../store/auth/auth.selectors';
import { TourOperatorsActions } from '../../tour-operators/store/tour-operators.actions';
import { selectSelectedTourOperator } from '../../tour-operators/store/tour-operators.selectors';
import { AssignSeasonsDialog } from '../../tour-operators/assign-seasons-dialog/assign-seasons-dialog';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.html',
  styleUrls: ['./route-list.scss'],
  standalone: false
})
export class RouteList implements OnInit {
  routes$!: Observable<RouteDto[]>;
  bookingClasses$!: Observable<BookingClassDto[]>;
  isLoading$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;
  isTourOperator$!: Observable<boolean>;

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.routes$ = this.store.select(selectAllRoutes);
    this.bookingClasses$ = this.store.select(selectAllBookingClasses);
    this.isLoading$ = this.store.select(selectRoutesLoading);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.isTourOperator$ = this.store.select(selectIsTourOperator);

    this.store.dispatch(RoutesActions.loadRoutes());
    this.store.dispatch(RoutesActions.loadBookingClasses());

    this.isTourOperator$.pipe(filter(v => v), take(1)).subscribe(() => {
      this.store.dispatch(TourOperatorsActions.loadMyProfile());
    });
  }

  getBookingClassNames(ids: number[], bookingClasses: BookingClassDto[]): string {
    return ids
      .map(id => bookingClasses.find(bc => bc.id === id)?.name ?? '')
      .filter(Boolean)
      .join(', ');
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this route?')) {
      this.store.dispatch(RoutesActions.deleteRoute({ id }));
    }
  }

  onAssignSeasons(route: RouteDto): void {
    this.store.select(selectSelectedTourOperator).pipe(filter(p => !!p), take(1)).subscribe(p => {
      this.dialog.open(AssignSeasonsDialog, {
        data: {
          operatorId: p!.id,
          routeId: route.id,
          routeName: `${route.origin} → ${route.destination}`
        },
        panelClass: 'dark-dialog'
      });
    });
  }
}