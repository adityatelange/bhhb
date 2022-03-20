import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileHandleService {

  constructor() { }

  private selectedFile!: File;
  private selectedFileName!: string;
  private selectedFileContent!: string | ArrayBuffer | null;

  private selectedFileData = new Subject<{ selectedFileName: string, selectedFileContent: string | ArrayBuffer | null }>();

  getselectedFileDataListener() {
    return this.selectedFileData.asObservable();
  }

  async fileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files) {
      if (!files.length) return

      this.selectedFile = files[0]

      console.log(this.selectedFile);

      this.selectedFileName = this.selectedFile.name

      var reader = new FileReader();
      reader.readAsText(this.selectedFile);
      reader.onload = (_event) => {
        console.log(reader.result);

        this.selectedFileContent = reader.result
        this.selectedFileData.next({
          selectedFileName: this.selectedFileName,
          selectedFileContent: this.selectedFileContent
        })
      }
    }
  }
}
