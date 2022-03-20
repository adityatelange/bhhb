import { Component, OnInit } from '@angular/core';
import { FileHandleService } from "../../services/file-handle/file-handle.service"
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private FileHandleService: FileHandleService) { }

  fileSub!: Subscription
  selectedFileName!: string;
  selectedFileContent!: object

  ngOnInit(): void {
    this.fileSub = this.FileHandleService.getselectedFileDataListener()
      .subscribe((selectedFileData: { selectedFileName: string, selectedFileContent: object }) => {
        this.selectedFileName = selectedFileData.selectedFileName
        this.selectedFileContent = selectedFileData.selectedFileContent
        console.log(this.selectedFileContent);
      })
  }
}
