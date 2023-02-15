var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongoose = require('mongoose');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

if(process.env.NODE_ENV === "development") {
    var corsOptions = {
        origin: 'http://localhost:3000/',
        optionsSuccessStatus:200,
    };
    app.use(cors(corsOptions));
}

const MongoDB = "mongodb://localhost:27017/projectdb"
mongoose.connect(MongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"))

module.exports = app;
