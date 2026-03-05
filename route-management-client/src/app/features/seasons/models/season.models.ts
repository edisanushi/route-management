export enum SeasonType {
  Winter = 1,
  Summer = 2
}

export interface SeasonFormDto {
  year: number;
  seasonType: SeasonType;
  startDate: string;
  endDate: string;
}

export interface SeasonDto {
  id: number;
  year: number;
  seasonType: SeasonType;
  seasonTypeName: string;
  startDate: string;
  endDate: string;
}

export interface SeasonsState {
  isLoading: boolean;
  error: string | null;
  seasons: SeasonDto[];
  selectedSeason: SeasonDto | null;
}