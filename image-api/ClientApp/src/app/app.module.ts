import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { UrlUploadComponent } from './url-upload/url-upload.component';
import { PreviewComponent } from './preview/preview.component';
import { ImageService } from './upload.service';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    UrlUploadComponent,
    PreviewComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: AppComponent, pathMatch: 'full' }
    ])
  ],
  providers: [ImageService],
  bootstrap: [AppComponent]
}) 
export class AppModule { }
