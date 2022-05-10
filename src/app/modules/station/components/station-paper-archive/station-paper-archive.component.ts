import { Component, EventEmitter, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PaperArchive, PaperArchivesState } from '@data/interface/paper-archive';


@Component({
  selector: 'app-station-paper-archive',
  templateUrl: './station-paper-archive.component.html',
  styleUrls: ['./station-paper-archive.component.scss']
})
export class StationPaperArchiveComponent implements OnInit, OnChanges {
  @Input() source: Observable<PaperArchivesState> = of({ archives: [], page: 1, pages: 1, limit: 25 });
  @Output() onSelect = new EventEmitter<PaperArchive>();

  items!: PaperArchive[] | any[];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.source.subscribe(res => {
      console.log(res);
      this.items = res.archives;
    })
  }

  selectArch(pa: PaperArchive) {
    this.onSelect.emit(pa);
  }
}
