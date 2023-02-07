import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpService } from '@shared/services/http.service';
import { ScheduleClass, ScheduleClassState, SchedClassUpdatePayload } from './../../../data/interface/schedule-class';

const apiPrefix = `/v1`;

@Injectable({
  providedIn: 'root'
})
export class ScheduleClassService {
  state$: BehaviorSubject<ScheduleClassState> = new BehaviorSubject<ScheduleClassState>({ classes: [], limit: 10, page: 1, pages: 1 });
  public init = false;

  constructor(private http: HttpService) {
    const state = this.state$.getValue();
    this.getClasses(state.page, state.limit);
  }

  get definitions(): Observable<ScheduleClassState> {
    return this.state$.asObservable();
  }

  getClasses(page: number, limit: number) {
    console.log(page, limit);
    const offset = (page - 1) * limit;
    this.http.GET(`${apiPrefix}/obs-schedule-class?limit=${limit}&offset=${offset}`).subscribe((res: any) => {
      console.log(res);
      this.state$.next({ classes: res.result, limit, page: res.page, pages: res.pages });
      this.init = true;
    });
  }

  getByStation(id: any) {
    return this.http.GET(`${apiPrefix}/obs-schedule-class?limit=50&offset=0&refers_to=${id}`);
  }

  addClass(payload: ScheduleClass): Observable<any> {
    return this.http.POST(`${apiPrefix}/obs-schedule-class`, payload).pipe(
      tap(() => {
        const state = this.state$.getValue();
        this.getClasses(state.page, state.limit)
      })
    );
  }

  updateClass(schClass: string, payload: SchedClassUpdatePayload): Observable<any> {
    return this.http.PUT(`${apiPrefix}/obs-schedule-class/${schClass}`, payload).pipe(
      tap(() => {
        const state = this.state$.getValue();
        this.getClasses(state.page, state.limit)
      })
    );
  }

  removeClass(schClass: string) {
    this.http.DELETE(`${apiPrefix}/obs-schedule-class/${schClass}`).pipe(
      tap(() => {
        const state = this.state$.getValue();
        this.getClasses(state.page, state.limit)
      })
    ).subscribe();
  }

  updateState(state: { page?: number, limit?: number }) {
    if(state.page) {
      const limit = this.state$.getValue().limit;
      this.getClasses(state.page, limit);
    }
    if(state.limit) {
      this.getClasses(1, state.limit);
    }
  }
}
