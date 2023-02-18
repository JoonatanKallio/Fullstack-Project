var express = require('express');
var router = express.Router();

//Mongodb
let Users = require("../models/Users")
let Posts = require("../models/Posts")
require("dotenv").config()
//Authentication
let jwt = require("jsonwebtoken")
let bcrypt = require("bcryptjs")
let passport = require("passport")
let { body, validationResult } = require("express-validator")

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post("/api/user/register",
body("email").isEmail().normalizeEmail(),
body("username").isLength({min: 5}),
body("password").isLength({min: 8}),
(req, res) => {
//Validation error handling
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //Check database for email match and if no match found, register
    Users.findOne({email: req.body.email}, (err, user) => {
        if(err) throw err;
        if(user) { //If email is in use
            return res.status(403).json({ status: "Email is already in use." })
        } else {
            Users.findOne({username: req.body.username}, (err, user) => {
                if(user) { //If username is in use
                    return res.status(403).json({ status: "Username is already in use." })
                } else { //If no matching email or username found, register
                    bcrypt.genSalt(10)
                    .then(salt => {
                        return bcrypt.hash(req.body.password, salt)
                    })
                    .then(hash => {
                        new Users({
                        email: req.body.email,
                        username: req.body.username,
                        password: hash
                    }).save((err) => {
                        if(err) throw err;
                            return res.status(201).json( {status: "New user created."} )
                        })
                    })
                } 
            })
        }
    })
})

//Tries to find user, if found -> create jwt-token that is returned, if not-> status 403
router.post("/api/user/login", (req, res) => {
    Users.findOne({email: req.body.email}, (err, user) => {
        if(err) throw err;
        if(user) {
            bcrypt.compare(req.body.password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch) {
                    let token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET, { expiresIn: 360 });
                    res.json({ success: true, token: token, status: "Login successful" })
                } else {
                    return res.status(403).json({status: "Invalid credentials"})
                }
            })
        } else {
            return res.status(403).json({status: "Invalid credentials"})
        }
    })
})
//For auth testing purposes
router.get("/api/secret", passport.authenticate("jwt", { session: false }), (req, res) => {
    return res.json({status:"Success"})
})
module.exports = router;
