import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { PricingRoutingModule } from './pricing-routing-module';
import { PricingList } from './pricing-list/pricing-list';
import { PricingTable } from './pricing-table/pricing-table';

@NgModule({
  declarations: [
    PricingList,
    PricingTable
  ],
  imports: [
    SharedModule,
    FormsModule,
    ScrollingModule,
    PricingRoutingModule
  ]
})
export class PricingModule {}