import { Component } from '@angular/core';
import { PwaUpdateService } from "../app/services/pwa-update/pwa-update.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'burp-http-history-browser';
  constructor(private PwaUpdateService: PwaUpdateService) { }
}
