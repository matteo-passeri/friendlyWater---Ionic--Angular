import { Component, AfterViewInit } from '@angular/core';

import { FireServiceDb } from '../services/firestoreDatabase.service';
import { Geolocation } from '@capacitor/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { FirebaseAuthService } from '../services/firebase-auth.service';

import { ToastController } from '@ionic/angular';

import { TabsPage } from '../../tabs/tabs.page';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  // COSTANTS
  DEFAULT_ZOOM = 14;

  // VARIABLES
  public map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;

  markerArray: any;

  // user
  userCoords = new google.maps.LatLng( 42.4, 14 );
  userMarker: google.maps.Marker;
  idLocation: any;
  userID: any = null;

  // FLAGS
  public addingMarker = true;
  alreadyLoaded = false;
  firstTime = true;

constructor(
    private fireServiceDb: FireServiceDb,
    public loading: LoadingController,
    public alertCtrl: AlertController,
    private authService: FirebaseAuthService,
    private tabsPage: TabsPage,
    private toastController: ToastController
  ) {
    this.authService.getCurrentUser().subscribe((userId) => {
      this.userID = userId;
      // console.log('User Logged IN', userId);
    });

    this.tabsPage.getAddingMarker().subscribe((addingMarker) => {
      this.addingMarker = addingMarker;

      if (this.addingMarker) {
        this.addMarker();
      }
    });

    /*
    this.fireServiceDb.getMarkersArray().subscribe((markerArrayDB) => {

        console.log('inSubscribe', JSON.stringify(this.markerArray));
        this.markerArray = markerArrayDB;
        console.log('inSubscribe', JSON.stringify(this.markerArray));

        this.loadMarkers();
        });
    */

  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  public addMarker() {
    console.log('Adding Marker');
    this.fireServiceDb.addingMarker = true;
    const centerLatLng = this.map.getCenter();
    this.fireServiceDb.addNewMarker(centerLatLng.lat(), centerLatLng.lng());
    const showNewMarker = new google.maps.Marker({
      position: centerLatLng,
      map: this.map
    });
    this.presentToast("Marker Added");
  }

  public loadMarkers() {
    this.fireServiceDb.loadMarkers()
      .then(newArray => {

          this.markerArray = newArray;
          console.log('loadMarkers, Array Loaded, ', JSON.stringify(this.markerArray));

      })
        .then(() => {

            //console.log('and here', this.markerArray);
            this.showMarkersFromDB();

        }
      );
  }
  showMarkersFromDB() {
    //console.log('and finally here');
    setTimeout (() => {
      console.log('showMarkers', JSON.stringify(this.markerArray) );

      this.markerArray.forEach(latLngObject => {

        console.log('and here end', latLngObject);
        const LatLng = new google.maps.LatLng(latLngObject.lat, latLngObject.lng);
        const showNewMarker = new google.maps.Marker({ position: LatLng, map: this.map });

      });
    }, 5000);

    // const LatLng = new google.maps.LatLng(latLng);

    // const showNewMarker = new google.maps.Marker({ position: latLng, map: this.map });
  }


  startTracking() {
    console.log('im watching');
    try {
      this.idLocation = Geolocation.watchPosition({},
        this.translateUserPosition.bind(this));
    } catch (error) {
      console.log('watchPosition, error: ', error);
    }
  }

  stopTracking() {
    Geolocation.clearWatch({
      id: this.idLocation
    });
  }


  centerToLocation(position) {
  const centerHere = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  console.log('Im centering');
  this.map.panTo(centerHere);
  }

  onMapTap(event){
    console.log('OnMapTap: ', event);
  }

  async getUserPosition() {
    const position = await Geolocation.getCurrentPosition();
    console.log('Get userPosition');

    if (this.firstTime) {
      this.centerToLocation(position);
      this.firstTime = false;
    }

    this.fireServiceDb.setUsersLocation(this.userID, position);
    return position;
  }


  recordUserPosition() {
    // record in database
    if (this.userID) {
      console.log('Translate: userID not null', this.userID);
      this.fireServiceDb.setUsersLocation(this.userID, this.userCoords);
    } else {
      console.log('Translate: userID null', this.userID);
    }
  }

  translateUserPosition(position) {
    if (position) {
    this.userCoords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    if (this.firstTime) {
      this.centerToLocation(position);
      this.firstTime = false;
    }

    if (this.userMarker) {
      this.userMarker.setPosition = this.userCoords;
    } else {
      this.userMarker = new google.maps.Marker({
        zoom: this.DEFAULT_ZOOM,
        position: this.userCoords,
        map: this.map
        });
    }
  }
  }

  launchLoader() {
    if (!this.alreadyLoaded) {
      // start the loader
      this.displayLoader()
      .then((loader: any) => {
        // get position
        return this.getUserPosition()
        .then(position => {
          this.translateUserPosition(position);

          // close loader + return position
          loader.dismiss();
          console.log('position found');
          console.log(position);

          this.alreadyLoaded = true;
          return position;
        })
        // if error
        .catch(err => {
          // close loader + return null
          loader.dismiss();
          //console.log(' no position', err);
          this.alreadyLoaded = true;
          return null;
        });
      })
      .then(position => (position instanceof Error) ? this.presentAlert(position.message) : null)
      // do not forget to handle promise rejection
      .catch(err => {
        this.presentAlert(err.message);
      }).then(() => {
        this.startTracking();
        this.recordUserPosition();
      });

      }
  }

  ngAfterViewInit(){
    this.initMap();

    this.launchLoader();

    this.loadMarkers();
  }

  async displayLoader() {
    const loading = await this.loading.create({
      message: 'Please wait...',
    });
    await loading.present();
    return loading;
  }

  private async presentAlert(message: string): Promise<HTMLIonAlertElement> {
      const alert = await this.alertCtrl.create({
        header: 'Alert!',
        subHeader: 'We\'re offline',
        message,
        buttons: ['OK']
      });
      await alert.present();
      return alert;
  }

  initMap() {
    // const startingCoords = new google.maps.LatLng(this.userGeolocation.coords.latitude, this.userGeolocation.coords.longitude);
    const startingCoords = new google.maps.LatLng(42.4, 14);

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: this.DEFAULT_ZOOM,
      center: startingCoords,
      streetViewControl: false
    });

    // this.infoWindow = new google.maps.InfoWindow();
  }



}
