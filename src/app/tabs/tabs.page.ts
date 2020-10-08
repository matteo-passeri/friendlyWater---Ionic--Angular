import { Component } from '@angular/core';

import { ViewChild, ElementRef } from '@angular/core';

import { Observable, of, BehaviorSubject } from 'rxjs';

import { Router } from '@angular/router';

import { FirebaseAuthService } from '../shared/services/firebase-auth.service';
import { Capacitor } from '@capacitor/core';
import { ToastController, AlertController } from '@ionic/angular';
import { FireServiceDb } from '../shared/services/firestoreDatabase.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('map') mapElement: ElementRef;

  currentUser = null;

  private addingMarker: BehaviorSubject<boolean>;

  constructor(private firebaseAuthService: FirebaseAuthService,
              private fireServiceDb: FireServiceDb,
              private router: Router,
              private alertCtrl: AlertController,
              private toastController: ToastController,
              ) {
                this.addingMarker =  new BehaviorSubject<boolean>(false);
              }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
  
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

  async addMarker() { // (centerLat: number, centerLng: number)
    // if the user is anonymous
    if (await this.firebaseAuthService.isAnonymousF()) {
      console.log('You have to log in to add a marker.');
      this.showConfirmDialog('You have to Log In', '', 'You have to log in to add a marker.');
    } else {
      // call the function addMarker() in map.component
      // add a listener inside mapComponent
      console.log('AddAMarker');
      this.addingMarker.next(true);
    }
    this.presentToast("Marker Added");
  }


  // chat
  async openChat() {
    if (await this.firebaseAuthService.isAnonymousF()) {
      console.log('You have to log in to enter the chat.');

      this.showConfirmDialog('You have to Log In', '', 'You have to log in to enter the chat.');
    } else {
      console.log('You\'re enter the chat');
    }
    this.presentToast("Chat Coming Soon");
  }

  getAddingMarker(): Observable<boolean> {
    return this.addingMarker.asObservable();
  }



}
