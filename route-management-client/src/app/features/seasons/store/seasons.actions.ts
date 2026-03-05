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
    'Load Seasons Failure': props<{ error: string }>(),

    'Load Season': props<{ id: number }>(),
    'Load Season Success': props<{ season: SeasonDto }>(),
    'Load Season Failure': props<{ error: string }>(),

    'Update Season': props<{ id: number; dto: SeasonFormDto }>(),
    'Update Season Success': props<{ season: SeasonDto }>(),
    'Update Season Failure': props<{ error: string }>(),

    'Delete Season': props<{ id: number }>(),
    'Delete Season Success': props<{ id: number }>(),
    'Delete Season Failure': props<{ error: string }>(),

    'Clear Selected Season': emptyProps()
  }
});