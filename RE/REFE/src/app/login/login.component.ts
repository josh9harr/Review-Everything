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
  checkExists;
  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {

      } else {
      }
    });
  }

  async login(email: string, password: string) {
    await this.firebaseService.signIn(email, password)
    // await this.delay(1000);
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate(['/home'])
      } else {
        this.checkExists = "Email and/or password is incorrect"
        console.log("User is not logged in")
      }
    });
  }

  logout() {
    this.firebaseService.signOut();
  }

  check() {
    console.log(this.firebaseService.checkUser());
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

// tom@tbeatty.com plusUltra!