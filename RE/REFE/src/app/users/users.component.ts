import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FirebaseService } from 'src/app/firebase.service'
import { AngularFireAuth } from "@angular/fire/auth";
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userList;
  isLoading: boolean = false;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getAllUsers().subscribe(data => {
      this.userList = data.map(e => {
        return {
          userID: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      })
    });
  }

  getUsers() {
    console.log(this.userList)
  }

  Delete(id) {
    this.isLoading = true;
    console.log(id)
    let reviews = [];
    this.firebaseService.getUserReviews(id).subscribe(data => {
      reviews = data.map(e => {
        return {
          reviewID: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      })
      reviews.forEach(review => {
        this.firebaseService.deleteReview(id, review.reviewID, review.mediaId, review.mediaReviewId)
      });

      this.firebaseService.deleteUser(id);
      this.isLoading = false;
    })

  }

  makeAdmin(id) {
    this.firebaseService.makeAdmin(id);
  }

}


