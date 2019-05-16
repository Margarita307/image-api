import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImageService } from '../upload.service';
import { PreviewDataList } from '../models/previewDataList.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html'
})
export class UploadComponent {
  uploadForm: FormGroup;
  uploadResponse = { status: '', message: '', filePath: '' };
  invalidMimeType: boolean = false;
  previewDataList: PreviewDataList = new PreviewDataList();
  
  constructor(private formBuilder: FormBuilder, private uploadService: ImageService) {
  }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      files: ['']
    });
  }

  onSelectedFile(event) {
    this.clearAll();

    const files = event.target.files;

    if (files.length === 0) return;

    for (let file of files) {
      var mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        this.invalidMimeType = true;
        return;
      }
    }

    this.invalidMimeType = false;
    this.previewDataList.Fill(files);
    this.uploadForm.get('files').setValue(files);
  }

  onSubmit() {
    const formData = new FormData();

    let files: File[] = this.uploadForm.get('files').value;

    Array.from(files).map((file, index) => {
      return formData.append('file' + index, file, file.name);
    });

    this.uploadService.upload(formData).subscribe(
      (res) => { this.uploadResponse = res; },
      (err) => { this.uploadResponse.status = 'error', this.uploadResponse.message = err }
    );
  }

  clearAll() {
    this.previewDataList = new PreviewDataList();
    this.uploadResponse = { status: '', message: '', filePath: '' };
  }
}
