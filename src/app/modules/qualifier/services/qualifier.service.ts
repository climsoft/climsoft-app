import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

import { HttpService } from './../../../shared/services/http.service';
import { Qualifier, QualifiersState } from './../../../data/interface/qualifier';

const apiPrefix = `climsoft/v1/station-qualifiers`;

@Injectable({
  providedIn: 'root'
})
export class QualifierService {
  qualifiers$: BehaviorSubject<QualifiersState> = new BehaviorSubject<QualifiersState>({ qualifiers: [], limit: 10, page: 1, pages: 1 });
  public init = false;

  constructor(private http: HttpService) {
    const state = this.qualifiers$.getValue();
    this.getQualifiers(state.page, state.limit);
  }

  get qualifiers(): Observable<QualifiersState> {
    return this.qualifiers$.asObservable();
  }

  adapt(obj: Qualifier | any): any {
    const keyMaps: any = {
      "belongs_to": "Station",
      "qualifier": "Qualifier",
      "station_timezone": "Time Zone",
      "station_network_type": "Network Type",
      "qualifier_begin_date": "Begin Date",
      "qualifier_end_date": "End Date"
    };

    let result: any = [];
    Object.keys(obj)
      .filter(k => ['qualifier_begin_date', 'qualifier_end_date'].indexOf(k) === -1)
      .forEach((k: string) => {
        const item: any = {};
        item['key'] = keyMaps[k];
        item['value'] = obj[k] || 'No Value';
        switch (k) {
          case 'qualifier_begin_date':
            item['type'] = 'date';
            break;
          case 'qualifier_end_date':
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
      const limit = this.qualifiers$.getValue().limit;
      this.getQualifiers(state.page, limit);
    }
    if(state.limit) {
      this.getQualifiers(1, state.limit);
    }
  }

  getQualifiers(page: number, limit: number) {
    console.log(page, limit);
    const offset = (page - 1) * limit;
    this.http.GET(`${apiPrefix}?limit=${limit}&offset=${offset}`).subscribe((res: any) => {
      console.log(res);
      this.qualifiers$.next({ qualifiers: res.result, limit, page: res.page, pages: res.pages });
      this.init = true;
    });
  }

  getQualifier(id: number): Observable<Qualifier | any> {
    return this.http.GET(`${apiPrefix}/${id}`);
  }

  addQualifier(payload: Partial<Qualifier>): Observable<any> {
    return this.http.POST(`${apiPrefix}`, { ...payload }).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        console.log(res);
        const state = this.qualifiers$.getValue();
        const { page, limit } = state;
        this.getQualifiers(page, limit);
      })
    );
  }

  updateQualifier(payload: Qualifier): Observable<any> {
    const url = `${apiPrefix}/${payload.qualifier}/${payload.qualifier_begin_date}/${payload.qualifier_end_date}/${payload.belongs_to}`;
    return this.http.PUT(url, payload).pipe(
              catchError((err) => {
                throw new Error(err.error.message);
              }),
              tap(res => {
                const state = this.qualifiers$.getValue();
                const { page, limit } = state;
                this.getQualifiers(page, limit);
              })
            );
  }

  removeQualifier(id: number) {
    this.http.DELETE(`${apiPrefix}/${id}`).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      })
    ).subscribe(res => {
      const state = this.qualifiers$.getValue();
      const { page, limit } = state;
      this.getQualifiers(page, limit);
    });
  }
}
