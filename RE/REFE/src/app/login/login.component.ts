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
  constructor(private router: Router, private firebaseService: FirebaseService, private fireAuth: AngularFireAuth) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid)
      } else {
        console.log("no user currently logged in")
      }
    });
  }

  login(email: string, password: string) {
    console.log(
      `username: ${email}, and password is ${password}`
    );
    this.firebaseService.signIn(email, password);
  }

  logout() {
    this.firebaseService.signOut();
  }

  check() {
    console.log(this.firebaseService.checkUser());
  }


}

// john.preston@tbeatty.com ImwH@qxz56t9