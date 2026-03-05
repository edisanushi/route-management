import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SeasonDto, SeasonFormDto, SeasonType } from '../models/season.models';
import { SeasonsActions } from '../store/seasons.actions';
import { selectSelectedSeason, selectSeasonsLoading } from '../store/seasons.selectors';

@Component({
  selector: 'app-season-form',
  templateUrl: './season-form.html',
  styleUrls: ['./season-form.scss'],
  standalone: false
})
export class SeasonForm implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading$!: Observable<boolean>;
  selectedSeason$!: Observable<SeasonDto | null>;
  isEditMode = false;
  seasonId: number | null = null;
  seasonTypes = [
    { value: SeasonType.Winter, label: 'Winter (Jan – Jun)' },
    { value: SeasonType.Summer, label: 'Summer (Jul – Dec)' }
  ];
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private store: Store, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectSeasonsLoading);
    this.selectedSeason$ = this.store.select(selectSelectedSeason);
    this.form = this.fb.group({
      year: [null, [Validators.required, Validators.min(2000), Validators.max(2100)]],
      seasonType: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    }, { validators: this.datesInSameYearValidator });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.seasonId = +id;
      this.store.dispatch(SeasonsActions.loadSeason({ id: this.seasonId }));

      this.selectedSeason$.pipe(takeUntil(this.destroy$)).subscribe(season => {
        if (season) {
          this.form.patchValue({
            year: season.year,
            seasonType: season.seasonType,
            startDate: new Date(season.startDate),
            endDate: new Date(season.endDate)
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(SeasonsActions.clearSelectedSeason());
    this.destroy$.next();
    this.destroy$.complete();
  }

  get year() { return this.form.get('year'); }
  get seasonType() { return this.form.get('seasonType'); }
  get startDate() { return this.form.get('startDate'); }
  get endDate() { return this.form.get('endDate'); }

  onStartDateChange(date: Date | null): void {
    if (!date) return;
    this.form.patchValue({ year: date.getFullYear() }, { emitEvent: false });
  }

  onEndDateChange(date: Date | null): void {
    if (!date) return;
    this.form.patchValue({ year: date.getFullYear() }, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.value;
    const dto: SeasonFormDto = {
      year: raw.year,
      seasonType: raw.seasonType,
      startDate: this.toIsoDate(raw.startDate),
      endDate: this.toIsoDate(raw.endDate)
    };
    if (this.isEditMode && this.seasonId) {
      this.store.dispatch(SeasonsActions.updateSeason({ id: this.seasonId, dto }));
    } else {
      this.store.dispatch(SeasonsActions.createSeason({ dto }));
    }
  }

  onCancel(): void {
    window.history.back();
  }

  private datesInSameYearValidator(group: AbstractControl): ValidationErrors | null {
    const start: Date | null = group.get('startDate')?.value;
    const end: Date | null = group.get('endDate')?.value;
    if (!start || !end) return null;
    return start.getFullYear() === end.getFullYear() ? null : { differentYears: true };
  }

  private toIsoDate(value: Date | string): string {
    const d = new Date(value);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00`;
  }

  get startPickerStartAt(): Date | null {
    const val = this.startDate?.value;
    if (val) return new Date(val);
    const year = this.year?.value;
    return year ? new Date(year, 0, 1) : null;
  }

  get endPickerStartAt(): Date | null {
    const val = this.endDate?.value;
    if (val) return new Date(val);
    const year = this.year?.value;
    return year ? new Date(year, 0, 1) : null;
  }

}