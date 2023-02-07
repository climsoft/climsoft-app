import { PaperArchiveDefinition } from './../../../data/interface/paper-archive';
import { PaperArchive, PaperArchivesState } from '@data/interface/paper-archive';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { HttpService } from '@shared/services/http.service';
import { Injectable } from '@angular/core';

const apiPrefix = `/v1`;

@Injectable({
  providedIn: 'root'
})
export class PaperArchiveService {
  archives$: BehaviorSubject<PaperArchivesState> = new BehaviorSubject<PaperArchivesState>({ archives: [], limit: 10, page: 1, pages: 1 });
  public init = false;

  constructor(private http: HttpService) {
    const state = this.archives$.getValue();
    this.getArchives(state.page, state.limit);
  }

  get archives(): Observable<PaperArchivesState> {
    return this.archives$.asObservable();
  }

  getArchives(page: number, limit: number) {
    console.log(page, limit);
    const offset = (page - 1) * limit;
    this.http.GET(`${apiPrefix}/paper-archives?limit=${limit}&offset=${offset}`).subscribe((res: any) => {
      console.log(res);
      this.archives$.next({ archives: res.result, limit, page: res.page, pages: res.pages });
      this.init = true;
    });
  }

  getStationArchives(id: string): Observable<any> {
    return this.http.GET(`${apiPrefix}/paper-archives?belongs_to=${id}`);
  }

  updateState(state: { page?: number, limit?: number }) {
    if(state.page) {
      const limit = this.archives$.getValue().limit;
      this.getArchives(state.page, limit);
    }
    if(state.limit) {
      this.getArchives(1, state.limit);
    }
  }

  addArchive(payload: Partial<PaperArchive>): Observable<any> {
    return this.http.POST(`${apiPrefix}/paper-archives`, { ...payload }).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      }),
      tap(res => {
        console.log(res);
        const state = this.archives$.getValue();
        const { page, limit } = state;
        this.getArchives(page, limit);
      })
    );
  }

  getArchive(pa: PaperArchive): Observable<PaperArchive | any> {
    const url = `${apiPrefix}/paper-archives/${pa.belongs_to}/${pa.form_datetime}/${pa.classified_into}`;
    return this.http.GET(url);
  }

  updateArchive(pa: PaperArchive, payload: Partial<PaperArchive>): Observable<any> {
    const url = `${apiPrefix}/paper-archives/${pa.belongs_to}/${pa.form_datetime}/${pa.classified_into}`;
    return this.http.PUT(url, payload).pipe(
              catchError((err) => {
                throw new Error(err.error.message);
              }),
              tap(res => {
                const state = this.archives$.getValue();
                const { page, limit } = state;
                this.getArchives(page, limit);
              })
            );
  }

  removeArchive(pa: PaperArchive) {
    const url = `${apiPrefix}/paper-archives/${pa.belongs_to}/${pa.form_datetime}/${pa.classified_into}`;
    this.http.DELETE(url).pipe(
      catchError((err) => {
        throw new Error(err.error.message);
      })
    ).subscribe(res => {
      const state = this.archives$.getValue();
      const { page, limit } = state;
      this.getArchives(page, limit);
    });
  }

  searchDefinitions(query: string) {
    return this.http.GET(`${apiPrefix}/paper-archive-definitions/search?query=${query}`);
  }
}
