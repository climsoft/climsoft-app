import { StationLocationHistory } from 'src/app/data/interface/station';
import { HttpService } from './../../../shared/services/http.service';
import { LocationHistoriesState, LocationHistoryPayload } from './../../../data/interface/location-history';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';

const apiPrefix = `/v1/station-location-histories`;

@Injectable({
  providedIn: 'root'
})
export class LocHistoryService {
  histories$: BehaviorSubject<LocationHistoriesState> = new BehaviorSubject<LocationHistoriesState>({ locationHistories: [], limit: 10, page: 1, pages: 1 });
  public init = false;

  constructor(private http: HttpService) {
    const state = this.histories$.getValue();
    this.getLocHistories(state.page, state.limit);
  }

  get histories(): Observable<LocationHistoriesState> {
    return this.histories$.asObservable();
  }

  adapt(obj: StationLocationHistory | any): any {
    const keyMaps: any = {
      "belongs_to": "Belongs To",
      "station_type": "Station Type",
      "geolocation_method": "Geolocation Method",
      "geolocation_accuracy": "Geolocation Accuracy",
      "opening_datetime": "Opening",
      "closing_datetime": "Closing",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "elevation": "Elevation",
      "authority": "Authority",
      "admin_region": "Height",
      "drainage_basin": "Drainage Basin"
    };

    let result: any = [];
    Object.keys(obj)
      .filter(k => ['opening_datetime', 'closing_datetime'].indexOf(k) === -1)
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
          default:
            item['type'] = null;
        }
        result.push(item);
      });

    return result;
  }

  updateState(state: { page?: number, limit?: number }) {
    if(state.page) {
      const limit = this.histories$.getValue().limit;
      this.getLocHistories(state.page, limit);
    }
    if(state.limit) {
      this.getLocHistories(1, state.limit);
    }
  }

  getLocHistories(page: number, limit: number) {
    console.log(page, limit);
    const offset = (page - 1) * limit;
    this.http.GET(`${apiPrefix}?limit=${limit}&offset=${offset}`).subscribe((res: any) => {
      console.log(res);
      this.histories$.next({ locationHistories: res.result, limit, page: res.page, pages: res.pages });
      this.init = true;
    });
  }

  getLocHistory(id: number): Observable<StationLocationHistory | any> {
    return this.http.GET(`${apiPrefix}/${id}`);
  }

  addNew(payload: LocationHistoryPayload) {
    return this.http.POST(`${apiPrefix}`, payload);
  }

  update(belongsTo: number, openDateTime: string, item: Partial<StationLocationHistory>) {
    return this.http.PUT(`${apiPrefix}/${belongsTo}/${openDateTime}`, item).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        console.log(res);
        const state = this.histories$.getValue();
        const { page, limit } = state;
        this.getLocHistories(page, limit);
      })
    );
  }

  remove(belongsTo: number, openDateTime: string) {
    return this.http.DELETE(`${apiPrefix}/${belongsTo}/${openDateTime}`).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        console.log(res);
        const state = this.histories$.getValue();
        const { page, limit } = state;
        this.getLocHistories(page, limit);
      })
    );
  }
}
