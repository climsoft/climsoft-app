import { HttpService } from '@shared/services/http.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PaperArchiveService } from '@paper-archive/services/paper-archive.service';
import { PaperArchive } from '@data/interface/paper-archive';
import { Subject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

// const apiPrefix = `climsoft/`;

@Component({
  selector: 'app-archive-viewer',
  templateUrl: './archive-viewer.component.html',
  styleUrls: ['./archive-viewer.component.scss']
})
export class ArchiveViewerComponent implements OnInit {
  @Input() archive!: PaperArchive;
  public onClose: Subject<any> = new Subject();

  constructor(private dialogRef: BsModalRef, private http: HttpService, private archiveService: PaperArchiveService) { }

  ngOnInit(): void {
  }

  get imageSrc(): string {
    return `${this.http.getDatabase()}${this.archive.image}`;
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.dialogRef.hide();
  }
}
