export interface Station {
  station_id?: number,
  station_name: string,
  wmoid: string,
  icaoid: string,
  latitude: number,
  longitude: number,
  qualifier: string,
  elevation: string,
  geolocation_method: string,
  geolocation_accuracy: number,
  opening_datetime: string,
  closing_datetime: string,
  country: string,
  authority: string,
  admin_region: string,
  drainage_basin: string,
  waca_selection: boolean,
  cpt_selection: boolean,
  station_operational: boolean
}

export interface StationsState {
  stations: Station[],
  limit: number,
  page: number,
  pages: number
}
