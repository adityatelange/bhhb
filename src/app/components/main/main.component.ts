import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FileHandleService } from '../../services/file-handle/file-handle.service'
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  displayedColumns: string[] = ['position', 'host', 'method', 'path', 'status', 'responselength', 'mimetype', 'extension', 'comment', 'ip', 'time', 'port'];
  dataSource = new MatTableDataSource();
  ELEMENT_DATA: any = [];
  clickedRow!: any;

  ngOnInit(): void {
    this.fileSub = this.FileHandleService.getselectedFileDataListener()
      .subscribe((selectedFileData: { selectedFileName: string, selectedFileContent: object }) => {
        if (!selectedFileData.selectedFileContent || !selectedFileData.selectedFileName) {
          this.dataSource = new MatTableDataSource();
          this.selectedFileName = selectedFileData.selectedFileName;
          this.selectedFileContent = selectedFileData.selectedFileContent;
          this.clickedRow = undefined;
          return
        }
        this.selectedFileName = selectedFileData.selectedFileName
        this.selectedFileContent = selectedFileData.selectedFileContent
        console.log(this.selectedFileContent);
        this.elementDataGen(this.selectedFileContent)
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      })
  }

  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  elementDataGen(content: any) {
    this.ELEMENT_DATA = []
    let position = 1
    content.items.item.forEach((element: any) => {
      this.ELEMENT_DATA.push(
        {
          position: position,
          ip: element.host[0].$.ip,
          host: element.protocol + '://' + element.host[0]._,
          port: element.port,
          protocol: element.protocol,
          method: element.method,
          status: element.status,
          path: element.path,
          responselength: element.responselength,
          comment: element.comment,
          url: element.url,
          time: element.time,
          mimetype: element.mimetype,
          extension: element.extension != 'null' ? element.extension : '',
          request: this.atobReqRes(element.request),
          response: this.atobReqRes(element.response)
        }
      )
      position += 1;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  private atobReqRes(query: any): string {
    try {
      return atob(query[0]._)
    } catch (error) {
      console.log(error);
      console.log(query);
    }
    return ''
  }

  @HostListener('window:keydown.esc', ['$event'])
  clearclickedRow(event: KeyboardEvent) {
    event.preventDefault();
    this.clickedRow = undefined
  }
}
