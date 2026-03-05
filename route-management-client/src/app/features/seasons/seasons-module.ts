import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { SharedModule } from '../../shared/shared-module';
import { SeasonsRoutingModule } from './seasons-routing-module';
import { SeasonList } from './season-list/season-list';
import { SeasonForm } from './season-form/season-form';
import { seasonsReducer } from './store/seasons.reducer';
import { SeasonsEffects } from './store/seasons.effects';

export const SEASON_DATE_FORMATS = {
  parse: { dateInput: 'DD MMM YYYY' },
  display: {
    dateInput: { year: 'numeric', month: 'short', day: 'numeric' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@NgModule({
  declarations: [SeasonList, SeasonForm],
  imports: [
    SharedModule,
    SeasonsRoutingModule,
    StoreModule.forFeature('seasons', seasonsReducer),
    EffectsModule.forFeature([SeasonsEffects])
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: SEASON_DATE_FORMATS }
  ]
})
export class SeasonsModule {}