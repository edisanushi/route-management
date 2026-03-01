import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserRole } from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const expectedRoles = route.data['roles'] as string[];

    return this.store.select(selectUserRole).pipe(
      take(1),
      map(userRole => {
        if (userRole && expectedRoles.includes(userRole)) {
          return true;
        }

        return this.router.createUrlTree(['/unauthorized']);
      })
    );
  }
}