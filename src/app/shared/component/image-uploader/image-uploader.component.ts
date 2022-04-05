import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { HttpService } from './../../services/http.service';
import { catchError, Observable, Subject, tap, throwError, map, filter } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  @Input() feature!: string;
  files: File[] = [];
  progress!: number;
  loading = false;

  public uploader!: Observable<any>;

  constructor(
    private ref: ChangeDetectorRef,
    private http: HttpService
  ) { }

  ngOnInit(): void {}

  public upload(): any {
    if(!this.files.length) {
      return;
    }
    this.loading = true;
    return this.http.UPLOAD_TO_S3(this.files[0], this.feature).pipe(
      tap((event: HttpEvent<any>) => {
        console.log(event);
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if(event && event.total) {
              this.progress = Math.round(event.loaded / event.total * 100);
              console.log(`Uploaded! ${this.progress}%`);
            }
            break;
          case HttpEventType.Response:
            setTimeout(() => {
              this.progress = 0;
              this.loading = false;
            }, 1000);
        }
      }),
      filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
      map((event: HttpEvent<any> | any) => event.body),
      catchError(this.errorMgmt)
    );
  }

  onSelect(event: any) {
    this.files.push(event.addedFiles[0]);
    console.log(this.files);
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  resetMedia(e: Event) {}

  private errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
