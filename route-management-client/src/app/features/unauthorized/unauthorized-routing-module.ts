import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Unauthorized } from './unauthorized/unauthorized';

const routes: Routes = [
  { 
    path: '', 
    component: Unauthorized 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnauthorizedRoutingModule {}
