import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-module')
        .then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard-module')
        .then(m => m.DashboardModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () =>
      import('./features/unauthorized/unauthorized-module')
        .then(m => m.UnauthorizedModule)
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch:  'full'
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
