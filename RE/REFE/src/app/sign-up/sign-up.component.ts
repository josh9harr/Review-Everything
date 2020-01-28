import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FirebaseService } from 'src/app/firebase.service'
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private router: Router, private firebaseService: FirebaseService, private fireAuth: AngularFireAuth) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate(['/profile'])
      }
    });
  }

  createUser(email, password, fname, lname, phone, state, city, street, zipcode) {
    const user = {
      city: city,
      email: email,
      fname: fname,
      lname: lname,
      password: password,
      phone: phone,
      state: state,
      street: street,
      zip_code: zipcode
    }
    this.firebaseService.singUp(email, password, user);
    this.router.navigate(['/profile'])
  }

}
