import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { TourOperatorsRoutingModule } from './tour-operators-routing-module';
import { TourOperatorList } from './tour-operator-list/tour-operator-list';
import { TourOperatorForm } from './tour-operator-form/tour-operator-form';
import { TourOperatorProfile } from './tour-operator-profile/tour-operator-profile';

@NgModule({
  declarations: [
    TourOperatorList,
    TourOperatorForm,
    TourOperatorProfile
  ],
  imports: [
    SharedModule,
    TourOperatorsRoutingModule,
  ]
})
export class TourOperatorsModule {}
