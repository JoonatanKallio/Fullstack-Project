const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const mongoose = require("mongoose");

const passport = require("passport");
require("dotenv").config();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS for development
if (process.env.NODE_ENV === "development") {
    const corsOptions = {
        origin: "http://localhost:3000/",
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
}

// Connecting to the MongoDB and its error handling
const MongoDB = "mongodb://localhost:27017/projectdb";
mongoose.connect(MongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));

// Authentication
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const indexRouter = require("./routes/index");
const Users = require("./models/Users");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
passport.use(new JwtStrategy(opts, ((jwtPayload, done) => {
    Users.findOne({ email: jwtPayload.email }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    });
})));

app.use("/", indexRouter);
module.exports = app;
