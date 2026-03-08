export interface AssignedSeasonRouteDto {
  operatorSeasonRouteId: number;
  seasonId: number;
  seasonName: string;
  routeId: number;
  origin: string;
  destination: string;
  isPriced: boolean;
}

export interface BookingClassPricingDto {
  bookingClassId: number;
  bookingClassName: string;
  price: number;
  seatsRequested: number;
}

export interface PricingRowDto {
  date: string;
  dayOfWeek: string;
  bookingClassPricings: BookingClassPricingDto[];
}

export interface UpsertBookingClassPricingDto {
  bookingClassId: number;
  price: number;
  seatsRequested: number;
}

export interface UpsertPricingRowDto {
  date: string;
  bookingClassPricings: UpsertBookingClassPricingDto[];
}

export interface UpsertPricingDto {
  rows: UpsertPricingRowDto[];
}

export type BulkFillScope = 'all' | 'dateRange' | 'daysOfWeek';

export interface PricingState {
  assignedRoutes: AssignedSeasonRouteDto[];
  assignedRoutesLoading: boolean;
  rows: PricingRowDto[];
  tableLoading: boolean;
  saving: boolean;
  error: string | null;
  origin: string;
  destination: string;
  seasonName: string;
  selectedTourOperatorId: number | null;
}

export interface PricingTableDto {
  origin: string;
  destination: string;
  seasonName: string;
  rows: PricingRowDto[];
}