const express = require('express'),
    route = require('./routes/routes.js')
const cors = require('cors')

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, x-Requested-Width, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/public'));

app.get('/', route.index);
app.get('/movies/:movieName', route.movie);
// app.get('/api/:amount/:seed', route.api);
// app.get('/api', route.single);

app.listen(3000);