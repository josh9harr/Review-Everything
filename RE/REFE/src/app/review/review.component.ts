import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/firebase.service'
import { ActivatedRoute } from '@angular/router'
import { Reviews } from '../reviews.model';
import { MoviesService } from '../movies.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { UserReview, UserData } from "../user-review.model"
import { Router } from "@angular/router"

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  media: Reviews;
  movieName: string;
  id = this.route.snapshot.params.id;
  currentUser;
  isAdmin: boolean = false;
  userID = "";
  movieData;
  allReviews;
  imageBase = 'https://image.tmdb.org/t/p/';
  size = 'original';
  userHasReviewed: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private movieService: MoviesService,
    private fireAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userID = user.uid;
        this.currentUser = this.firebaseService.getUser(user.uid).subscribe(data => {
          const res = data.data();
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
          this.isAdmin = res.isAdmin
          this.currentUser = userData;
        });
      } else {
        this.router.navigate(['/login'])
      }
    });

    this.firebaseService.getMedia(this.id).subscribe(data => {
      if (data.data() == undefined) {

      } else {
        this.movieName = data.data().name;
      }
    });

    this.getMovieData();

    this.firebaseService.getReviews(this.id).subscribe(data => {
      this.allReviews = data.map(e => {
        return {
          reviewID: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      })
      this.allReviews.forEach(review => {
        if (review.userID == this.userID) {
          this.userHasReviewed = true;
        }
      });
    });
  };

  getMovieData() {
    this.movieData = this.movieService.getMovieData(this.id).subscribe(data => {
      this.movieData = data
    },
      err => console.error(err)
    )
  }

  submit(revRating: number, revMessage: string) {
    let newReview = new Reviews;
    let userReview = new UserReview;
    let mediaID = `${this.id}${this.userID}`;
    let userReviewId = `${this.userID}${this.id}`

    newReview.username = this.currentUser.username
    newReview.rating = revRating
    newReview.reviewMessage = revMessage
    newReview.userID = this.userID;
    newReview.id = userReviewId;
    this.firebaseService.createReview(newReview, this.id, mediaID);


    userReview.mediaName = this.movieName;
    userReview.mediaReviewId = mediaID;
    userReview.mediaId = this.id;
    userReview.rating = newReview.rating;
    userReview.reviewMessage = newReview.reviewMessage;
    this.firebaseService.createUserReview(userReview, this.userID, userReviewId);
    this.userHasReviewed = true;
  }

  Delete(userReviewID, reviewerId, reviewID) {
    this.userHasReviewed = false;
    this.firebaseService.deleteReview(reviewerId, userReviewID, this.id, reviewID)
  }
};
