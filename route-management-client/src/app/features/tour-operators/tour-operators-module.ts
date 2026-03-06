import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../../shared/shared-module';
import { TourOperatorsRoutingModule } from './tour-operators-routing-module';
import { TourOperatorList } from './tour-operator-list/tour-operator-list';
import { TourOperatorForm } from './tour-operator-form/tour-operator-form';
import { TourOperatorProfile } from './tour-operator-profile/tour-operator-profile';
import { tourOperatorsReducer } from './store/tour-operators.reducer';
import { TourOperatorsEffects } from './store/tour-operators.effects';

@NgModule({
  declarations: [
    TourOperatorList,
    TourOperatorForm,
    TourOperatorProfile
  ],
  imports: [
    SharedModule,
    TourOperatorsRoutingModule,
    StoreModule.forFeature('tourOperators', tourOperatorsReducer),
    EffectsModule.forFeature([TourOperatorsEffects])
  ]
})
export class TourOperatorsModule {}