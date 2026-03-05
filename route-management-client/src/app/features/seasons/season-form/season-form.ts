import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SeasonType, SeasonFormDto } from '../models/season.models';
import { SeasonsActions } from '../store/seasons.actions';
import { selectSeasonsLoading } from '../store/seasons.selectors';

@Component({
  selector: 'app-season-form',
  templateUrl: './season-form.html',
  styleUrls: ['./season-form.scss'],
  standalone: false
})
export class SeasonForm implements OnInit {
  form!: FormGroup;
  isLoading$!: Observable<boolean>;
  seasonTypes = [
    { value: SeasonType.Winter, label: 'Winter (Jan – Jun)' },
    { value: SeasonType.Summer, label: 'Summer (Jul – Dec)' }
  ];

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectSeasonsLoading);
    this.form = this.fb.group({
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
      seasonType: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    }, { validators: this.datesInSameYearValidator });
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
    this.store.dispatch(SeasonsActions.createSeason({ dto }));
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

}