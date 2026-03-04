export interface RouteDto {
  id: number;
  origin: string;
  destination: string;
  bookingClassIds: number[];
}

export interface RouteFormDto {
  origin: string;
  destination: string;
  bookingClassIds: number[];
}

export interface BookingClassDto {
  id: number;
  name: string;
}

export interface RoutesState {
  routes: RouteDto[];
  selectedRoute: RouteDto | null;
  isLoading: boolean;
  error: string | null;
}

export interface BookingClassesState {
  bookingClasses: BookingClassDto[];
  isLoading: boolean;
  error: string | null;
}