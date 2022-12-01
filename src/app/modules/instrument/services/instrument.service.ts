import { HttpService } from './../../../shared/services/http.service';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';

import { Instrument, InstrumentsState } from './../../../data/interface/instrument';

const apiPrefix = `/v1`;

@Injectable({
  providedIn: 'root'
})
export class InstrumentService {
  instruments$: BehaviorSubject<InstrumentsState> = new BehaviorSubject<InstrumentsState>({ instruments: [], limit: 10, page: 1, pages: 1 });
  public init = false;

  constructor(private http: HttpService) {
    const state = this.instruments$.getValue();
    this.getInstruments(state.page, state.limit);
  }

  get instruments(): Observable<InstrumentsState> {
    return this.instruments$.asObservable();
  }

  adapt(obj: Instrument | any): any {
    const keyMaps: any = {
      "instrument_id": "",
      "instrument_name": "Instrument Name",
      "serial_number": "Serial Number",
      "abbreviation": "Abbreviation",
      "model": "Model",
      "manufacturer": "Manufacturer",
      "instrument_uncertainty": "Instrument Uncertainty",
      "installation_datetime": "Installation DateTime",
      "deinstallation_datetime": "Deinstallation DateTime",
      "height": "Height",
      "instrument_picture": "Instrument Picture",
      "installed_at": "Installed At"
    };

    let result: any = [];
    Object.keys(obj)
      .filter(k => ['instrument_id', 'instrument_name'].indexOf(k) === -1)
      .forEach((k: string) => {
        const item: any = {};
        item['key'] = keyMaps[k];
        item['value'] = obj[k] || 'No Value';
        switch (k) {
          case 'installation_datetime':
            item['type'] = 'date';
            break;
          case 'deinstallation_datetime':
            item['type'] = 'date';
            break;
          default:
            item['type'] = null;
        }
        result.push(item);
      });

    return result;
  }

  addInstrument(payload: Instrument): Observable<any> {
    return this.http.POST(`${apiPrefix}/instruments`, { ...payload, installation_datetime: payload.installation_datetime.toISOString(), deinstallation_datetime: payload.deinstallation_datetime.toISOString() }).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        console.log(res);
        const state = this.instruments$.getValue();
        const { page, limit } = state;
        this.getInstruments(page, limit);
      })
    );
  }

  search(query: string) {
    return this.http.GET(`${apiPrefix}/instruments/search?query=${query}`);
  }

  updateState(state: { page?: number, limit?: number }) {
    if(state.page) {
      const limit = this.instruments$.getValue().limit;
      this.getInstruments(state.page, limit);
    }
    if(state.limit) {
      this.getInstruments(1, state.limit);
    }
  }

  getInstruments(page: number, limit: number) {
    console.log(page, limit);
    const offset = (page - 1) * limit;
    this.http.GET(`${apiPrefix}/instruments?limit=${limit}&offset=${offset}`).subscribe((res: any) => {
      console.log(res);
      this.instruments$.next({ instruments: res.result, limit, page: res.page, pages: res.pages });
      this.init = true;
    });
  }

  getInstrument(id: number): Observable<Instrument | any> {
    return this.http.GET(`${apiPrefix}/instruments/${id}`);
  }

  updateInstrument(id: string, payload: Partial<Instrument>): Observable<any> {
    return this.http.PUT(`${apiPrefix}/instruments/${id}`, payload).pipe(
              catchError((err) => {
                throw new Error(err.error.message);
              }),
              tap(res => {
                const state = this.instruments$.getValue();
                const { page, limit } = state;
                this.getInstruments(page, limit);
              })
            );
  }

  removeInstrument(id: number | string) {
    this.http.DELETE(`${apiPrefix}/instruments/${id}`).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      })
    ).subscribe(res => {
      const state = this.instruments$.getValue();
      const { page, limit } = state;
      this.getInstruments(page, limit);
    });
  }
}
