import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export type ToastType = 'success' | 'info' | 'error' | 'warning';

export interface Toast {
  type: ToastType;
  title?: string;
  body?: string;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  subject: BehaviorSubject<Toast[]>;
  toasts$: Observable<Toast[]>;

  constructor() {
    this.subject = new BehaviorSubject<Toast[]>([]);
    this.toasts$ = this.subject.asObservable().pipe(
                          filter(toast => toast !== null)
                        );
  }

  add(type: ToastType, title?: string, body?: string, delay?: number) {
    this.subject.next([...this.subject.getValue(), { type, title, body, delay }]);
  }
}
