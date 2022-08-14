import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {

  constructor(private readonly SwUpdate: SwUpdate, private _snackBar: MatSnackBar) {
    if (environment.production) {
      this.SwUpdate.checkForUpdate().then(() => {
        const message = 'App Update available! Choose Ok to update';
        this._snackBar.open(message, "Ok", {
          duration: 3000
        })
          .onAction()
          .subscribe(() => {
            this.SwUpdate.activateUpdate().then(() => document.location.reload());
          })
      });
    }
  }
}
