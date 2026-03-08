import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, filter, take } from 'rxjs';
import { PricingRowDto, BulkFillScope } from '../models/pricing.models';
import { PricingActions } from '../store/pricing.actions';
import { selectPricingRows, selectTableLoading, selectSaving, selectPricingTitle } from '../store/pricing.selectors';
import { selectIsAdmin } from '../../../store/auth/auth.selectors';
import { NotificationService } from '../../../core/services/notification.service';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

@Component({
  selector: 'app-pricing-table',
  templateUrl: './pricing-table.html',
  styleUrls: ['./pricing-table.scss'],
  standalone: false
})
export class PricingTable implements OnInit, OnDestroy {
  rows$!: Observable<PricingRowDto[]>;
  isLoading$!: Observable<boolean>;
  saving$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;

  operatorSeasonRouteId!: number;
  pageTitle$!: Observable<string>;
  bookingClassColumns: { id: number; name: string }[] = [];
  daysOfWeek = DAYS_OF_WEEK;
  selectedDays: string[] = [];

  bulkScope: BulkFillScope = 'all';
  bulkBookingClassId: number | null = null;
  bulkPrice: number | null = null;
  bulkSeats: number | null = null;
  bulkFromDate: Date | null = null;
  bulkToDate: Date | null = null;
  seasonStartDate: Date | null = null;
  seasonEndDate: Date | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.pageTitle$ = this.store.select(selectPricingTitle);
    this.operatorSeasonRouteId = +this.route.snapshot.paramMap.get('id')!;
    this.rows$ = this.store.select(selectPricingRows);
    this.isLoading$ = this.store.select(selectTableLoading);
    this.saving$ = this.store.select(selectSaving);
    this.isAdmin$ = this.store.select(selectIsAdmin);

    this.rows$.pipe(
      filter(rows => rows.length > 0),
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(rows => {
      this.bookingClassColumns = rows[0].bookingClassPricings.map(bcp => ({
        id: bcp.bookingClassId,
        name: bcp.bookingClassName
      }));
      this.seasonStartDate = new Date(rows[0].date);
      this.seasonEndDate = new Date(rows[rows.length - 1].date);
    });

    this.store.dispatch(PricingActions.loadPricingTable({ operatorSeasonRouteId: this.operatorSeasonRouteId }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(PricingActions.clearPricingTable());
    this.destroy$.next();
    this.destroy$.complete();
  }

  get gridTemplate(): string {
    const bcCols = this.bookingClassColumns.map(() => '1fr 1fr').join(' ');
    return `110px 100px ${bcCols}`;
  }

  onBack(): void {
    this.router.navigate(['/pricing']);
  }

  onCellChange(date: string, bookingClassId: number, field: 'price' | 'seatsRequested', value: string): void {
    const num = parseFloat(value) || 0;
    this.store.dispatch(PricingActions.updateCell({ date, bookingClassId, field, value: num }));
  }

  toggleDay(day: string): void {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    } else {
      this.selectedDays = [...this.selectedDays, day];
    }
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.includes(day);
  }

  onApplyBulkFill(): void {
    if (this.bulkBookingClassId === null) return;
    this.store.dispatch(PricingActions.applyBulkFill({
      scope: this.bulkScope,
      bookingClassId: this.bulkBookingClassId,
      price: this.bulkPrice || 0,
      seatsRequested: this.bulkSeats || 0,
      fromDate: this.bulkFromDate?.toISOString(),
      toDate: this.bulkToDate?.toISOString(),
      daysOfWeek: this.bulkScope === 'daysOfWeek' ? this.selectedDays : undefined
    }));
    this.bulkBookingClassId = null;
    this.bulkPrice = null;
    this.bulkSeats = null;
    this.bulkFromDate = null;
    this.bulkToDate = null;
    this.selectedDays = [];
    this.bulkScope = 'all';
    this.notification.success('Bulk fill applied to the table. Please review the values before saving.');
  }

  onSave(): void {
    this.store.dispatch(PricingActions.upsertPricing({ operatorSeasonRouteId: this.operatorSeasonRouteId }));
  }

  isWeekend(row: PricingRowDto): boolean {
    return row.dayOfWeek === 'Saturday' || row.dayOfWeek === 'Sunday';
  }

  isEmptyRow(row: PricingRowDto): boolean {
    return row.bookingClassPricings.every(bcp => bcp.price === 0 && bcp.seatsRequested === 0);
  }

  getPrice(row: PricingRowDto, bookingClassId: number): number | null {
    const val = row.bookingClassPricings.find(bcp => bcp.bookingClassId === bookingClassId)?.price ?? 0;
    return val === 0 ? null : val;
  }

  getSeats(row: PricingRowDto, bookingClassId: number): number | null {
    const val = row.bookingClassPricings.find(bcp => bcp.bookingClassId === bookingClassId)?.seatsRequested ?? 0;
    return val === 0 ? null : val;
  }

  get canApplyBulkFill(): boolean {
    if (!this.bulkBookingClassId || this.bulkPrice == null || this.bulkSeats == null || this.bulkSeats <= 0)
      return false;
    if (this.bulkScope === 'dateRange' && (!this.bulkFromDate || !this.bulkToDate))
      return false;
    if (this.bulkScope === 'daysOfWeek' && this.selectedDays.length === 0)
      return false;
    return true;
  }

  onFromDateChange(date: Date | null): void {
    this.bulkFromDate = date;
    if (this.bulkToDate && date && this.bulkToDate < date) {
      this.bulkToDate = null;
    }
  }

}
