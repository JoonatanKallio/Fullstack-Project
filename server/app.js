var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongoose = require('mongoose');

let passport = require("passport")
require("dotenv").config()

const Posts = require("./models/Posts");
const Users = require("./models/Users");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//CORS for development
if(process.env.NODE_ENV === "development") {
    var corsOptions = {
        origin: 'http://localhost:3000/',
        optionsSuccessStatus:200,
    };
    app.use(cors(corsOptions));
}

//Connecting to the MongoDB and its error handling
const MongoDB = "mongodb://localhost:27017/projectdb"
mongoose.connect(MongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"))

//Authentication
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    Users.findOne({ email: jwt_payload.email }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));



module.exports = app;
//SET NODE_ENV=production& npm run dev:server for running the server
//tester@gmail.com
//TestiS4l1!