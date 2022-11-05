import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { delay, filter } from 'rxjs/operators';

@Component({
  selector: 'app-data-entry-base',
  templateUrl: './data-entry-base.component.html',
  styleUrls: ['./data-entry-base.component.scss']
})
export class DataEntryBaseComponent implements OnInit {

  tabs = [
    { name: 'Hourly', route: 'hourly', index: 0 },
    { name: 'Hourly Wind', route: 'hourly-wind', index: 1 },
    { name: 'Daily', route: 'daily', index: 2 },
    { name: 'Monthly', route: 'monthly', index: 3 },
    // { name: 'Synoptic Carribiean', route: 'synoptic-carribiean', index: 4 },
    { name: 'Synoptic 2 RA1', route: 'synoptic-2ra1', index: 5 },
    { name: 'Agro', route: 'agro', index: 6 }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // const tabIndex = this.tabs.map(t => `/data-entry/${t.route}`);
    // this.router.events.pipe(
    //   filter(ch => ch instanceof NavigationEnd),
    //   delay(200)
    // ).subscribe((rc: any) => {
    //   this.activeTab = tabIndex.indexOf(rc.url);
    // });
  }

}
