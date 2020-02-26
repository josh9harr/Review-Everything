import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FirebaseService } from 'src/app/firebase.service'
import { AngularFireAuth } from "@angular/fire/auth";
import { ActivatedRoute } from '@angular/router';
import * as firebase from "firebase/app"


@Component({
  selector: 'app-unlock-account',
  templateUrl: './unlock-account.component.html',
  styleUrls: ['./unlock-account.component.scss']
})
export class UnlockAccountComponent implements OnInit {

  userLoggedIn: boolean = false;
  emailIsLocked: boolean = false;
  resetPass: boolean = false;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private fireAuth: AngularFireAuth,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.firebaseService.accountIsLocked(this.route.snapshot.params.email).toPromise().then(res => {
      console.log(res.exists)
      this.emailIsLocked = res.exists;
    })
  }

  login(password) {
    console.log(password)
    this.firebaseService.signInWithoutCheck(this.route.snapshot.params.email, password).then(_ => {
      this.userLoggedIn = true;
    })
      .catch(error => {
        console.log(error);
      })
  }

  UpdatePass(password) {
    this.firebaseService.unlockAccount(password, this.route.snapshot.params.email);
    this.emailIsLocked = false;
  }
}
