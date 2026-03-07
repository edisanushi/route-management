import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TourOperatorDto, TourOperatorFormDto, TourOperatorUpdateDto, TourOperatorProfileDto } from '../models/tour-operator.models';

@Injectable({ providedIn: 'root' })
export class TourOperatorService {
  private readonly apiUrl = `${environment.apiUrl}/touroperators`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TourOperatorDto[]> {
    return this.http.get<TourOperatorDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<TourOperatorDto> {
    return this.http.get<TourOperatorDto>(`${this.apiUrl}/${id}`);
  }

  getMyProfile(): Observable<TourOperatorDto> {
    return this.http.get<TourOperatorDto>(`${this.apiUrl}/me`);
  }

  create(dto: TourOperatorFormDto): Observable<TourOperatorDto> {
    return this.http.post<TourOperatorDto>(this.apiUrl, dto);
  }

  update(id: number, dto: TourOperatorUpdateDto): Observable<TourOperatorDto> {
    return this.http.put<TourOperatorDto>(`${this.apiUrl}/${id}`, dto);
  }

  updateProfile(id: number, dto: TourOperatorProfileDto): Observable<TourOperatorDto> {
    return this.http.put<TourOperatorDto>(`${this.apiUrl}/${id}/profile`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBookingClassIds(id: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${id}/bookingclasses`);
  }

  updateBookingClasses(id: number, bookingClassIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/bookingclasses`, bookingClassIds);
  }

  getSeasonRouteIds(id: number, seasonId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${id}/seasons/${seasonId}/routes`);
  }

  updateSeasonRoutes(id: number, seasonId: number, routeIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/seasons/${seasonId}/routes`, routeIds);
  }

  getRouteSeasonIds(id: number, routeId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${id}/routes/${routeId}/seasons`);
  }

  updateRouteSeasons(id: number, routeId: number, seasonIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/routes/${routeId}/seasons`, seasonIds);
  }
}
