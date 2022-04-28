import { FormDailyPayload } from './../../../data/interface/data-entry-daily-payload';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import * as moment from 'moment';

const apiPrefix = `climsoft/v1`;

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {

  constructor(private http: HttpService) { }

  getDailyEntry(station: string | any, element: string | any, year: number, month: number, hour: number): Observable<any> {
    return this.http.GET(`${apiPrefix}/form_daily2s/${station}/${element}/${year}/${month}/${hour}`);
  }

  addDailyEntry(payload: FormDailyPayload) {
    return this.http.POST(`${apiPrefix}/form_daily2s`, payload);
  }

  updateDailyEntry(station: string | any, element: string | any, year: number, month: number, hour: number, payload: FormDailyPayload) {
    return this.http.PUT(`${apiPrefix}/form_daily2s/${station}/${element}/${year}/${month}/${hour}`, payload);
  }
}
