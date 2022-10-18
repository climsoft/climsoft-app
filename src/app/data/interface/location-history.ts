import { StationLocationHistory } from 'src/app/data/interface/station';

export interface LocationHistoriesState {
  locationHistories: StationLocationHistory[],
  limit: number;
  page: number;
  pages: number;
}

export interface LocationHistoryPayload {

}
