import { StationElementsState } from './../../../../data/interface/station-element';
import { Observable, of } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { StationElementService } from './../../services/station-element.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-station-elements',
  templateUrl: './station-elements.component.html',
  styleUrls: ['./station-elements.component.scss']
})
export class StationElementsComponent implements OnInit {
  stationElements$: Observable<StationElementsState> = of({ elements: [], limit: 1, page: 1, pages: 1 });

  constructor(private stElementsService: StationElementService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.stationElements$ = this.stElementsService.stationElements$;
  }

  onPage(data: any) {
    console.log(data);
    this.stElementsService.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }

  preview(sel: any) {}

  edit(sel: any) {}

  remove(sel: any) {}
}
