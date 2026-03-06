import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TourOperatorDto } from '../models/tour-operator.models';
import { TourOperatorsActions } from '../store/tour-operators.actions';
import { selectAllTourOperators, selectTourOperatorsLoading } from '../store/tour-operators.selectors';

@Component({
  selector: 'app-tour-operator-list',
  templateUrl: './tour-operator-list.html',
  styleUrls: ['./tour-operator-list.scss'],
  standalone: false
})
export class TourOperatorList implements OnInit {
  tourOperators$!: Observable<TourOperatorDto[]>;
  isLoading$!: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.tourOperators$ = this.store.select(selectAllTourOperators);
    this.isLoading$ = this.store.select(selectTourOperatorsLoading);
    this.store.dispatch(TourOperatorsActions.loadTourOperators());
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this tour operator?')) {
      this.store.dispatch(TourOperatorsActions.deleteTourOperator({ id }));
    }
  }
}