import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ImageService {
  SERVER_URL: string;

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.SERVER_URL = baseUrl;
  }

  public get(imageUrl: string) {
    let customMessage = 'Failed to load image';

    return this.httpClient
      .get(imageUrl, { responseType: 'blob' })
      .pipe(
        catchError(this.handleError(customMessage))
      );
  }

  public upload(data) {
    let customMessage = 'Upload failed. Please try again later';
    let uploadUrl = `${this.SERVER_URL}api/upload`;

    return this.httpClient.post<any>(uploadUrl, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map(event => this.getEventMessage(event, data)),
      catchError(this.handleError(customMessage))
    );
  }

  private getEventMessage(event: HttpEvent<any>, data) {

    switch (event.type) {

      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);

      case HttpEventType.Response:
        return this.apiResponse(event);

      default:
        return { status: '', message: `File "${data}" surprising upload event: ${event.type}.` };
    }
  }

  private fileUploadProgress(event) {
    const percentDone = Math.round(100 * event.loaded / event.total);
    return { status: 'progress', message: percentDone };
  }

  private apiResponse(event) {
    return { status: 'response', message: 'Upload successfull' }; 
  }

  private handleError(customMessage: string) {
    return (error: any): Observable<any> => {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return Observable.throw(customMessage);
    };
  }
}
