import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { HttpService } from '@shared/services/http.service';
import { PaperArchiveDefinition, PaperArchiveDefinitionState } from '@data/interface/paper-archive';

const apiPrefix = `climsoft/v1`;

@Injectable({
  providedIn: 'root'
})
export class ArchiveDefinitionService {
  definitions$: BehaviorSubject<PaperArchiveDefinitionState> = new BehaviorSubject<PaperArchiveDefinitionState>({ definitions: [], limit: 10, page: 1, pages: 1 });
  public init = false;

  constructor(private http: HttpService) {
    const state = this.definitions$.getValue();
    this.getDefinitions(state.page, state.limit);
  }

  get definitions(): Observable<PaperArchiveDefinitionState> {
    return this.definitions$.asObservable();
  }

  getDefinitions(page: number, limit: number) {
    console.log(page, limit);
    const offset = (page - 1) * limit;
    this.http.GET(`${apiPrefix}/paper-archive-definitions?limit=${limit}&offset=${offset}`).subscribe((res: any) => {
      console.log(res);
      this.definitions$.next({ definitions: res.result, limit, page: res.page, pages: res.pages });
      this.init = true;
    });
  }

  addDefinition(payload: PaperArchiveDefinition): Observable<any> {
    return this.http.POST(`${apiPrefix}/paper-archive-definitions`, payload).pipe(
      tap(() => {
        const state = this.definitions$.getValue();
        this.getDefinitions(state.page, state.limit)
      })
    );
  }

  updateDefinition(form_id: string, desc: { description: string}): Observable<any> {
    return this.http.PUT(`${apiPrefix}/paper-archive-definitions/${form_id}`, desc).pipe(
      tap(() => {
        const state = this.definitions$.getValue();
        this.getDefinitions(state.page, state.limit)
      })
    );
  }

  removeDefinition(form_id: string) {
    this.http.DELETE(`${apiPrefix}/paper-archive-definitions/${form_id}`).pipe(
      tap(() => {
        const state = this.definitions$.getValue();
        this.getDefinitions(state.page, state.limit)
      })
    ).subscribe();
  }

  updateState(state: { page?: number, limit?: number }) {
    if(state.page) {
      const limit = this.definitions$.getValue().limit;
      this.getDefinitions(state.page, limit);
    }
    if(state.limit) {
      this.getDefinitions(1, state.limit);
    }
  }
}
