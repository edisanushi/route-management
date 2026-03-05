import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SeasonFormDto, SeasonDto } from '../models/season.models';

export const SeasonsActions = createActionGroup({
  source: 'Seasons',
  events: {
    'Create Season': props<{ dto: SeasonFormDto }>(),
    'Create Season Success': emptyProps(),
    'Create Season Failure': props<{ error: string }>(),
    'Load Seasons': emptyProps(),
    'Load Seasons Success': props<{ seasons: SeasonDto[] }>(),
    'Load Seasons Failure': props<{ error: string }>()
  }
});