import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricingList } from './pricing-list/pricing-list';
import { PricingTable } from './pricing-table/pricing-table';

const routes: Routes = [
  {
    path: '',
    component: PricingList
  },
  {
    path: ':id',
    component: PricingTable
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule {}
