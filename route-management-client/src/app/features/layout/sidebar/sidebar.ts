import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsAdmin, selectIsTourOperator } from '../../../store/auth/auth.selectors';

interface NavItem {
  label: string;
  icon:  string;
  route: string;
}

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Routes', icon: 'alt_route', route: '/routes' },
  { label: 'Seasons', icon: 'event', route: '/seasons' },
  { label: 'Tour Operators', icon: 'business', route: '/tour-operators' },
  { label: 'Pricing', icon: 'payments', route: '/pricing' },
];

const OPERATOR_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'My Profile', icon: 'manage_accounts', route: '/tour-operators/profile' },
  { label: 'Routes', icon: 'alt_route', route: '/routes' },
  { label: 'Seasons', icon: 'event', route: '/seasons' },
  { label: 'Pricing', icon: 'payments', route: '/pricing' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  standalone: false
})
export class Sidebar implements OnInit {
  isAdmin$!: Observable<boolean>;
  isTourOperator$!: Observable<boolean>;

  adminNav = ADMIN_NAV;
  operatorNav = OPERATOR_NAV;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.isTourOperator$ = this.store.select(selectIsTourOperator);
  }
}
