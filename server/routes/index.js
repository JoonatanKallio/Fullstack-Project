var express = require('express');
var router = express.Router();
require("dotenv").config()
//Mongodb
let Users = require("../models/Users")
let Posts = require("../models/Posts")
let Comments = require("../models/Comments")


//Authentication
let jwt = require("jsonwebtoken")
let bcrypt = require("bcryptjs")
let passport = require("passport")
let { body, validationResult } = require("express-validator");
const { Timestamp } = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post("/api/user/register",
body("email").isEmail().normalizeEmail(),
body("username").isLength({min: 3}),
body("password").isLength({ min: 8 }).not().isUppercase().not().isLowercase().not().isNumeric().not().isAlphanumeric().not(),
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
            return res.status(400).json({ status: "Email is already in use." })
        } else {
            Users.findOne({username: req.body.username}, (err, user) => {
                if(user) { //If username is in use
                    return res.status(400).json({ status: "Username is already in use." })
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
                    let token = jwt.sign({ email: user.email, id: user._id, username: user.username }, process.env.SECRET, { expiresIn: 1000 });
                    res.json({ success: true, token: token, status: "Login successful." })
                } else {
                    return res.status(400).json({status: "Invalid credentials"})
                }
            })
        } else {
            return res.status(400).json({status: "Invalid credentials"})
        }
    })
})
//For auth testing purposes
router.get("/api/secret", passport.authenticate("jwt", { session: false }), (req, res) => {
    const token = req.headers.authorization
    const tokenContent = token.split(".")
    const decode = atob(tokenContent[1])
    const json = JSON.parse(decode)
    console.log(json.id)
    return res.json({status:"Success"})
})

//Upload post
router.post("/api/upload/post", passport.authenticate("jwt", { session: false }), (req, res) => {
    const token = req.headers.authorization
    const tokenContent = token.split(".")
    const decode = atob(tokenContent[1])
    const json = JSON.parse(decode)
    console.log(json)
    new Posts({
        owner: json.id,
        title: req.body.title,
        content: req.body.content,
        votes: 0
    }).save((err, post) => {
        if(err) throw err;
        console.log(post)
        return res.status(201).json( {status: "New post created."} )
        
        })

})

//Upload comment
router.post("/api/upload/comment", passport.authenticate("jwt", { session: false }), (req, res) => {
    const token = req.headers.authorization
    const tokenContent = token.split(".")
    const decode = atob(tokenContent[1])
    const json = JSON.parse(decode)
    console.log(json)
    new Comments({
        post: req.body.postid,
        author: json.id,
        content: req.body.content 
    }).save((err) => {
        if(err) return res.status(404).json({status: "Post body didn't have required data."});
        return res.status(201).json( {status: "New comment created."} )
        })
})


//get all posts
router.get("/api/list/posts", (req, res) => {
    Posts.find({}, function(err, posts) {
        if(err) throw err;
        if(posts) {
            console.log(posts)
            return res.json(posts).status(200)
        } else {
            return res.send({status: "not ok"})
        }
    }).populate("owner", "username")

})

//get one post
router.get("/api/list/post/:id", (req, res) => {
    Posts.findById(req.params.id, function (err, post) {
        if(err) throw err;
        if(post) {
            
            return res.json(post).status(200)
        } else {
            return res.status(404)
        }
    }).populate("owner")
})

router.get("/api/list/comments/:id", (req, res) => {
    Comments.find({ post: req.params.id }, function (err, comments) {
        if(err) throw err;
        if(comments) {
            console.log(comments)
            return res.json(comments).status(200)
        } else {
            return res.status(404)
        }
    }).populate("author")
})


router.put("/api/edit/post", passport.authenticate("jwt", { session: false }), (req, res) => {
    
    Posts.findById({_id: req.body.id}, function(err, post) {
        if(post) {
            const token = req.headers.authorization
            const tokenContent = token.split(".")
            const decode = atob(tokenContent[1])
            const json = JSON.parse(decode)
            
            
            if(json.id === post.owner.id) {
                Posts.findByIdAndUpdate({_id: req.body.id}, {content: req.body.content}, function(err, post) {
                    if(err) throw err;
                    if(post) {
                        res.json({status: "updated"})
                    }
                })
            } else {
                res.json({status: "Not authorized"}).status(401)
            }
        }
    }).populate("owner")


    

})

module.exports = router;
