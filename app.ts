const express = require('express')
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './api';
import config from './config';

// mongodb connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/notesDB', { useNewUrlParser: true });

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

app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))

