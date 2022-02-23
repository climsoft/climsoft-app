import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';

const host = environment.apiPrefix;

export interface Options {
  headers?: HttpHeaders;
  params?: HttpParams;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private API_BASE = environment.apiPrefix;

  constructor(protected http: HttpClient) { }

  public createDefaultOptions(): Options {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }

  POST<T, R>(path: string, data: T): Observable<R> {
    return this.http
      .post<R>(
        `${this.API_BASE}/${path}`,
        data,
        this.createDefaultOptions()
      );
  }

  PUT<T, R>(path: string, data: T): Observable<R> {
    console.log(`${this.API_BASE}/${path}`);

    return this.http
      .put<R>(
        `${this.API_BASE}/${path}`,
        data,
        this.createDefaultOptions()
      );
  }

  GET<T>(path: string): Observable<T> {
    return this.http.get<T>(
      `${this.API_BASE}/${path}`,
      this.createDefaultOptions()
    );
  }

  DELETE<R>(path: string): Observable<any> {
    return this.http.delete(
      `${this.API_BASE}/${path}`
      );
  }
}
