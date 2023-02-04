import { Component, OnInit } from '@angular/core';
import { FileHandleService } from "../../services/file-handle/file-handle.service"
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private FileHandleService: FileHandleService, public dialog: MatDialog) { }

  fileSub!: Subscription
  selectedFileName!: string;
  isLoading: boolean = false;

  ngOnInit(): void {
    if (localStorage.getItem("gotIt") != "true") {
      this.infoDialog()
    }
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

  infoDialog() {
    if (this.dialog.openDialogs.length == 0) {
      this.dialog.open(InfoDialogComponent, {
        width: '900px',
      });
    }
  }
}

@Component({
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent {
  gotIt() {
    localStorage.setItem("gotIt", "true")
  }
}
