import { ScreenSize, ScreenSizes } from './../../data/enum/screen-size';
import { distinctUntilChanged, Observable, BehaviorSubject, Subject } from 'rxjs';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  mediaQuery: BehaviorSubject<string> = new BehaviorSubject(this.getScrSize(window.innerWidth));

  get screenSize(): Observable<string> {
    return this.mediaQuery.asObservable();
  }

  constructor() {}

  onResize(width: number) {
    let size = this.getScrSize(width);
    this.mediaQuery.next(size);
  }

  private getScrSize(w: number) {
    let size = 'xs';
    for(const s of ScreenSizes) {
      if(w >= s.min && w < s.max) {
        size = s.name;
      }
    }
    return size;
  }
}
