import { HttpService } from './../../../shared/services/http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, of, tap } from 'rxjs';

import { Station, StationsState } from 'src/app/data/interface/station';

const apiPrefix = `climsoft/v1`;

@Injectable({
  providedIn: 'root'
})
export class StationService {
  stations$: BehaviorSubject<StationsState> = new BehaviorSubject<StationsState>({ stations: [], limit: 10, page: 1, pages: 1 });
  public init = false;

  constructor(private http: HttpService) {
    const state = this.stations$.getValue();
    this.getStations(state.page, state.limit);
  }

  get stations(): Observable<StationsState> {
    return this.stations$.asObservable();
  }

  adapt(obj: Station | any): any {
    const keyMaps: any = {
      "station_name": "Station Name",
      "wmoid": "WMO ID",
      "icaoid": "ICAO ID",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "elevation": "Elevation",
      "qualifier": "Qualifier",
      "geolocation_method": "Geo Location Method",
      "geolocation_accuracy": "Geo Location Accurary",
      "opening_datetime": "Opening",
      "closing_datetime": "Closing",
      "country": "Country",
      "authority": "Authority",
      "admin_region": "Admin Region",
      "drainage_basin": "Drainage",
      "waca_selection": "WACA Selection",
      "cpt_selection": "SCP SELECTION",
      "station_operational": "Station Operational"
    };

    let result: any = [];
    Object.keys(obj)
      .filter(k => ['station_id', 'station_name'].indexOf(k) === -1)
      .forEach((k: string) => {
        const item: any = {};
        item['key'] = keyMaps[k];
        item['value'] = obj[k] || 'No Value';
        switch (k) {
          case 'opening_datetime':
            item['type'] = 'date';
            break;
          case 'closing_datetime':
            item['type'] = 'date';
            break;
          case 'closing_datetime':
            item['type'] = 'date';
            break;
          default:
            item['type'] = null;
        }
        result.push(item);
      });

    return result;
  }

  updateState(state: { page?: number, limit?: number }) {
    if(state.page) {
      const limit = this.stations$.getValue().limit;
      this.getStations(state.page, limit);
    }
    if(state.limit) {
      this.getStations(1, state.limit);
    }
  }

  getStations(page: number, limit: number) {
    console.log(page, limit);
    const offset = (page - 1) * limit;
    this.http.GET(`${apiPrefix}/stations?limit=${limit}&offset=${offset}`).subscribe((res: any) => {
      console.log(res);
      this.stations$.next({ stations: res.result, limit, page: res.page, pages: res.pages });
      this.init = true;
    });
  }

  getStation(id: number): Observable<Station | any> {
    return this.http.GET(`${apiPrefix}/stations/${id}`);
  }

  searchStation(query: string) {
    return this.http.GET(`${apiPrefix}/stations/search?query=${query}`);
  }

  addStation(payload: Station): Observable<any> {
    const station_id = '2343403';
    return this.http.POST(`${apiPrefix}/stations`, { ...payload, station_id }).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        console.log(res);
        const state = this.stations$.getValue();
        const { page, limit } = state;
        this.getStations(page, limit);
      })
    );
  }

  updateStation(id: string, payload: Partial<Station>): Observable<any> {
    return this.http.PUT(`${apiPrefix}/stations/${id}`, payload).pipe(
              catchError((err) => {
                throw new Error(err.error.message);
              }),
              tap(res => {
                const state = this.stations$.getValue();
                const { page, limit } = state;
                this.getStations(page, limit);
              })
            );
  }

  removeStation(id: number) {
    this.http.DELETE(`${apiPrefix}/stations/${id}`).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      })
    ).subscribe(res => {
      const state = this.stations$.getValue();
      const { page, limit } = state;
      this.getStations(page, limit);
    });
  }

  getStationElements(id: string | number): Observable<any> {
    return this.http.GET(`${apiPrefix}/stations/${id}/station-elements`);
  }

  addStationElement(payload: any): Observable<any> {
    return this.http.POST(`${apiPrefix}/station-elements`, payload);
  }

  updateStationElement(params: any, payload: any): Observable<any> {
    return this.http.PUT(`${apiPrefix}/station-elements/${params.recorded_from}/${params.described_by}/${params.recoded_with}/${params.begin_date}`, payload);
  }

  getStationLocHistory(id: string): Observable<any> {
    return this.http.GET(`${apiPrefix}/station-location-histories?belongs_to=${id}`);
  }

  addStationLocHistory(payload: any): Observable<any> {
    return this.http.POST(`${apiPrefix}/station-location-histories`, payload);
  }

  updateStationLocHistory(belongsTo: string, opening_datetime: string, payload: any): Observable<any> {
    return this.http.PUT(`${apiPrefix}/station-location-histories/${belongsTo}/${opening_datetime}`, payload);
  }

  getStationQualifiers(id: string): Observable<any> {
    return this.http.GET(`${apiPrefix}/station-qualifiers?belongs_to=${id}`);
    // return this.http.GET(`${apiPrefix}/stations/${id}/station-elements`);
  }
}
