import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AssignedSeasonRouteDto, PricingTableDto, UpsertPricingDto } from '../models/pricing.models';

@Injectable({ providedIn: 'root' })
export class PricingService {
  private readonly apiUrl = `${environment.apiUrl}/pricing`;

  constructor(private http: HttpClient) {}

  getMyAssignedRoutes(): Observable<AssignedSeasonRouteDto[]> {
    return this.http.get<AssignedSeasonRouteDto[]>(`${this.apiUrl}/assigned-routes`);
  }

  getAssignedRoutesByOperator(tourOperatorId: number): Observable<AssignedSeasonRouteDto[]> {
    return this.http.get<AssignedSeasonRouteDto[]>(`${this.apiUrl}/assigned-routes/${tourOperatorId}`);
  }

  getPricingTable(operatorSeasonRouteId: number): Observable<PricingTableDto> {
    return this.http.get<PricingTableDto>(`${this.apiUrl}/${operatorSeasonRouteId}`);
  }

  upsertPricing(operatorSeasonRouteId: number, dto: UpsertPricingDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${operatorSeasonRouteId}`, dto);
  }
}