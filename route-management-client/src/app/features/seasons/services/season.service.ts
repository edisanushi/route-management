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

  getById(id: number): Observable<SeasonDto> {
    return this.http.get<SeasonDto>(`${this.apiUrl}/${id}`);
  }

  update(id: number, dto: SeasonFormDto): Observable<SeasonDto> {
    return this.http.put<SeasonDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}