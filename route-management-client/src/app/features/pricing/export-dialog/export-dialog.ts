import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ExportService } from '../services/export.service';

@Component({
  selector: 'app-export-dialog',
  standalone: false,
  template: `
    <div class="export-dialog">
      <h2 class="export-title">Exporting Pricing Data</h2>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" [style.width.%]="percent"></div>
      </div>
      <div class="progress-info">
        <span class="progress-message">{{ message }}</span>
        <span class="progress-percent">{{ percent }}%</span>
      </div>
    </div>
  `,
  styles: [`
    .export-dialog { padding: 24px; min-width: 360px; }
    .export-title { font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 24px; }
    .progress-bar-track { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 12px; }
    .progress-bar-fill { height: 100%; background: #f4c542; border-radius: 3px; transition: width 0.3s ease; }
    .progress-info { display: flex; justify-content: space-between; }
    .progress-message { font-size: 13px; color: rgba(255,255,255,0.6); }
    .progress-percent { font-size: 13px; font-weight: 600; color: #f4c542; }
  `]
})
export class ExportDialog implements OnInit, OnDestroy {
  percent = 0;
  message = 'Starting...';
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<ExportDialog>,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.exportService.progress$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(({ percent, message }) => {
      this.percent = percent;
      this.message = message;
      this.cdr.detectChanges();
      if (percent === 100) {
        setTimeout(() => this.dialogRef.close(), 800);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}