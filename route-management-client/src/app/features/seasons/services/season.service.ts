import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SeasonFormDto, SeasonDto } from '../models/season.models';

@Injectable({ providedIn: 'root' })
export class SeasonService {
  private readonly apiUrl = `${environment.apiUrl}/seasons`;

  constructor(private http: HttpClient) {}

  create(dto: SeasonFormDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, dto);
  }

  getAll(): Observable<SeasonDto[]> {
    return this.http.get<SeasonDto[]>(this.apiUrl);
  }

}