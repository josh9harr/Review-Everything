import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FirebaseService } from 'src/app/firebase.service'
import { AngularFireAuth } from "@angular/fire/auth";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private fireAuth: AngularFireAuth,
  ) { }

  checkExists;
  resetPass: boolean = false;
  clicked = 0;

  ngOnInit() {

    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.replace('/profile')
      }
    });
  }

  async login(email: string, password: string) {
    await this.firebaseService.signIn(email, password)
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.replace('/home')
      } else {
        this.checkExists = "Email and/or password is incorrect. Please try again."
      }
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  resetPassword(email: string) {
    this.firebaseService.resetPassword(email)
      .then(res => {
        this.resetPass = false;
      })
      .catch(error => {
        console.log(error)
      });
  }

  showPassword() {
    if (this.clicked % 2 == 0) {
      document.getElementById('password1').style.display = 'none';
      document.getElementById('password').style.display = 'block';
      document.getElementById('showBtn').innerText = 'Hide';
    } else {
      document.getElementById('showBtn').innerText = 'Show';
      document.getElementById('password1').style.display = 'block';
      document.getElementById('password').style.display = 'none';
    }
    this.clicked += 1;
  }



}
