import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/firebase.service'
import { ActivatedRoute } from '@angular/router'
import { FormBuilder } from '@angular/forms';
import { Reviews } from '../reviews.model';
import { MoviesService } from '../movies.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { UserReview, UserData } from "../user-review.model"
import { Router } from "@angular/router"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome"

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
  allReviews = [];
  imageBase = 'https://image.tmdb.org/t/p/';
  size = 'original';
  userHasReviewed: boolean = false;
  starForm;
  poster;
  averageRating;
  review;
  allRatings =[];

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private movieService: MoviesService,
    private formBuilder: FormBuilder,
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
          this.starForm = this.formBuilder.group({
            rating: ["0.5"],
            rateMessage: ""
          });
        });
        this.getAverageRating();
      } else {
        window.location.replace('/login')
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
      console.log(data)
      this.movieData = data
      this.poster = this.movieData.poster_path;
    },
      err => console.error(err)
    )
  }

  testStar(rating) {
    console.log(rating)
  }

  submit(credentials) {
    let revRating = credentials.rating;
    let revMessage = credentials.rateMessage;
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
    userReview.poster = `${this.imageBase}${this.size}${this.poster}`;
    this.firebaseService.createUserReview(userReview, this.userID, userReviewId);
    console.log(userReview.poster)
    this.userHasReviewed = true;
  }

  Delete(userReviewID, reviewerId, reviewID) {
    this.userHasReviewed = false;
    this.firebaseService.deleteReview(reviewerId, userReviewID, this.id, reviewID)
  }

  getAverageRating(){
    //gets all reviews
    this.firebaseService.getReviews(this.id).subscribe(data => {
      this.allReviews = data.map(e => {
        return {
          reviewID: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      })

      //Adds rating to array
      this.allReviews.forEach(review => {
        if (review.rating) {
          this.allRatings.push(Number(review.rating));
        }
      });

      //If ratings exist, add all ratings then divide by number of rating
      if(this.allRatings.length !=0){
        var sum = 0;
        this.allRatings.forEach(rating => {
          sum+=rating;
        })
        this.averageRating = Math.round(sum/this.allRatings.length*10)/10;
        
        
      }else{
        this.averageRating = 0;
      }

      });
    }
    
  };
