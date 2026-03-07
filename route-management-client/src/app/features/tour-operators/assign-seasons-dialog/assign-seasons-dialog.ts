import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { SeasonDto } from '../../seasons/models/season.models';
import { SeasonService } from '../../seasons/services/season.service';
import { TourOperatorService } from '../services/tour-operator.service';
import { NotificationService } from '../../../core/services/notification.service';

export interface AssignSeasonsDialogData {
  operatorId: number;
  routeId: number;
  routeName: string;
}

@Component({
  selector: 'app-assign-seasons-dialog',
  templateUrl: './assign-seasons-dialog.html',
  styleUrls: ['./assign-seasons-dialog.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ]
})
export class AssignSeasonsDialog implements OnInit, OnDestroy {
  seasons: SeasonDto[] = [];
  selectedSeasonIds: number[] = [];
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private seasonService: SeasonService,
    private tourOperatorService: TourOperatorService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<AssignSeasonsDialog>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: AssignSeasonsDialogData
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.seasonService.getAll(),
      this.tourOperatorService.getRouteSeasonIds(this.data.operatorId, this.data.routeId)
    ]).pipe(takeUntil(this.destroy$)).subscribe(([seasons, ids]) => {
      this.seasons = seasons;
      this.selectedSeasonIds = [...ids];
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isSelected(id: number): boolean {
    return this.selectedSeasonIds.includes(id);
  }

  toggle(id: number): void {
    if (this.selectedSeasonIds.includes(id)) {
      this.selectedSeasonIds = this.selectedSeasonIds.filter(i => i !== id);
    } else {
      this.selectedSeasonIds = [...this.selectedSeasonIds, id];
    }
  }

  onSave(): void {
    this.isLoading = true;
    this.tourOperatorService.updateRouteSeasons(this.data.operatorId, this.data.routeId, this.selectedSeasonIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.success('Seasons updated successfully.');
          this.dialogRef.close(true);
        },
        error: () => {
          this.notification.error('Failed to update seasons.');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}