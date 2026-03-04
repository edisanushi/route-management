import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteList } from './route-list/route-list';
import { RouteForm } from './route-form/route-form';
import { RoleGuard } from '../../core/guards/role.guard';
import { Roles } from '../../core/constants/roles';

const routes: Routes = [
  { path: '', component: RouteList },
  {
    path: 'new',
    component: RouteForm,
    canActivate: [RoleGuard],
    data: { roles: [Roles.Admin] }
  },
  {
    path: ':id/edit',
    component: RouteForm,
    canActivate: [RoleGuard],
    data: { roles: [Roles.Admin] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutesRoutingModule {}