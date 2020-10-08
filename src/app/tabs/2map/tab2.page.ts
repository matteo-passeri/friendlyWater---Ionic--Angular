import { Component, NgZone } from '@angular/core';
import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { Observable, of, from, Subscription } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import { LoadingController, AlertController } from '@ionic/angular';
import { MapComponent } from 'src/app/shared/map/map.component';
import { auth } from 'firebase';
import { FirebaseAuthService } from '../../shared/services/firebase-auth.service';
import { Router } from '@angular/router';

import { ProfileModalComponent } from '../../shared/profile-modal/profile-modal.component';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { ToastController } from '@ionic/angular';

const { Toast, Geolocation } = Capacitor.Plugins;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  alreadyLoaded = false;

  public loggedIn: boolean;

  constructor(
              public loading: LoadingController,
              public alertCtrl: AlertController,
              private authService: FirebaseAuthService,
              private router: Router,
              public dialog: MatDialog,
              private zone: NgZone,
              private toastController: ToastController
              ) {
                this.authService.getLoggedIn().subscribe((loggedIn) => {
                  this.loggedIn = loggedIn;
                });
              }



  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  // Toolbar Menu
  onClickToolbarMenu() {
    if (this.loggedIn) {
      this.openProfile();

      console.log('PUSHED!');
    } else {
      this.showConfirmDialog('You have to Log In', '', 'You have to Log In to access the Profile.');
    }
  }

  onClickLogout() {
    this.authService.anonLogin();
    this.loggedIn = false;
    this.presentToast("Logged Out");
  }


  // alert for login
  async showConfirmDialog(title, subTitle, message) {
    await this.alertCtrl.create({
      header: title,
      subHeader: subTitle,
      message,
      buttons: [
        {
          text: 'Log In', handler: () => {
            this.router.navigateByUrl('/tabs/login');
          }
        },
        {
          text: 'Cancel'
        },
      ]
      })
    .then(res => res.present());
  }


  openProfile(): void {
    this.presentToast("Profile Coming Soon");

    /* const dialogConfig = new MatDialogConfig();

    // dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    // dialogConfig.disableClose = true;
    dialogConfig.position = {
      top: '0',
      right: '0'
    };

    let profileDialogRef: any;

    this.zone.run(() => {
      profileDialogRef = this.dialog.open(ProfileModalComponent,
        dialogConfig
      );
    });

    profileDialogRef.afterClosed(); */

  }


}
