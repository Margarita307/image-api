import { Component } from '@angular/core';
import { PreviewDataList } from '../models/previewDataList.model';
import { ImageService } from '../upload.service';

@Component({
  selector: 'app-url-upload',
  templateUrl: './url-upload.component.html'
})
export class UrlUploadComponent {
  loadError: string;
  uploadResponse = { status: '', message: '', filePath: '' };
  previewDataList: PreviewDataList = new PreviewDataList();
  imageUrl: string = '';
  urlPattern = "^(http[s]?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$";
  file: File;

  constructor(private uploadService: ImageService) {
  }

  onUrlChanged() {
    this.clearAll();

    this.uploadService.get(this.imageUrl).subscribe(
      (res) => { this.file = res; this.previewDataList.Fill([res]) },
      (err) => this.loadError = err
    );
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.file);

    this.uploadService.upload(formData).subscribe(
      (res) => this.uploadResponse = res,
      (err) => { this.uploadResponse.status = 'error', this.uploadResponse.message = err }
    );
  }

  clearAll() {
    this.previewDataList = new PreviewDataList();
    this.uploadResponse = { status: '', message: '', filePath: '' };
    this.loadError = '';
  }
}
