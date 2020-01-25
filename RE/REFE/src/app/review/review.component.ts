import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/firebase.service'
import { ActivatedRoute } from '@angular/router'
import { Reviews } from '../reviews.model';
import { MoviesService } from '../movies.service';
import { AngularFireAuth } from "@angular/fire/auth";
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
  userID;
  movieData;
  allReviews;
  imageBase = 'https://image.tmdb.org/t/p/';
  size = 'original';

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
        this.userID = user.uid
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
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      })
    });

  };


  getMovieData() {
    this.movieData = this.movieService.getMovieData(this.id).subscribe(data => {
      this.movieData = data
    },
      err => console.error(err),
      () => console.log(this.movieData)
    )
  }

  submit(revUsername: string, revRating: number, revMessage: string) {
    let newReview = new Reviews;
    let mediaID = `${this.id}${this.userID}`;
    let userReviewId = `${this.userID}${this.id}`

    newReview.username = revUsername
    newReview.rating = revRating
    newReview.reviewMessage = revMessage
    newReview.userID = this.userID;
    newReview.id = userReviewId;
    this.firebaseService.createReview(newReview, this.id, mediaID);

    const userReview = {
      mediaName: this.movieName,
      mediaReviewId: mediaID,
      mediaId: this.id,
      rating: newReview.rating,
      reviewMessage: newReview.reviewMessage
    }

    this.firebaseService.createUserReview(userReview, this.userID, userReviewId);
    this.router.navigate(['/home'])
  }

};
