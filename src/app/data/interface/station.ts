import { Qualifier } from './qualifier';

export interface Station {
  station_id?: number;
  station_name: string;
  wmoid: string;
  icaoid: string;
  latitude: number;
  longitude: number;
  qualifier: string;
  elevation: string;
  geolocation_method: string;
  geolocation_accuracy: number;
  opening_datetime: string;
  closing_datetime: string;
  country: string;
  authority: string;
  admin_region: string;
  drainage_basin: string;
  waca_selection: boolean;
  cpt_selection: boolean;
  station_operational: boolean
}

export interface StationsState {
  stations: Station[];
  limit: number;
  page: number;
  pages: number;
}

export interface StationElement {
  begin_date: Date;
  described_by: number;
  end_date: Date;
  height: number;
  instrument_code: number;
  recorded_from: string;
  recorded_with: string;
  scheduled_for: string;
  obs_element?: any
}

export interface StationElementsResponse {
  elements: StationElement[];
  limit: number;
  page: number;
  pages: number;
}

export interface StationLocationHistory {
  belongs_to: string;
  station_type: string;
  geoLocationMethod: string;
  geoLocationAccuracy: number;
  opening_datetime: Date;
  closing_datetime: Date;
  latitude: 0;
  longitude: 0;
  elevation: 0;
  authority: string;
  admin_region: string;
  drainage_basin: string
}

export interface StationLocationHistoryResponse {
  history: StationLocationHistory[];
  limit: number;
  page: number;
  pages: number;
}

export interface StationLocationHistoryPayload {
  belongs_to: string;
  station_type: string;
  geolocation_method: string;
  geolocation_accuracy: number;
  opening_datetime: Date;
  closing_datetime: Date;
  latitude: 0;
  longitude: 0;
  elevation: 0;
  authority: string;
  admin_region: string;
  drainage_basin: string
}

export interface StationQualifierResponse {
  qualifiers: Qualifier[];
  limit: number;
  page: number;
  pages: number;
}
