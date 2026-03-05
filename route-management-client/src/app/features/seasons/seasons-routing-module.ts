import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeasonList } from './season-list/season-list';
import { SeasonForm } from './season-form/season-form';
import { RoleGuard } from '../../core/guards/role.guard';
import { Roles } from '../../core/constants/roles';

const routes: Routes = [
  { 
    path: '', 
    component: SeasonList 
  },
  { 
    path: 'new', 
    component: SeasonForm, 
    canActivate: [RoleGuard], 
    data: { roles: [Roles.Admin] } 
  },
  { 
    path: ':id/edit', 
    component: SeasonForm, 
    canActivate: [RoleGuard], 
    data: { roles: [Roles.Admin] } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeasonsRoutingModule {}