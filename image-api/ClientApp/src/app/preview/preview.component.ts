import { Component, OnInit, Input } from '@angular/core';
import { PreviewData } from '../models/previewData.model';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @Input() data: PreviewData[];

  constructor() {}

  ngOnInit() {
  }

}
