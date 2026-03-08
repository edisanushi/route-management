import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { Shell } from './features/layout/shell/shell';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-module')
        .then(m => m.AuthModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () =>
      import('./features/unauthorized/unauthorized-module')
        .then(m => m.UnauthorizedModule)
  },
  {
    path: '',
    component: Shell,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard-module')
            .then(m => m.DashboardModule)
      },
      {
        path: 'routes',
        loadChildren: () =>
          import('./features/routes/routes-module')
            .then(m => m.RoutesModule)
      },
      {
        path: 'seasons',
        loadChildren: () =>
          import('./features/seasons/seasons-module')
            .then(m => m.SeasonsModule)
      },
      {
        path: 'tour-operators',
        loadChildren: () =>
          import('./features/tour-operators/tour-operators-module')
            .then(m => m.TourOperatorsModule)
      },
      {
        path: 'pricing',
        loadChildren: () =>
          import('./features/pricing/pricing-module')
            .then(m => m.PricingModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
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