import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../shared/user.model';

import { FirebaseAuthService } from '../shared/services/firebase-auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  cpassword = '';

  isShow = false;

  constructor(
    public auth: FirebaseAuthService,
    private alert: AlertController,
    private router: Router) {
                }

  ngOnInit() {
  }

  async register() {
    const { email, password, cpassword } = this;
    if (password !== cpassword) {
      this.showAlert('Error!', 'Passwords not matching');
      return console.error('Passwords not matching');
    }

    try {
    const res = await this.auth.createUserWithEmailAndPassword(email, password);
    console.log(res);
    this.showAlert('Success!', 'User created!');
    // this.router.navigate(['/login']); better next line instead:
    this.loginRegisterSwitcher();
    } catch (err) {
      console.dir(err);

      this.showAlert('Error!', err.message);
      }

  }

  async login() {
    const { email, password } = this;

    if (password.length < 6) {
      this.showAlert('Error!', 'Password too short');
      return console.error('Password too short');
    }

    try {
      const res = await this.auth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/tabs']);
    }
      catch (err) {
      console.dir(err);
      if (err.code === 'auth/user-not-found') {
        console.log('User not found');

        this.showAlert('Error!', err.message);
      }
    }
  }


  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }

  loginRegisterSwitcher() {
    this.isShow = !this.isShow;
  }


}
