import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { LayoutModule } from './features/layout/layout-module';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { tourOperatorsReducer } from './features/tour-operators/store/tour-operators.reducer';
import { TourOperatorsEffects } from './features/tour-operators/store/tour-operators.effects';
import { pricingReducer } from './features/pricing/store/pricing.reducer';
import { PricingEffects } from './features/pricing/store/pricing.effects';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    LayoutModule,
    StoreModule.forRoot({
      auth: authReducer
    }),
    StoreModule.forFeature('tourOperators', tourOperatorsReducer),
    StoreModule.forFeature('pricing', pricingReducer),
    EffectsModule.forRoot([AuthEffects]),
    EffectsModule.forFeature([TourOperatorsEffects]),
    EffectsModule.forFeature([PricingEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [App]
})
export class AppModule {}