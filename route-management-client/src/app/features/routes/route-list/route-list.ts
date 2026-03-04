import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouteDto, BookingClassDto } from '../models/route.models';
import { RoutesActions } from '../store/routes.actions';
import { selectAllRoutes, selectRoutesLoading, selectAllBookingClasses } from '../store/routes.selectors';
import { selectIsAdmin } from '../../../store/auth/auth.selectors';

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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.routes$ = this.store.select(selectAllRoutes);
    this.bookingClasses$ = this.store.select(selectAllBookingClasses);
    this.isLoading$ = this.store.select(selectRoutesLoading);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    
    this.store.dispatch(RoutesActions.loadRoutes());
    this.store.dispatch(RoutesActions.loadBookingClasses());
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
}