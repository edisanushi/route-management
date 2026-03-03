import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { Roles } from '../../core/constants/roles';

const routes: Routes = [
  { 
    path: 'login',    
    component: Login    
  },
  {
    path: 'register',
    component: Register,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Roles.Admin] }
  },
  { 
    path: '',         
    redirectTo: 'login', 
    pathMatch: 'full' 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}