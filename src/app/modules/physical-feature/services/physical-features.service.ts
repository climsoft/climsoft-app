import { HttpService } from './../../../shared/services/http.service';
import { BehaviorSubject, Observable, catchError, tap, map } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  PhysicalFeature,
  PhysicalFeatureState,
  PhysicalFeatureClass
} from '@data/interface/physical-features';

const apiPrefix = `/v1`;

@Injectable({
  providedIn: 'root'
})
export class PhysicalFeaturesService {
  features$: BehaviorSubject<PhysicalFeatureState> = new BehaviorSubject<PhysicalFeatureState>({ features: [], limit: 10, page: 1, pages: 1 });
  public init = false;

  constructor(private http: HttpService) {
    const state = this.features$.getValue();
    this.getFeatures(state.page, state.limit);
  }

  get features(): Observable<PhysicalFeatureState> {
    return this.features$.asObservable();
  }

  adapt(obj: PhysicalFeature | any): any {
    const keyMaps: any = {
      "associated_with": "Associated With",
      "begin_date": "Begin Date",
      "end_date": "End Date",
      "image": "Image",
      "description": "Description",
      "classified_into": "Classified Into"
    };
    return keyMaps;
  }

  getFeatures(page: number, limit: number) {
    console.log(page, limit);
    const offset = (page - 1) * limit;
    this.http.GET(`${apiPrefix}/physical-features?limit=${limit}&offset=${offset}`).subscribe((res: any) => {
      console.log(res);
      this.features$.next({ features: res.result, limit, page: res.page, pages: res.pages });
      this.init = true;
    });
  }

  updateState(state: { page?: number, limit?: number }) {
    if(state.page) {
      const limit = this.features$.getValue().limit;
      this.getFeatures(state.page, limit);
    }
    if(state.limit) {
      this.getFeatures(1, state.limit);
    }
  }

  addFeature(payload: Partial<PhysicalFeature>): Observable<any> {
    return this.http.POST(`${apiPrefix}/physical-features`, { ...payload }).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        console.log(res);
        const state = this.features$.getValue();
        const { page, limit } = state;
        this.getFeatures(page, limit);
      })
    );
  }

  getByStation(id: string): Observable<PhysicalFeatureState | any> {
    const url = `${apiPrefix}/physical-features?associated_with=${id}`;
    return this.http.GET(url);
  }

  getFeature(f: PhysicalFeature): Observable<PhysicalFeature | any> {
    const url = `${apiPrefix}/physical-features/${f.associated_with}/${f.classified_into}/${f.description}`;
    return this.http.GET(url);
  }

  updateFeature(f: PhysicalFeature, payload: Partial<PhysicalFeature>): Observable<any> {
    const url = `${apiPrefix}/physical-features/${f.associated_with}/${f.classified_into}/${f.description}`;
    return this.http.PUT(url, payload).pipe(
              catchError((err) => {
                throw new Error(err.error.message);
              }),
              tap(res => {
                const state = this.features$.getValue();
                const { page, limit } = state;
                this.getFeatures(page, limit);
              })
            );
  }

  removeFeature(f: PhysicalFeature) {
    const url = `${apiPrefix}/physical-features/${f.associated_with}/${f.classified_into}/${f.description}`;
    this.http.DELETE(url).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      })
    ).subscribe(res => {
      const state = this.features$.getValue();
      const { page, limit } = state;
      this.getFeatures(page, limit);
    });
  }

  getFeatureClasses(): Observable<PhysicalFeatureClass[]> {
    return this.http.GET(`${apiPrefix}/physical-feature-class`)
                    .pipe(
                      map((res: any) => res.result)
                    );
  }

  getStationFeatureClasses(id: number): Observable<PhysicalFeatureClass[]> {
    return this.http.GET(`${apiPrefix}/physical-feature-class?refersto=${id}`)
                    .pipe(
                      map((res: any) => res.result)
                    );
  }

  addFeatureClass(payload: PhysicalFeatureClass) {
    return this.http.POST(`${apiPrefix}/physical-feature-class`, payload);
  }

  updateFeatureClass(payload: PhysicalFeatureClass) {
    return this.http.PUT(`${apiPrefix}/physical-feature-class`, payload);
  }
}
