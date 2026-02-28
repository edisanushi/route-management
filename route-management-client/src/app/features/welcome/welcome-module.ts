import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared-module';
import { WelcomeRoutingModule } from './welcome-routing-module';
import { Welcome } from './components/welcome/welcome';

@NgModule({
  declarations: [Welcome],
  imports: [SharedModule, WelcomeRoutingModule],
})
export class WelcomeModule {}
