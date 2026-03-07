import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, take } from 'rxjs';
import { SeasonDto } from '../models/season.models';
import { SeasonsActions } from '../store/seasons.actions';
import { selectAllSeasons, selectSeasonsLoading } from '../store/seasons.selectors';
import { selectIsAdmin, selectIsTourOperator } from '../../../store/auth/auth.selectors';
import { TourOperatorsActions } from '../../tour-operators/store/tour-operators.actions';
import { selectSelectedTourOperator } from '../../tour-operators/store/tour-operators.selectors';
import { MatDialog } from '@angular/material/dialog';
import { AssignRoutesDialog } from '../../tour-operators/assign-routes-dialog/assign-routes-dialog';

@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.html',
  styleUrls: ['./season-list.scss'],
  standalone: false
})
export class SeasonList implements OnInit {
  seasons$!: Observable<SeasonDto[]>;
  isLoading$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;
  isTourOperator$!: Observable<boolean>;

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.seasons$ = this.store.select(selectAllSeasons);
    this.isLoading$ = this.store.select(selectSeasonsLoading);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.isTourOperator$ = this.store.select(selectIsTourOperator);

    this.store.dispatch(SeasonsActions.loadSeasons());

    this.isTourOperator$.pipe(filter(v => v), take(1)).subscribe(() => {
      this.store.dispatch(TourOperatorsActions.loadMyProfile());
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this season?')) {
      this.store.dispatch(SeasonsActions.deleteSeason({ id }));
    }
  }

  onAssignRoutes(season: SeasonDto): void {
    this.store.select(selectSelectedTourOperator).pipe(filter(p => !!p), take(1)).subscribe(p => {
      this.dialog.open(AssignRoutesDialog, {
        data: {
          operatorId: p!.id,
          seasonId: season.id,
          seasonName: `${season.seasonTypeName} ${season.year}`
        },
        panelClass: 'dark-dialog'
      });
    });
  }
}
