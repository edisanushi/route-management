import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { LayoutModule } from '../layout/layout-module';
import { Dashboard } from './dashboard/dashboard';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    Dashboard
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LayoutModule,
    MatIconModule
  ]
})
export class DashboardModule {}