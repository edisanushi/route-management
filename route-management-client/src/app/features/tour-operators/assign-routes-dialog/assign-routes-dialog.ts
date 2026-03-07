import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { RouteDto } from '../../routes/models/route.models';
import { RouteService } from '../../routes/services/route.service';
import { TourOperatorService } from '../services/tour-operator.service';
import { NotificationService } from '../../../core/services/notification.service';

export interface AssignRoutesDialogData {
  operatorId: number;
  seasonId: number;
  seasonName: string;
}

@Component({
  selector: 'app-assign-routes-dialog',
  templateUrl: './assign-routes-dialog.html',
  styleUrls: ['./assign-routes-dialog.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ]
})
export class AssignRoutesDialog implements OnInit, OnDestroy {
  routes: RouteDto[] = [];
  selectedRouteIds: number[] = [];
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private routeService: RouteService,
    private tourOperatorService: TourOperatorService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<AssignRoutesDialog>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: AssignRoutesDialogData
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.routeService.getAll(),
      this.tourOperatorService.getSeasonRouteIds(this.data.operatorId, this.data.seasonId)
    ]).pipe(takeUntil(this.destroy$)).subscribe(([routes, ids]) => {
      this.routes = routes;
      this.selectedRouteIds = [...ids];
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isSelected(id: number): boolean {
    return this.selectedRouteIds.includes(id);
  }

  toggle(id: number): void {
    if (this.selectedRouteIds.includes(id)) {
      this.selectedRouteIds = this.selectedRouteIds.filter(i => i !== id);
    } else {
      this.selectedRouteIds = [...this.selectedRouteIds, id];
    }
  }

  onSave(): void {
    this.isLoading = true;
    this.tourOperatorService.updateSeasonRoutes(this.data.operatorId, this.data.seasonId, this.selectedRouteIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.success('Routes updated successfully.');
          this.dialogRef.close(true);
        },
        error: () => {
          this.notification.error('Failed to update routes.');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}