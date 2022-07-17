import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

import { HttpService } from './../../../shared/services/http.service';
import { UserProfile, UserPreferences } from './../../../data/interface/user';
import { Locale } from './../../../data/enum/app.locale';
import { AppMode } from './../../../data/enum/app-mode';
import { UserState } from 'src/app/data/interface/user';
import { ProfileLoadingComponent } from './../components/profile-loading/profile-loading.component';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  state!: BehaviorSubject<UserState>;

  get state$(): Observable<UserState> {
    return this.state.asObservable();
  }

  constructor(private modalService: BsModalService,
              private cookieService: CookieService,
              private translate: TranslateService,
              private http: HttpService) {
    this.initState();
  }

  initState() {
    const mockState = {
      profile: {
        firstName: 'Ian',
        lastName: 'Edwards',
        email: 'ian@opencdms.org',
        userId: 'admin'
      },
      preferences: {
        mode: this.cookieService.get(environment.APP_MODE_COOKIE) ? +this.cookieService.get(environment.APP_MODE_COOKIE) : AppMode.CLIMSOFT,
        locale: Locale.EnglishGreatBritain,
        language: Locale.EnglishGreatBritain
      }
    };
    this.state = new BehaviorSubject<UserState>(mockState);
  }

  updateProfile(profile: Partial<UserProfile>) {
    this.updateState({
      preferences: this.state.value.preferences,
      profile: { ...this.state.value.profile, ...profile }
    });
  }

  updatePreferences(preferences: Partial<UserPreferences>) {
    if(preferences.language) {
      this.translate.use(preferences.language);
    }
    this.updateState({
      preferences: { ...this.state.value.preferences, ...preferences },
      profile: this.state.value.profile
    });
  }

  private updateState(newState: UserState) {
    const dialogConfig: ModalOptions = {
      initialState: {},
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false
    };
    let loader: BsModalRef;
    of(true).pipe(
      tap(() => {
        loader = this.modalService.show(ProfileLoadingComponent, dialogConfig);
      }),
      delay(1500)
    ).subscribe(ope => {
      this.state.next(newState);
      this.cookieService.set(environment.APP_MODE_COOKIE, `${newState.preferences.mode}`);
      loader.hide();
    });
  }
}
