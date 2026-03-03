import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Unauthorized } from './unauthorized/unauthorized';
import { UnauthorizedRoutingModule } from './unauthorized-routing-module';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    Unauthorized
  ],
  imports: [
    SharedModule,
    RouterModule,
    UnauthorizedRoutingModule
  ]
})
export class UnauthorizedModule {}