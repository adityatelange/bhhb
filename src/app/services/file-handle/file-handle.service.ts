import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileHandleService {

  constructor() { }

  private selectedFile!: File;
  private selectedFileName!: string;

  async fileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files) {
      if (!files.length) return

      this.selectedFile = files[0]

      console.log(this.selectedFile);

      this.selectedFileName = this.selectedFile.name
    }
  }
}
