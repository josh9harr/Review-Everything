import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/firebase.service'
import { ActivatedRoute } from '@angular/router'
import { Reviews } from '../reviews.model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  media: Reviews;
  movieName: string;
  id = this.route.snapshot.params.id;

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.firebaseService.getMedia(this.id).subscribe(data => {
      if (data.data() == undefined) {

      } else {
        this.movieName = data.data().name;
      }
    });
  };

  submit(revUsername: string, revRating: number, revMessage: string) {
    const userID = "00YBraFkPMTPiBhbvtVWQ9QeEUx2"
    let newReview = new Reviews;
    let mediaID = `${this.id}${userID}`;

    newReview.username = revUsername
    newReview.rating = revRating
    newReview.reviewMessage = revMessage
    newReview.id = userID;
    this.firebaseService.createReview(newReview, this.id, mediaID);

    const userReview = {
      mediaName: this.movieName,
      mediaId: mediaID,
      rating: newReview.rating,
      reviewMessage: newReview.reviewMessage
    }

    this.firebaseService.createUserReview(userReview, userID);
  }

};
