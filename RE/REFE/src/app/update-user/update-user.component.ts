import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FormBuilder } from '@angular/forms';
import { FirebaseService } from 'src/app/firebase.service'
import * as firebase from "firebase/app"
import { AngularFireAuth } from "@angular/fire/auth";
import { UserReview, UserData } from "../user-review.model"
import { from } from 'rxjs';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  items;
  updateForm;
  updateEmail_PassForm;
  loginForm;
  displayModal: boolean = false;
  displayLoginForm: boolean = false;
  displayEmailPassForm: boolean = false;
  newPass;
  newEmail;


  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private fireAuth: AngularFireAuth,

  ) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.firebaseService.getUser(user.uid).subscribe(data => {
          const res = data.data();
          this.updateForm = this.formBuilder.group({
            username: res.username,
            fname: res.fname,
            lname: res.lname,
            phone: res.phone,
            state: res.state,
            city: res.city,
            street: res.street,
            zip_code: res.zip_code,
          });
          this.updateEmail_PassForm = this.formBuilder.group({
            email: "",
            password: ""
          })
        });
      } else {
        this.router.navigate(['/login'])
      }
    })
  }

  onSubmit(userData) {
    const user = firebase.auth().currentUser;
    this.firebaseService.getUser(user.uid).subscribe(data => {
      const res = data.data();
      if (res.email != userData.email || res.password != userData.password) {
        if (res.email != userData.email) {
          this.newEmail = userData.email;
        }

        if (res.password != userData.password) {
          this.newPass = userData.password
        }

        this.firebaseService.updateUser(userData, user.uid)

      } else {
        this.firebaseService.updateUser(userData, user.uid)
      }
    })
    // this.router.navigate([`/profile`])
  }

  updateEmail_Pass(credentials) {
    const user = firebase.auth().currentUser;
    user.updatePassword(credentials.password)
    user.updateEmail(credentials.email)
    this.displayModal = false;

  }

  logForm() {
    this.loginForm = this.formBuilder.group({
      email: "",
      Password: ""
    });
    this.displayModal = true;
    this.displayLoginForm = true;

  }

  login(credentials) {

    this.firebaseService.signIn(credentials.email, credentials.Password).then(_ => {
      this.displayLoginForm = false;
      this.displayEmailPassForm = true;
    })
      .catch(error => {
        console.log(error);
      });
  }

}
