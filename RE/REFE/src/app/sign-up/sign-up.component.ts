import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FirebaseService } from 'src/app/firebase.service'
import { AngularFireAuth } from "@angular/fire/auth";
import { RegexService } from '../regex.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  checkExists;
  safe;
  verPassError;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private fireAuth: AngularFireAuth,
    private regex: RegexService,
  ) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.replace('/profile')
      }
    });
  }

  createUser(email, password, verPassword, fname, lname, phone, state, city, street, zipcode, username) {
    if (verPassword == password) {
      var user = {
        city: city,
        email: email,
        fname: fname,
        lname: lname,
        password: password,
        phone: phone,
        state: state,
        street: street,
        zip_code: zipcode,
        username: username
      }
      console.log(user);
    } else {
      console.log("Passwords dont match")
      this.verPassError = 'Passwords do not match'
    }

    this.safe = this.regex.testForm(user);
    console.log(this.safe)
    if (this.safe == true) {
      this.firebaseService.singUp(email, password, user);
      console.log(email, password, user)
      console.log(user.fname + user.lname + ' was added')
    } else {
      this.checkExists = this.safe;
    }

  }



}
