import { Injectable } from '@angular/core';
//Needed dependacies in order to create the CRUD service
//This import will create the instance of firebase
import { AngularFirestore } from '@angular/fire/firestore';
//This import will take in the model that you will be basing the data off of
import { Reviews } from 'src/app/reviews.model'
import * as firebase from "firebase/app"
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  //This is creating an instance of firebase
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) { }

  //The method made for getting all of the reviews
  getReviews(mediaID: string) {
    return this.firestore.collection(`media/${mediaID}/reviews`).snapshotChanges();
  }
  
  getMediaReview(mediaID: string, reviewID: string) {
    return this.firestore.doc(`media/${mediaID}/reviews/${reviewID}`).get();
  }
  
  getUserReview(userID: string, reviewID: string) {
    return this.firestore.doc(`users/${userID}/reviews/${reviewID}`).get();
    
  }

  getMedia(id: string) {
    return this.firestore.doc('media/' + id).get();
  }
  //This should get it from database
  getUser(userID: string){
    return this.firestore.doc(`users/${userID}`).get();
  }

  //The method made for creating a review
  createReview(review, id: string, docID: string) {
    let data = JSON.parse(JSON.stringify(review))
    return this.firestore.collection('media').doc(id).collection('reviews').doc(docID).set(data)
  }

  //The method made for updating a review
  updateReview(userReview, mediaReview) {
    let userReviewdata = JSON.parse(JSON.stringify(userReview))
    let mediaReviewdata = JSON.parse(JSON.stringify(mediaReview))
    this.firestore.doc(`users/${mediaReview.userID}/reviews/${mediaReview.id}`).update(userReviewdata);
    this.firestore.doc(`media/${userReviewdata.mediaId}/reviews/${userReviewdata.mediaReviewId}`).update(mediaReviewdata);
  }

  //The method made for deleteing a review
  deleteReview(userID: string, userReviewid: string, mediaId: string, mediaReviewId: string) {
    this.firestore.collection("media").doc(mediaId).collection("reviews").doc(mediaReviewId).delete();
    this.firestore.collection("users").doc(userID).collection("reviews").doc(userReviewid).delete();
  }

  createMedia(media, id) {
    let data = JSON.parse(JSON.stringify(media));
    return this.firestore.collection("media").doc(`${id}`).set(data)
  }


  checkMedia(id: string) {
    let docExists: boolean;
    this.firestore.doc('media/' + id).get().toPromise().then(docSnapshot => {
      docExists = docSnapshot.exists;
    })
    return docExists
  }

  createUserReview(review, id: string, reviewID: string) {
    let data = JSON.parse(JSON.stringify(review))
    return this.firestore.collection('users').doc(id).collection('reviews').doc(reviewID).set(data);
  }

  getUserReviews(userID: string) {
    return this.firestore.collection("users").doc(userID).collection("reviews").snapshotChanges();
  }

  //User sign in and out
  async signIn(email: string, password: string) {
    try {

      await this.auth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(async function () {
          await firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
          }).catch(function (error) {
            console.log("Email and/or password are incorrect")
          })
        });
    } catch (error) {
      console.log(error);
    }
  }

  async singUp(email: string, password: string, userData) {
    await firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
      console.log(error);
    }).then(_ => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        let data = JSON.parse(JSON.stringify(userData));
        this.firestore.collection("users").doc(user.uid).set(data);
      }
    });
  }

  signOut() {
    return firebase.auth().signOut();
  }

  //Checks who the user is
  async checkUser() {
    await firebase.auth().onAuthStateChanged(function (user) {
      console.log(user);
      if (user) {
        return user.uid;
      }
    });
  }
}
