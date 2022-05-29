import { take } from 'rxjs/operators';
import { ObsElement } from 'src/app/data/interface/element';
import { switchMap, filter, tap, map } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { ElementService } from './../../services/element.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss']
})
export class ElementComponent implements OnInit {
  id!: string;
  element!: ObsElement;
  loading = true;
  blocks: any[] = [];

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private modalService: BsModalService,
      private elementService: ElementService
    ) { }

    ngOnInit(): void {
      this.route.params.pipe(
        switchMap(p => {
          this.id = p['id'];
          return this.elementService.getElement(p['id'])
        })
      ).pipe(
        filter(res => res.result && res.result[0]),
        take(1),
        map(res => res.result[0])
      ).subscribe(el =>{
        console.log(el);
        this.element = el;
        this.blocks = this.elementService.adapt(el);
        console.log(this.blocks);

        this.loading = false;
        // this.loadPaperArchive();
      });
    }

}
