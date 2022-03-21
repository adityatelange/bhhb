import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class FileHandleService {

  constructor() { }

  private selectedFile!: File | null;
  private selectedFileName!: string | null;
  private selectedFileContent!: object | null;

  private selectedFileData = new Subject<{ selectedFileName: string, selectedFileContent: object }>();

  getselectedFileDataListener() {
    return this.selectedFileData.asObservable();
  }

  async fileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files) {
      if (!files.length) return

      this.selectedFile = files[0]
      this.selectedFileName = this.selectedFile.name

      var reader = new FileReader();
      reader.readAsText(this.selectedFile);
      reader.onload = (_event) => {
        xml2js.parseStringPromise(reader.result as string)
          .then((content) => {
            this.selectedFileContent = content
            this.selectedFileData.next({
              selectedFileName: this.selectedFileName!,
              selectedFileContent: this.selectedFileContent!
            })
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  async fileClear() {
    this.selectedFile = null
    this.selectedFileName = null
    this.selectedFileContent = null
    this.selectedFileData.next({
      selectedFileName: null!,
      selectedFileContent: null!
    })
  }
}
