import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  uploadOptions = ['Choose files', 'Enter URL'];
  selectedUploadOption = this.uploadOptions[0];

}
