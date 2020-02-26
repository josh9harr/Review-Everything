import { Injectable } from '@angular/core';
//Needed dependacies in order to create the CRUD service
//This import will create the instance of firebase
import { AngularFirestore } from '@angular/fire/firestore';
//This import will take in the model that you will be basing the data off of
import { Reviews } from 'src/app/reviews.model'
import * as firebase from "firebase/app"
import { AngularFireAuth } from "@angular/fire/auth";
import { send } from 'emailjs-com'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  //This is creating an instance of firebase
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
  ) { }

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
  getUser(userID: string) {
    return this.firestore.doc(`users/${userID}`).get();
  }

  getUserByUsername(username) {
    const db = firebase.firestore()
    return db.collection(`users`).where("username", "==", username).get();
  }

  getUserByMethod(searchMethod, value) {
    const db = firebase.firestore()
    return db.collection(`users`).where(searchMethod, "==", value).get();
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

  //Gets all the reviews from the user
  getUserReviews(userID: string) {
    return this.firestore.collection("users").doc(userID).collection("reviews").snapshotChanges();
  }

  //The method made for updating a user
  updateUser(user, id) {
    let userData = JSON.parse(JSON.stringify(user))
    this.firestore.collection("users").doc(id).update(userData);
  }

  //Deletes a user
  deleteUser(id) {
    this.firestore.collection("users").doc(id).delete();
  }

  // Makes a user an admin
  makeAdmin(id) {
    this.firestore.collection("users").doc(id).update({
      isAdmin: true
    });
  }

  //User sign in and out
  async signIn(email: string, password: string) {
    this.firestore.collection("loginAttempts").doc(email).get().toPromise().then(doc => {
      if (doc.exists) {
        let docData = doc.data();
        if (docData.loginAttempts == 10) {
          return "Current account is locked. Please check your email to reset your password"
        } else {
          this.auth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(async function () {
              firebase.auth().signInWithEmailAndPassword(email, password)
                .then(_ => {
                  firebase.firestore().collection("loginAttempts").doc(email).delete();
                }).catch(function (error) {
                  if (docData.loginAttempts == 9) {
                    firebase.firestore().collection("loginAttempts").doc(email).update({
                      loginAttempts: firebase.firestore.FieldValue.increment(1),
                      accountLocked: true
                    });
                    // sendEmail()
                    send("gmail", "accountlock", { "userEmail": email, "resetLink": `http://localhost:4200/unlock-account/${email}` }, "user_ui8QLUfGGmXZUX37Y2Ki9")
                    const db = firebase.firestore()
                    return db.collection(`users`).where("isAdmin", "==", true).get().then(res => {
                      res.docs.forEach(doc => {
                        let data = doc.data();
                        console.log(data.username, data.email)
                        send("gmail", "template_oZSS2hDH", { "adminEmail": data.email, "name": data.username, "userEmail": email }, "user_ui8QLUfGGmXZUX37Y2Ki9")
                      });
                    });
                  } else {
                    firebase.firestore().collection("loginAttempts").doc(email).update({
                      loginAttempts: firebase.firestore.FieldValue.increment(1)
                    });
                  }
                });
            });
        }

      } else {
        this.auth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(async function () {
            firebase.auth().signInWithEmailAndPassword(email, password)
              .then(_ => {
                firebase.firestore().collection("loginAttempts").doc(email).delete();
              }).catch(function (error) {
                firebase.firestore().collection("loginAttempts").doc(email).set({ loginAttempts: 1, accountLocked: false });
              })
          });
      }
    });
  }

  async signInWithoutCheck(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  accountIsLocked(email: string) {
    return this.firestore.collection("loginAttempts").doc(email).get()
  }

  // Sign the user up for the website
  async singUp(email: string, password: string, userData) {
    await firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
      console.log(error);
    }).then(_ => {
        const user = firebase.auth().currentUser;
        let data = JSON.parse(JSON.stringify(userData));
        this.firestore.collection("users").doc(user.uid).set(data);
      }).then ( _ => {
        window.location.replace('/home')        
    });
  }

  // Sign the user out
  signOut() {
    return firebase.auth().signOut();
  }

  resetPassword(email: string) {
    this.auth.auth.sendPasswordResetEmail(email)
    return this.auth.auth.sendPasswordResetEmail(email);
  }

  unlockAccount(password, email) {
    firebase.auth().currentUser.updatePassword(password)
      .then(_ => {
        this.firestore.collection("loginAttempts").doc(email).delete();
      })
      .catch(error => {
        console.log(error)
      })
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
