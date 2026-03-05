import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SeasonDto } from '../models/season.models';
import { SeasonsActions } from '../store/seasons.actions';
import { selectAllSeasons, selectSeasonsLoading } from '../store/seasons.selectors';
import { selectIsAdmin } from '../../../store/auth/auth.selectors';

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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.seasons$ = this.store.select(selectAllSeasons);
    this.isLoading$ = this.store.select(selectSeasonsLoading);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.store.dispatch(SeasonsActions.loadSeasons());
  }
}