export interface TourOperatorDto {
  id: number;
  name: string;
  userId: string | null;
  userEmail: string | null;
  contactPerson: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
}

export interface TourOperatorFormDto {
  name: string;
  email: string;
  password: string;
  contactPerson: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
}

export interface TourOperatorUpdateDto {
  name: string;
  contactPerson: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
}

export interface TourOperatorProfileDto {
  contactPerson: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
}

export interface TourOperatorsState {
  tourOperators: TourOperatorDto[];
  selectedTourOperator: TourOperatorDto | null;
  isLoading: boolean;
  error: string | null;
  bookingClassIds: number[];
  bookingClassesLoading: boolean;
  seasonRouteIds: number[];
  seasonRoutesLoading: boolean;
  routeSeasonIds: number[];
  routeSeasonsLoading: boolean;
}