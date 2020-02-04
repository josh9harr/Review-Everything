const firebase = require("firebase");
require("firebase/firestore");
const json = require('./usersHashed.json')


const firebaseConfig = {
    apiKey: "AIzaSyAjxvHSXJEQZs4XfpnY-KV62tVVrduFNRw",
    authDomain: "review-everything-e5518.firebaseapp.com",
    databaseURL: "https://review-everything-e5518.firebaseio.com",
    projectId: "review-everything-e5518",
    storageBucket: "review-everything-e5518.appspot.com",
    messagingSenderId: "102843499461",
    appId: "1:102843499461:web:4e909afa70ff0dabcd01ac",
    measurementId: "G-7ZE6F7X5CJ"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// async function createUser(i) {
//     await firebase.auth().createUserWithEmailAndPassword(json[i].email, json[i].OrigPass).catch(function (error) {
//         var errorCode = error.code;
//         var errorMessage = error.message;
//     })
//         .then(() => {
//             const user = firebase.auth().currentUser;
//             if (user != null) {
//                 let scheme = {
//                     fname: json[i].fname,
//                     lname: json[i].lname,
//                     street: json[i].street,
//                     city: json[i].city,
//                     state: json[i].state,
//                     zip_code: json[i].zip_code,
//                     email: json[i].email,
//                     password: json[i].password,
//                     phone: json[i].phone
//                 }
//                 db.collection("users").doc(user.uid).set(scheme)
//             };
//             console.log(`user ${i + 1} has been created`)
//         });
// }
// async function load() {
//     for (let i = 0; i < json.length; i++) {
//         await createUser(i);
//     }
// }

const loadUsers = _ => {
    let res = getMarker();
    console.log(res);
};

async function getMarker() {
    let res = [];
    let IDCollection = [];
    let index = 1;

    await firebase.firestore().collection('users').get().then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
            // let userObj = doc.data();
            IDCollection.push(doc.id);
            res.push(doc.data());
            // console.log(doc.data());
            index++;
        })
    }).then(async function () {
        let ind = 0;
        res.forEach(async function (user) {
            let username = `${user.fname}${user.lname[0]}`
            user.username = username
            firebase.firestore().doc(`users/${IDCollection[ind]}/`).update(user).then(_ => {
                console.log(`User #${ind} was updated`);
            });
            ind += 1;
        });

    })
}

getMarker();