var admin = require("firebase-admin");

var serviceAccount = require("../credentials/review-everything-credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://review-everything-e5518.firebaseio.com"
});

let db = admin.firestore();

exports.index = (req, res) => {
    res.send(`
        <h1>Review Everything API</h1>
        <h3>Welcome to the review everything API. An example of searching for a movie is root/movies/movie-name. For example root/movies/Joker</h3>
    `)
}

exports.movie = (req, res) => {
    // console.log(req.params.movieName)
    db.collection('media').where("name", "==", req.params.movieName).get()
        .then((movies) => {
            let moviesData = [];
            // console.log(movies.docs)
            moviesData = movies.docs.map(e => {
                return {
                    Id: e.id,
                    ...e.data()
                }
            });


            let results = [];
            if (moviesData.length == 0) {
                res.send()
            } else {
                let movieObj;
                db.collection('media').doc(moviesData[0].Id).collection("reviews").get()
                    .then((snapshot) => {
                        const reviews = [];
                        snapshot.forEach((collection) => {
                            const reviewData = collection.data();
                            reviews.push({
                                username: reviewData.username,
                                rating: reviewData.rating,
                                reviewMessage: reviewData.reviewMessage
                            })

                        });
                        movieObj = {
                            name: moviesData[0].name,
                            reviews: reviews
                        }
                        results.push(movieObj);

                        let resObj = {
                            results: results
                        }

                        let jsonData = JSON.stringify(resObj)
                        res.send(jsonData);
                    })
                    .then(_ => {
                        console.log("Movie loading has finished")
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            }
        })
        .catch((error) => {
            console.log(error);
        })

}