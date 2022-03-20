import { Component, OnInit } from '@angular/core';
import { FileHandleService } from "../../services/file-handle/file-handle.service"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private FileHandleService: FileHandleService) { }

  ngOnInit(): void {
  }

  selectedFileName!: string;

  fileChanged(event: Event): void {
    this.FileHandleService.fileChange(event)
      .then(() => { })
      .catch(() => { })
  }
}
