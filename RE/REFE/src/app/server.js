import * as admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});

// Initialize the default app
var admin = require('firebase-admin');
var app = admin.initializeApp();

function deleteUser(userID) {
    admin.auth().deleteUser(uid)
};