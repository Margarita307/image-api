import { PreviewData } from "./previewData.model";

export class PreviewDataList {
  data: PreviewData[];

  constructor() { } 

  public Fill(files) { 
    this.data = new Array<PreviewData>(files.length);

    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      this.data[i] = new PreviewData();
      reader.onload = (_event) => {
        this.data[i].url = reader.result;
        let img = new Image();
        img.src = this.data[i].url;
        img.onload = (_event) => {
          this.data[i].width = img.width;
          this.data[i].height = img.height;
        };
      }
      reader.readAsDataURL(files[i]);
    }
  }
}
