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

// serve react build
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'react-src/build', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'react-src/build'))); // serve static react files

app.listen(config.port || 8080, () => console.log(`Example app listening on port ${config.port}!`))