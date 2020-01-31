import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/firebase.service'
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loggedin = false;
  title = 'Review Everything!';



  constructor(private firebaseService: FirebaseService, private fireAuth: AngularFireAuth) {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedin = true;
      }
    });
  }


}
