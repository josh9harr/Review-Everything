import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedin: boolean = false;

  constructor(
    private fireAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedin = true;
      }
    });
  }

}
