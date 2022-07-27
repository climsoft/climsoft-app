import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { Observable, BehaviorSubject } from 'rxjs';

import { HourlyPayload, HourlyState } from '@data/interface/data-entry-hourly-payload';
import { FormDailyPayload, DailyState } from '@data/interface/data-entry-daily-payload';
import { SynopticState } from '@data/interface/data-entry-synoptic-payload';
import * as moment from 'moment';

const apiPrefix = `climsoft/v1`;

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {

  hourlyState$: BehaviorSubject<HourlyState | boolean> = new BehaviorSubject<HourlyState | boolean>(false);
  dailyState$: BehaviorSubject<DailyState | boolean> = new BehaviorSubject<DailyState | boolean>(false);
  synopticState$: BehaviorSubject<SynopticState | boolean> = new BehaviorSubject<SynopticState | boolean>(false);

  constructor(private http: HttpService) { }

  get dailyState(): Observable<any> {
    return this.dailyState$.asObservable();
  }

  get hourlyState(): Observable<any> {
    return this.hourlyState$.asObservable();
  }

  getDailyEntry(station: string | any, element: string | any, year: number, month: number, hour: number): Observable<any> {
    // return this.http.GET(`${apiPrefix}/form_daily2s/${station}/${element}/${year}/${month}/${hour}`);
    this.updateDailyState({ station, element, monthYear: `${month}-1-${year}`, hour });
    return this.http.GET(`${apiPrefix}/form_daily2s?station_id=${station}&element_id=${element}&yyyy=${year}&mm=${month}&hh=${hour}&limit=25&offset=0`);
  }

  addDailyEntry(payload: FormDailyPayload) {
    return this.http.POST(`${apiPrefix}/form_daily2s`, payload);
  }

  updateDailyEntry(station: string | any, element: string | any, year: number, month: number, hour: number, payload: FormDailyPayload) {
    return this.http.PUT(`${apiPrefix}/form_daily2s/${station}/${element}/${year}/${month}/${hour}`, payload);
  }

  updateDailyState(newVal: DailyState) {
    this.dailyState$.next(newVal);
  }

  resetDailyState() {
    this.dailyState$.next(false);
  }

  /**
   *  Hourly Data
   */
  getHourlyEntry(station: string | any, element: string | any, year: number, month: number, day: number): Observable<any> {
    this.updateHourlyState({ station, element, date: new Date(`${month}-${day}-${year}`).toISOString() });
    return this.http.GET(`${apiPrefix}/form_hourlys?station_id=${station}&element_id=${element}&yyyy=${year}&mm=${month}&dd=${day}&limit=25&offset=0`);
  }

  addHourlyEntry(payload: HourlyPayload) {
    return this.http.POST(`${apiPrefix}/form_hourlys`, payload);
  }

  updateHourlyEntry(station: string | any, element: string | any, year: number, month: number, day: number, payload: HourlyPayload) {
    return this.http.PUT(`${apiPrefix}/form_hourlys/${station}/${element}/${year}/${month}/${day}`, payload);
  }

  updateHourlyState(newVal: HourlyState) {
    this.hourlyState$.next(newVal);
  }

  resetHourlyState() {
    this.dailyState$.next(false);
  }


  /**
   *  Hourly Data
   */
  getSynopticEntry(station: string | any, year: number, month: number, day: number, hour: number) {
    this.synopticState$.next({ station, year, month, day, hour })
    const url = `${apiPrefix}/synop-features?station_id=${station}&yy=${year}&mm=${month}&dd=${day}&hh=${hour}`;
    return this.http.GET(url);
  }

  updateSynopticState(station: string | any, year: number, month: number, day: number, hour: number) {
    this.synopticState$.next({ station, year, month, day, hour })
  }
}
