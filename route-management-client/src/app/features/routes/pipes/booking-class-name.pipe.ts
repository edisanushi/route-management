import { Pipe, PipeTransform } from '@angular/core';
import { BookingClassDto } from '../models/route.models';

@Pipe({ name: 'bookingClassName', standalone: false })
export class BookingClassNamePipe implements PipeTransform {
  transform(bookingClasses: BookingClassDto[], id: number): string {
    return bookingClasses.find(bc => bc.id === id)?.name ?? '';
  }
}