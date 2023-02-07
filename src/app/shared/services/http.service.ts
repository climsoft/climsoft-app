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
  private database: string = '';

  constructor(protected http: HttpClient) { }

  public createDefaultOptions(): Options {
    let defaults = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
    return defaults;
  }

  public setDatabase(db: string) {
    this.database = db;
  }

  public getDatabase() {
    return this.database;
  }

  POST<T, R>(path: string, data: T, options?: any): Observable<R> {
    return this.http
      .post<R>(
        `${this.API_BASE}/${this.getDatabase()}${path}`,
        data,
        options ? { headers: new HttpHeaders(options) } : this.createDefaultOptions()
      );
  }

  PUT<T, R>(path: string, data: T): Observable<R> {
    return this.http
      .put<R>(
        `${this.API_BASE}/${this.getDatabase()}${path}`,
        data,
        this.createDefaultOptions()
      );
  }

  GET<T>(path: string): Observable<T> {
    return this.http.get<T>(
      `${this.API_BASE}/${this.getDatabase()}${path}`,
      this.createDefaultOptions()
    );
  }

  DELETE<R>(path: string): Observable<any> {
    return this.http.delete(
      `${this.API_BASE}/${this.getDatabase()}${path}`,
      );
  }

  UPLOAD_TO_S3(image: File, attr: string) {
    const path = `/${this.getDatabase()}/v1/file-upload/image`;
    var formData = new FormData();
    formData.append('name', image.name);
    formData.append('file', image);

    return this.http.post(
      `${this.API_BASE}/${path}`,
      formData,
      { reportProgress: true, observe: 'events' }
    );
  }
}
