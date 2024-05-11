import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileHandleService, BurpExport } from '../../services/file-handle/file-handle.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private FileHandleService: FileHandleService) { }

  fileSub!: Subscription;
  burpVersion!: string;
  exportTime!: string;

  ngOnInit(): void {
    this.fileSub = this.FileHandleService.getselectedFileDataListener()
      .subscribe((selectedFileData: { selectedFileContent: BurpExport | undefined }) => {
        if (!selectedFileData.selectedFileContent) {
          this.burpVersion = this.exportTime = '';
          return
        }
        this.burpVersion = selectedFileData.selectedFileContent!.items.$.burpVersion;
        this.exportTime = selectedFileData.selectedFileContent!.items.$.exportTime;
      })
  }

}
