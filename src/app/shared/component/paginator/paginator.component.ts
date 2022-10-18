import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() limits?: number[] = [10, 20, 30, 50];
  @Input() limit?: number = 10;
  @Input() current: number = 1;
  @Input() pages: number[] = [1];
  @Output() onPage = new EventEmitter<any>();

  // pages: number[] = [];

  constructor() {
  }

  ngOnInit(): void {
    // if(this.total === 1) {
    //   this.pages = [1];
    // } else {
    //   let pages: number[] = [];
    //   for(let i=1; i<=this.total; i++) {
    //     pages.push(i);
    //   }
    //   // let prev = this.current - 1;
    //   // let next = this.current + 1;
    //   // for (let i = prev; i <= next; i++) {
    //   //   if (i > this.total) continue;
    //   //   if (i === 0) i = 1;
    //   //   pages.push(i);
    //   // }
    //   console.log(pages);
    //   this.pages = pages;
    // }
  }

  pageChange(page: any) {
    if(page === '...') {
      return;
    }
    this.current = page;
    this.ngOnInit();
    this.onPage.emit({ page });
  }

  onLimit(limit: number) {
    this.limit = limit;
    this.onPage.emit({ limit });
  }

  getPages(): any[] {
    if(this.pages.length <= 10) {
      return this.pages;
    }

    var current = this.current,
        last = this.pages.length,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
  }
}
