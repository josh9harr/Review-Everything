import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FirebaseService } from 'src/app/firebase.service'
import { AngularFireAuth } from "@angular/fire/auth";
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-update-review',
  templateUrl: './update-review.component.html',
  styleUrls: ['./update-review.component.scss']
})

export class UpdateReviewComponent implements OnInit {

  uid: string
  userReview = {};
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
          this.userReview = reviewData;
          this.firebaseService.getMediaReview(reviewData.mediaId, reviewData.mediaReviewId).toPromise().then(data => {
            this.mediaReview = data.data();
          });
        })
      } else {
        this.router.navigate(['/login'])
      }
    })
  }

  updateReview(revMessage: string, rating: number) {
    if (revMessage != undefined) {
      this.userReview.reviewMessage = revMessage;
      this.mediaReview.reviewMessage = revMessage;
    }

    if (rating != undefined) {
      this.userReview.rating = rating;
      this.mediaReview.rating = rating;
    }

    this.firebaseService.updateReview(this.userReview, this.mediaReview);
    this.router.navigate(['/profile'])
  }

}
