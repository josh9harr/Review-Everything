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

  }

  createUser(email, password, verPassword, fname, lname, phone, state, city, street, zipcode, username) {
    //reCaptcha
    if(grecaptcha && grecaptcha.getResponse().length > 0){
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
      if (this.safe == true) {
        this.firebaseService.singUp(email, password, user)
      } else {
        this.checkExists = this.safe;
        alert('Something is wrong')
      }

    }else{
      alert('You need to verify you are not a robot')
    }

  }

  // captcha(token){
  //     // document.getElementById("demo-form").submit();
  //     console.log(token);
  // }

  
  


}
