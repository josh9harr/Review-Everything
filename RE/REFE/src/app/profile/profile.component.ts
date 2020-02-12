import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FirebaseService } from 'src/app/firebase.service'
import { AngularFireAuth } from "@angular/fire/auth";
import { UserReview, UserData } from "../user-review.model"


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [UserReview]
})
export class ProfileComponent implements OnInit {
  users: UserData[];
  reviews: UserReview[];
  uid: string
  curUser: UserData
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private fireAuth: AngularFireAuth,
    private userReview: UserReview
  ) { }

  ngOnInit() {
    this.firebaseService.getUserByUsername("CristianTest").then(data => {
      console.log(data.docs[0].data());
    });
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        //get review data from database
        this.firebaseService.getUserReviews(user.uid).subscribe(data => {
          this.reviews = data.map(e => {
            return {
              userReviewId: e.payload.doc.id,
              ...e.payload.doc.data()
            } as UserReview
          })
        })
        //get user data from database
        this.firebaseService.getUser(user.uid).subscribe(data => {
          const res = data.data();
          if (res.isAdmin) {
            this.isAdmin = true;
          }
          let userData = new UserData;
          userData.fname = res.fname;
          userData.lname = res.lname;
          userData.email = res.email;
          userData.password = res.password;
          userData.street = res.street;
          userData.city = res.city;
          userData.state = res.state;
          userData.zip_code = res.zip_code;
          userData.phone = res.phone;
          userData.username = res.username;
          this.curUser = userData;
        });

      } else {
        window.location.replace('/login')
      }
    })
  }

  delete(userReviewid: string, mediaId: string, mediaReviewId: string) {
    this.firebaseService.deleteReview(this.uid, userReviewid, mediaId, mediaReviewId)
  }

  editReview(userReviewid) {
    window.location.replace(`/update/${userReviewid}`)
  }

  logout() {
    this.firebaseService.signOut();
  }
}