import { Injectable } from '@angular/core';

import { auth } from 'firebase';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {


  public lat: number;
  public lng: number;

  public currentUser: BehaviorSubject<any>;

  private loggedIn: BehaviorSubject<boolean>;

  constructor(private afAuth: AngularFireAuth,
              private afsDb: AngularFirestore,
              private router: Router) {
                this.initLogin();

                this.loggedIn = new BehaviorSubject<boolean>(false);
                this.currentUser = new BehaviorSubject<any>(null);
              }


  // initialize
  initLogin() {
    auth().onAuthStateChanged(user => {
      if (user) {
        // User Logged In
        // console.log('Into user, Logged In, User: ', user);

        try {
          const userProvider = auth().currentUser.providerData[0].providerId;
          if (userProvider === 'password') {
            this.loggedIn.next(true);
            console.log('Logged-In-User, getUserProvider: ', userProvider);
            // console.log(this.loggedIn);
            return user;
          }
          else {
            this.loggedIn.next(false);
            console.log('Anonymous User, getuserprovider: ', userProvider);
            return user;
          }
        } catch (error) {
          console.log(error);
        }

        this.currentUser.next(user);

      } else {
        // No user Logged in
        this.anonLogin();
        this.currentUser.next(user);

        console.log('No Logged In User, but Anonymous1: ', user);
        return user;
      }


    });
  }


  // anonymous authentication
  anonLogin() {
    this.afAuth.signInAnonymously().then(res => {
            this.currentUser.next(res.user);
            // console.log('Anonymous User: ', this.currentUser);
    });
  }


  async isAnonymousF() {
    const isAnonymousBoolean = auth().currentUser.isAnonymous;
    // console.log('isAnonymousBoolean: ', isAnonymousBoolean);
    return isAnonymousBoolean;
  }


  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);

    return this.updateUserData(credential.user);
  }

  async createUserWithEmailAndPassword(email, password) {
    this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async signInWithEmailAndPassword(email, password) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Signed In.');
    } catch (error) {
      console.log('Signed In Error: ', error);
    }
  }

  private updateUserData(user) {
    // sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afsDb.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      username: user.username,
      latitude: this.lat,
      longitude: this.lng,
      active: true
    };

    return userRef.set(data, { merge: true });
  }

  signOut() {
     this.anonLogin();
  }


  getLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser.asObservable();
  }
}
