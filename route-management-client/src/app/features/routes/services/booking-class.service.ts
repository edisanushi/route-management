import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BookingClassDto } from '../models/route.models';

@Injectable({ providedIn: 'root' })
export class BookingClassService {
  private readonly apiUrl = `${environment.apiUrl}/bookingclasses`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BookingClassDto[]> {
    return this.http.get<BookingClassDto[]>(this.apiUrl);
  }
}
