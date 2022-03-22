import { Modes } from './../../../../data/enum/app-mode';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { UserState } from './../../../../data/interface/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  modes = Modes;
  model$: Observable<UserState> = this.userService.state$;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    console.log('Profile View Init');

  }
}
