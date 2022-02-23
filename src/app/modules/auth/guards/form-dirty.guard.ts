import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { first, Observable, Subject, of, ObservableInput } from 'rxjs';

import { IDeactivateComponent } from './../../../data/interface/deactivate-component';

@Injectable({
  providedIn: 'root'
})
export class FormDirtyGuard implements CanDeactivate<IDeactivateComponent> {
  unSaved: boolean = true;

  constructor() { }
  canDeactivate(
    component: IDeactivateComponent
  ): ObservableInput<boolean> | Promise<boolean> | boolean | any {
    return component.canExit? component.canExit() : true;
  }
}
