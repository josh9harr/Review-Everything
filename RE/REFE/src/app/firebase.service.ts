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

  getReview(mediaID: string, reviewID: string) {
    return this.firestore.doc(`media/${mediaID}/reviews/${reviewID}`).get();
  }

  //The method made for creating a review
  createReview(review, id: string, docID: string) {
    let data = JSON.parse(JSON.stringify(review))
    return this.firestore.collection('media').doc(id).collection('reviews').doc(docID).set(data)
  }

  //The method made for updating a review
  updateReview(review) {
    delete review.id;
    let data = JSON.parse(JSON.stringify(review))
    this.firestore.doc('reviews/' + review.id).update(data);
  }

  //The method made for deleteing a review
  deleteReview(reivewId: string) {
    this.firestore.doc('reviews/' + reivewId).delete();
  }

  createMedia(media, id) {
    let data = JSON.parse(JSON.stringify(media));
    return this.firestore.collection("media").doc(`${id}`).set(data)
  }

  getMedia(id: string) {
    return this.firestore.doc('media/' + id).get();
  }

  checkMedia(id: string) {
    let docExists: boolean;
    this.firestore.doc('media/' + id).get().toPromise().then(docSnapshot => {
      docExists = docSnapshot.exists;
    })
    return docExists
  }

  createUserReview(review, id: string) {
    let data = JSON.parse(JSON.stringify(review))
    return this.firestore.collection('users').doc(id).collection('reviews').add(data);
  }

  //User sign in and out
  async signIn(email: string, password: string) {
    this.auth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async function () {
        await firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
          console.log("Email and/or password are incorrect")
        })
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
