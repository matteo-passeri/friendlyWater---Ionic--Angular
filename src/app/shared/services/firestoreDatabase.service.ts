import { Injectable, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../user.model';
import { GeolocationPosition } from '@capacitor/core';
import * as GeoFirestore from 'geofirestore';
import { BehaviorSubject, of } from 'rxjs';
import * as firebase from 'firebase/app';

// import { MapComponent } from '../map/map.component';

@Injectable({
  providedIn: 'root'
})
export class FireServiceDb {

  public markers: any;

  public addingMarker = false;

  // private map: any;

  // public lat: number;
  // public lng: number;

  markersDbRef: any;
  newMarkersDbRef: any;
  usersDbRef: any;
  usersLocationDbRef: any;

  geoFire: any;

  markersArray = [];
  // observableMarkersArray: BehaviorSubject<Array<any>>;
  observableMarkersArray = of(this.markersArray);


  userID: any = null;
  markerID: any;

  radius = new BehaviorSubject(0.5);



  constructor(public firestoreDb: AngularFirestore) {
    // Reference database location for GeoFirestore
    // this.markersDbRef = this.firestoreDb.collection('/markers').doc(this.markerID);

    if (this.userID) {
      this.usersLocationDbRef = this.firestoreDb.collection('/usersLocation').doc('usersLocation');
    }

    this.markersDbRef = this.firestoreDb.collection('/markers');
    this.newMarkersDbRef = this.firestoreDb.collection('/markers');

    // this.markersArray = new BehaviorSubject<Array<any>>(null);
  }

  /*
  ionDidLoad(): void {
    let mapComponent: MapComponent;
    this.map = mapComponent.map;
  }
  */

  setUsersLocation(userID, coords) {
    if (this.userID != null) {
      this.usersLocationDbRef.set(userID, coords)
        .then(_ => console.log('userLocation UPDATED'))
        .catch(err => console.log(err));
    } else {
      this.userID = userID;
      this.usersLocationDbRef = this.firestoreDb.collection('/usersLocation').doc('usersLocation');
      this.usersLocationDbRef.set(userID, coords)
        .then(_ => console.log('userLocation UPDATED'))
        .catch(err => console.log(err));
    }

  }


  getObjectsInRadius(radius: number, coords: Array<number>) {}


  addNewMarker(lat, lng) {
    const markerName = lat.toString() + '+' + lng.toString();
    this.newMarkersDbRef = this.firestoreDb.collection('/markers').doc(markerName);

    const newMarker = {lat, lng};
    this.newMarkersDbRef.set(newMarker);
    // const showNewMarker = new google.maps.Marker({position: centerLatLng, map: this.map);
    console.log('Marker Added');
  }

  loadMarkers(): Promise<any> {
      this.firestoreDb.collection('/markers').ref.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {

              // console.log('adding');
              const marker = doc.data();
              this.markersArray.push(marker);
              // console.log(this.markersArray);
            });
        });
      return Promise.resolve(this.markersArray);
  }
  getMarkersArray() {
    this.observableMarkersArray = of(this.markersArray);
    return this.observableMarkersArray;
  }


  recordUserLocation(userLocationRecord) {
    // return this.firestoreDb.collection(this.usersDbRef).add(userLocationRecord);
  }
}
