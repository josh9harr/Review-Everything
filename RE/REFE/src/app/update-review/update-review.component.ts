import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FirebaseService } from 'src/app/firebase.service'
import { AngularFireAuth } from "@angular/fire/auth";
import { ActivatedRoute } from '@angular/router'
import { UserReview } from '../user-review.model'

@Component({
  selector: 'app-update-review',
  templateUrl: './update-review.component.html',
  styleUrls: ['./update-review.component.scss']
})

export class UpdateReviewComponent implements OnInit {

  uid: string
  displayReview = {};
  userReview: UserReview;
  mediaReview;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private fireAuth: AngularFireAuth,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.firebaseService.getUserReview(user.uid, this.route.snapshot.params.reviewId).toPromise().then(data => {
          let reviewData = data.data();
          let resReview = new UserReview;
          this.displayReview = reviewData;
          resReview.mediaId = reviewData.mediaId;
          resReview.mediaName = reviewData.mediaName;
          resReview.mediaReviewId = reviewData.mediaReviewId;
          resReview.rating = reviewData.rating;
          resReview.reviewMessage = reviewData.reviewMessage;
          this.userReview = resReview;
          this.firebaseService.getMediaReview(reviewData.mediaId, reviewData.mediaReviewId).toPromise().then(data => {
            this.mediaReview = data.data();
          });
        })
      } else {
        window.location.replace('/login')
      }
    })
  }

  updateReview(revMessage: string, rating: number) {
    // console.log("this is running")
    if (revMessage != undefined) {
      this.userReview.reviewMessage = revMessage;
      this.mediaReview.reviewMessage = revMessage;
    }

    if (rating != undefined) {
      this.userReview.rating = rating;
      this.mediaReview.rating = rating;
    }

    this.firebaseService.updateReview(this.userReview, this.mediaReview);
    window.location.replace('/profile')
  }

}
