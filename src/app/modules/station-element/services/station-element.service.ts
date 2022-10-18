import { StationElementsState } from './../../../data/interface/station-element';
import { Observable, BehaviorSubject, catchError, tap } from 'rxjs';
import { HttpService } from './../../../shared/services/http.service';
import { Injectable } from '@angular/core';
import { StationElement } from '@data/interface/station';

const apiPrefix = `climsoft/v1`;

@Injectable({
  providedIn: 'root'
})
export class StationElementService {
  stationElements: BehaviorSubject<StationElementsState> = new BehaviorSubject<StationElementsState>({ elements: [], limit: 10, page: 1, pages: 1 });
  public init = false;

  constructor(private http: HttpService) {
    const state = this.stationElements.getValue();
    this.getElements(state.page, state.limit);
  }

  get stationElements$(): Observable<StationElementsState> {
    return this.stationElements.asObservable();
  }

  updateState(state: { page?: number, limit?: number }) {
    if(state.page) {
      const limit = this.stationElements.getValue().limit;
      this.getElements(state.page, limit);
    }
    if(state.limit) {
      this.getElements(1, state.limit);
    }
  }

  getElements(page: number, limit: number) {
    const offset = (page - 1) * limit;
    this.http.GET(`${apiPrefix}/station-elements?limit=${limit}&offset=${offset}`).subscribe((res: any) => {
      console.log(res);
      this.stationElements.next({ elements: res.result, limit, page: res.page, pages: res.pages });
      this.init = true;
    });
  }

  addStElement(payload: Partial<StationElement>): Observable<any> {
    return this.http.POST(`${apiPrefix}/station-elements`, payload).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        console.log(res);
        const state = this.stationElements.getValue();
        const { page, limit } = state;
        this.getElements(page, limit);
      })
    );
  }

  updateStElement(payload: Partial<StationElement>) {
    const url = `${apiPrefix}/station-elements/${payload.recorded_from}/${payload.described_by}/${payload.recorded_with}/${payload.begin_date}`;
    return this.http.PUT(url, payload).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        console.log(res);
        const state = this.stationElements.getValue();
        const { page, limit } = state;
        this.getElements(page, limit);
      })
    );
  }

  remove(sel: any) {

  }
}
