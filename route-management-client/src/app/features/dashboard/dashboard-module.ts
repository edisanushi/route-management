import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { LayoutModule } from '../layout/layout-module';
import { Dashboard } from './dashboard/dashboard';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    Dashboard
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    LayoutModule,
  ]
})
export class DashboardModule {}