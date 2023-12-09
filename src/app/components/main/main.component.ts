import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FileHandleService } from '../../services/file-handle/file-handle.service'
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BurpExport } from '../../services/file-handle/file-handle.service'
import { Base64 } from 'js-base64';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private FileHandleService: FileHandleService) { }

  fileSub!: Subscription
  selectedFileContent!: BurpExport | undefined;
  displayedColumns: string[] = ['position', 'host', 'method', 'path', 'status', 'responselength', 'mimetype', 'extension', 'title', 'comment', 'ip', 'time'];
  dataSource = new MatTableDataSource();
  ELEMENT_DATA: any = [];
  clickedRow!: any;
  wrapRequest: boolean = false;
  wrapResponse: boolean = false;

  ngOnInit(): void {
    this.fileSub = this.FileHandleService.getselectedFileDataListener()
      .subscribe((selectedFileData: { selectedFileContent: BurpExport | undefined }) => {
        if (!selectedFileData.selectedFileContent) {
          this.dataSource = new MatTableDataSource();
          this.selectedFileContent = selectedFileData.selectedFileContent;
          this.clickedRow = undefined;
          return
        }
        this.selectedFileContent = selectedFileData.selectedFileContent
        // console.log(this.selectedFileContent);
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
          host: element.protocol + '://' + element.host[0]._ + this.portAssign(element.protocol, element.port),
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
          request: this.splitHeaderBody(this.atobReqRes(element.request)),
          response: this.splitHeaderBody(this.atobReqRes(element.response)),
          title: this.extractTitleFromHttpResponse(this.atobReqRes(element.response)),
        }
      )
      position += 1;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  private splitHeaderBody(text: any): any {
    // https://bobbyhadz.com/blog/javascript-split-string-only-on-first-instance-of-character
    var [header, ...body] = text.split(/\n\s*\n/)
    header = header.split(/\r\n/)

    // https://stackoverflow.com/a/12482991
    header.forEach((elem: string, index: string | number) => {
      let [key, ...value] = elem.split(": ")
      header[index] = [key, value.join("")]
    }, header);

    return [header, body.join("")]
  }

  private atobReqRes(query: any): string {
    try {
      if (query[0].$.base64 === 'true') {
        return Base64.decode(query[0]._ ?? "");
      }
      return query[0]._ ?? "";
    } catch (error) {
      console.log(error);
      console.log(query);
    }
    return ''
  }

  private portAssign(protocol: any, port: any): string {
    if (protocol[0] === "https" && port[0] === "443") {
      return ''
    } else if (protocol[0] === "http" && port[0] === "80") {
      return ''
    } else {
      return ':' + port
    }
  }

  private extractTitleFromHttpResponse(response: string): string {
    const titleRegex = /<title>(.*?)<\/title>/i;
    const match = response.match(titleRegex);
    if (match && match.length > 1) {
      return match[1];
    }
    return '';
  }

  extractBodyFromHttpResponse(clickedRow: any): any {
    let file_name = clickedRow.request[0][0][0].split(' ')[1].replace(/\//g, "#");
    let respose_headers = clickedRow.response[0];
    let content_type = "application/octet-stream";
    respose_headers.forEach((header: string[]) => {
      if (header[0] == 'Content-Type') {
        content_type = header[1];
      }
    });
    let content = clickedRow.response[1]
    var file = new File([content], file_name, { type: content_type });
    saveAs(file);
    return;
  }

  @HostListener('window:keydown.esc', ['$event'])
  clearclickedRow(event: KeyboardEvent) {
    event.preventDefault();
    this.clickedRow = undefined
  }
}
