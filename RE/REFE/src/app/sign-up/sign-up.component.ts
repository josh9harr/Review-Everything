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

  safe = false;

  constructor(
    private router: Router, 
    private firebaseService: FirebaseService, 
    private fireAuth: AngularFireAuth,
    private regex: RegexService,
    ) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate(['/profile'])
      }
    });
  }

  createUser(email, password, fname, lname, phone, state, city, street, zipcode, username) {
    const user = {
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

    this.safe = this.regex.testForm(user);

    if(this.safe){
      this.firebaseService.singUp(email, password, user);
      console.log(user + ' was added')
    }else{
      console.log("It didnt work bud")
    }

  }



}
