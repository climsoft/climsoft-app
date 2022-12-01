import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, catchError, tap } from 'rxjs';

import { HttpService } from './../../../shared/services/http.service';
import { ObsElement, ObsElementState } from 'src/app/data/interface/element';

const apiPrefix = `/v1/obselements`;
@Injectable({
  providedIn: 'root'
})
export class ElementService {
  state$: BehaviorSubject<ObsElementState> = new BehaviorSubject<ObsElementState>({ elements: [], limit: 10, page: 1, pages: 1 });
  public init = false;

  constructor(private http: HttpService) {
    const state = this.state$.getValue();
    this.getElements(state.page, state.limit);
  }

  get elements(): Observable<ObsElementState> {
    return this.state$.asObservable();
  }

  adapt(obj: ObsElement | any): any {
    const keyMaps: any = {
      "element_id": "Element ID",
      "abbreviation": "Abbreviation",
      "element_name": "Element Name",
      "description": "Description",
      "element_scale": "Element Scale",
      "upper_limit": "Upper Limit",
      "lower_limit": "Lower Limit",
      "units": "Units",
      "element_type": "Element Type",
      "qc_total_required": "QC Total Required",
      "selected": "Selected"
    };

    let result: any = [];
    Object.keys(obj)
      .filter(k => k !== 'elementId')
      .forEach((k: string) => {
        result.push({ key: keyMaps[k], value: obj[k] || 'No Value' });
      });

    return result;
  }

  updateState(state: { page?: number, limit?: number }) {
    if(state.page) {
      const limit = this.state$.getValue().limit;
      this.getElements(state.page, limit);
    }
    if(state.limit) {
      this.getElements(1, state.limit);
    }
  }

  getElements(page: number, limit: number) {
    const offset = (page - 1) * limit;
    this.http.GET(`${apiPrefix}?limit=${limit}&offset=${offset}`).subscribe((res: any) => {
      console.log(res);
      this.state$.next({ elements: res.result, limit, page: res.page, pages: res.pages });
      this.init = true;
    });
  }

  searchElements(query: string) {
    return this.http.GET(`${apiPrefix}/search?query=${query}`);
  }

  getElement(id: number): Observable<ObsElement | any> {
    return this.http.GET(`${apiPrefix}/${id}`);
  }

  addElement(payload: Element): Observable<any> {
    return this.http.POST(`${apiPrefix}`, { ...payload }).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        console.log(res);
        const state = this.state$.getValue();
        const { page, limit } = state;
        this.getElements(page, limit);
      })
    );
  }

  updateElement(id: string, payload: Partial<ObsElement>) {
    return this.http.PUT(`${apiPrefix}/${id}`, payload).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        const state = this.state$.getValue();
        const { page, limit } = state;
        this.getElements(page, limit);
      })
    );
  }

  removeElement(id: string) {
    this.http.DELETE(`${apiPrefix}/${id}`).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      })
    ).subscribe(res => {
      const state = this.state$.getValue();
      const { page, limit } = state;
      this.getElements(page, limit);
    });
  }
}
