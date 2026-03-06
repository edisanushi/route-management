import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TourOperatorList } from './tour-operator-list/tour-operator-list';
import { TourOperatorForm } from './tour-operator-form/tour-operator-form';
import { TourOperatorProfile } from './tour-operator-profile/tour-operator-profile';
import { RoleGuard } from '../../core/guards/role.guard';
import { Roles } from '../../core/constants/roles';

const routes: Routes = [
  {
    path: '',
    component: TourOperatorList,
    canActivate: [RoleGuard],
    data: { roles: [Roles.Admin] }
  },
  {
    path: 'new',
    component: TourOperatorForm,
    canActivate: [RoleGuard],
    data: { roles: [Roles.Admin] }
  },
  {
    path: ':id/edit',
    component: TourOperatorForm,
    canActivate: [RoleGuard],
    data: { roles: [Roles.Admin] }
  },
  {
    path: 'profile',
    component: TourOperatorProfile,
    canActivate: [RoleGuard],
    data: { roles: [Roles.TourOperatorMember] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourOperatorsRoutingModule {}