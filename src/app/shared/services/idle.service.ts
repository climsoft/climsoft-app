import { HttpService } from '@shared/services/http.service';
import { take } from 'rxjs/operators';
import { fromEvent, merge, Observable, Subscription, Subject, timer, filter } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idle: Observable<any> = new Observable();
  private timer :Subscription = new Subscription();
  private timeOutMilliSeconds: number = 1000;
  private idleSubscription: Subscription = new Subscription();
  public expired: Subject<boolean> = new Subject<boolean>();
  public refreshAPI: Subject<number> = new Subject<number>();
  private hasExpired = false;

  constructor(private http: HttpService) {}

  public startWatching(timeOutSeconds : number): Observable<any> {
    this.idle = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keyup'),
      fromEvent(document, 'DOMMouseScroll'),
      fromEvent(document, 'mousewheel'),
      fromEvent(document, 'touchmove'),
      fromEvent(document, 'MSPointerMove'),
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'resize'),
    );
    this.timeOutMilliSeconds = timeOutSeconds * 1000;
    this.idleSubscription = this.idle.subscribe((res) => {
      this.resetTimer();
      if(res && this.hasExpired) {
        this.refreshAPI.next(new Date().getTime());
      }
    });
    this.startTimer();
    return this.expired;
  }

  private startTimer() {
   this.timer = timer(this.timeOutMilliSeconds, this.timeOutMilliSeconds).subscribe((res) => {
      this.expired.next(true);
      this.hasExpired = true;
    });
  }

  public resetTimer() {
    this.timer.unsubscribe();
    this.startTimer();
    this.expired.next(false);
  }

  public stopTimer() {
    this.timer.unsubscribe();
    this.idleSubscription.unsubscribe();
    this.refreshAPI.unsubscribe();
  }

  public setExpired(f: boolean) {
    this.hasExpired = f;
  }

  awake() {
    const apiPrefix = `/v1/flags`;
    this.http.GET(`${apiPrefix}`)
        .pipe(take(1))
        .subscribe(() => {
          this.resetTimer();
          this.setExpired(false);
        });
  }
}
