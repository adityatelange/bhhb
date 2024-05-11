import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as xml2js from 'xml2js';

export interface BurpExport {
  'items': {
    '$': {
      'burpVersion': string,
      'exportTime': string
    },
    'item': Array<object>
  }
}

@Injectable({
  providedIn: 'root'
})
export class FileHandleService {

  constructor() { }

  private selectedFileName!: string | undefined;
  private selectedFileContent!: BurpExport | undefined;

  private selectedFileData = new Subject<{ selectedFileName: string, selectedFileContent: BurpExport | undefined }>();

  getselectedFileDataListener() {
    return this.selectedFileData.asObservable();
  }

  async fileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files) {
      if (!files.length) return

      this.selectedFileName = files[0].name

      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = (_event) => {
        xml2js.parseStringPromise(reader.result as string)
          .then((content) => {
            this.selectedFileContent = content;
            this.selectedFileData.next({
              selectedFileName: this.selectedFileName!,
              selectedFileContent: this.selectedFileContent
            })
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  async fileClear() {
    this.selectedFileName = undefined
    this.selectedFileContent = undefined
    this.selectedFileData.next({
      selectedFileName: this.selectedFileName!,
      selectedFileContent: this.selectedFileContent!
    })
  }
}
