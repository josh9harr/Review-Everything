const firebase = require("firebase");
require("firebase/firestore");
const json = require('./usersHashed.json')

console.log(json[0].email);

const firebaseConfig = {
    apiKey: "AIzaSyAGsiEBXZ9St3QBodPp2z4koVFdbOp1mHA",
    authDomain: "review-everything-bbd6e.firebaseapp.com",
    databaseURL: "https://review-everything-bbd6e.firebaseio.com",
    projectId: "review-everything-bbd6e",
    storageBucket: "review-everything-bbd6e.appspot.com",
    messagingSenderId: "639198892038",
    appId: "1:639198892038:web:43312323d455c82443f387",
    measurementId: "G-H4YCPT7ZBM"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

async function createUser(i) {
    await firebase.auth().createUserWithEmailAndPassword(json[i].email, json[i].password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
    })
        .then(() => {
            const user = firebase.auth().currentUser;
            if (user != null) {
                let scheme = {
                    fname: json[i].fname,
                    lname: json[i].lname,
                    street: json[i].street,
                    city: json[i].city,
                    state: json[i].state,
                    zip_code: json[i].zip_code,
                    email: json[i].email,
                    password: json[i].password,
                    phone: json[i].phone
                }
                db.collection("users").doc(user.uid).set(scheme)
            };
        });
}
async function load() {
    for (let i = 0; i < json.length; i++) {
        await createUser(i);
    }
}

load();
