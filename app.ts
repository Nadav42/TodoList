const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')

import cors from 'cors';
import routes from './api';
import config from './config';

// mongodb connection
const mongoose = require('mongoose');
mongoose.connect(config.databaseURL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log("connected to mongodb")
});

// express app
const app = express()

// enable cors for react dev
app.use(cors());

// convert raw req.body to json
app.use(bodyParser.json());

// api routes
app.use(config.api.prefix, routes());

// ------------------------------------------------------------------------------------------ //
// enable server side rendering for search engine user agents like googlebot:

// important!!! 
// 1. must put this middleware before the middleware that returns react build files or it won't work
// 2. the prerender server on npm doesn't work! it's not updated, download the source files from github and do npm install, npm start
// https://github.com/prerender/prerender --> the npm version doesn't strip script tags thus react keeps working and fetching stuff when it shouldn't
// 3. do CTRL + F5 while testing to be on the safe side

// render server configuration:

// option 1: use the render server hosted on prerender.io (costs money but works good)
// app.use(require('prerender-node').set('prerenderToken', 'ngTBRXR1I492ti5TWLoe'));

// option 2: use your own render server ("free" but need to run from source because npm version doesn't strip script tags)
app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:8000'));

// ------------------------------------------------------------------------------------------ //

// serve react build
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'react-src/build', 'index.html'));
});

// serve static react files
app.use(express.static(path.join(__dirname, 'react-src/build')));

app.listen(config.port || 8080, () => console.log(`Example app listening on port ${config.port}!`))

// hack to keep heroku dyno awake
const wakeDyno = require("./wakeDyno"); 
const DYNO_URL = "https://todo-app-nadav.herokuapp.com/"; // url of heroku dyno
wakeDyno(DYNO_URL);
