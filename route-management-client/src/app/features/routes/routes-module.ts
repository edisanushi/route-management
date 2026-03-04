import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../../shared/shared-module';
import { RoutesRoutingModule } from './routes-routing-module';
import { RouteList } from './route-list/route-list';
import { RouteForm } from './route-form/route-form';
import { BookingClassNamePipe } from './pipes/booking-class-name.pipe';
import { routesReducer, bookingClassesReducer } from './store/routes.reducer';
import { RoutesEffects } from './store/routes.effects';

@NgModule({
  declarations: [
    RouteList,
    RouteForm,
    BookingClassNamePipe
  ],
  imports: [
    SharedModule,
    RoutesRoutingModule,
    StoreModule.forFeature('routes', routesReducer),
    StoreModule.forFeature('bookingClasses', bookingClassesReducer),
    EffectsModule.forFeature([RoutesEffects])
  ]
})
export class RoutesModule {}