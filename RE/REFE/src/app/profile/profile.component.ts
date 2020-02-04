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

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private fireAuth: AngularFireAuth,
    private userReview: UserReview
  ) { }

  ngOnInit() {
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
            // this.users = data.map(e => {
            //   return {s
            //     fname: e.payload.doc.fname,
            //     ...e.payload.doc.data()
            //   } as UserData
            // })
          })          
      
      } else {
        this.router.navigate(['/login'])
      }


    })
  }

  delete(userReviewid: string, mediaId: string, mediaReviewId: string) {
    this.firebaseService.deleteReview(this.uid, userReviewid, mediaId, mediaReviewId)
  }

  editReview(userReviewid) {
    // console.log(userReviewid)
    this.router.navigate([`/update/${userReviewid}`])
  }

  logout() {
    this.firebaseService.signOut();
  }
}