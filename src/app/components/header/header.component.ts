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
  isLoading: boolean = false;

  ngOnInit(): void {
    this.fileSub = this.FileHandleService.getselectedFileDataListener()
      .subscribe((selectedFileData: { selectedFileName: string }) => {
        this.selectedFileName = selectedFileData.selectedFileName
        this.isLoading = false
      })
  }

  fileChanged(event: Event): void {
    this.isLoading = true
    this.FileHandleService.fileChange(event)
      .then(() => { })
      .catch((err) => {
        this.isLoading = false
      })
  }

  fileRemoved(): void {
    this.isLoading = true
    this.FileHandleService.fileClear()
      .then(() => {
        this.isLoading = false
      })
      .catch(() => { })
  }
}
