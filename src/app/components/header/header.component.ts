import { Component, OnInit } from '@angular/core';
import { FileHandleService } from "../../services/file-handle/file-handle.service"
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private FileHandleService: FileHandleService) { }

  fileSub!: Subscription
  selectedFileName!: string;

  ngOnInit(): void {
    this.fileSub = this.FileHandleService.getselectedFileDataListener()
      .subscribe((selectedFileData: { selectedFileName: string }) => {
        this.selectedFileName = selectedFileData.selectedFileName
      })
  }

  fileChanged(event: Event): void {
    this.FileHandleService.fileChange(event)
      .then(() => { })
      .catch(() => { })
  }

  fileRemoved(): void {
    this.FileHandleService.fileClear()
      .then(() => { })
      .catch(() => { })
  }
}
