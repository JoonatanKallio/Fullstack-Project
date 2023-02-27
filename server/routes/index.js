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
body("password").isStrongPassword(),
(req, res) => {
//Validation error handling
    const errors = validationResult(req);
    let userBio = ""
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
                        if(req.body.bio) {
                            userBio = req.body.bio
                        }
                        new Users({
                        email: req.body.email,
                        username: req.body.username,
                        password: hash,
                        bio: userBio
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
                    let token = jwt.sign({ email: user.email, id: user._id, username: user.username }, process.env.SECRET, { expiresIn: 10000 });
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


//Upload post
router.post("/api/upload/post", passport.authenticate("jwt", { session: false }), (req, res) => {
    const token = req.headers.authorization
    const tokenContent = token.split(".")
    const decode = atob(tokenContent[1])
    const json = JSON.parse(decode)
    new Posts({
        owner: json.id,
        title: req.body.title,
        content: req.body.content,
        votes: 0
    }).save((err, post) => {
        if(err) throw err;
        return res.status(201).json( {status: "New post created."} )
        })
})

//Upload comment
router.post("/api/upload/comment", passport.authenticate("jwt", { session: false }), (req, res) => {
    const token = req.headers.authorization
    const tokenContent = token.split(".")
    const decode = atob(tokenContent[1])
    const json = JSON.parse(decode)
    new Comments({
        post: req.body.postid,
        author: json.id,
        content: req.body.content 
    }).save((err) => {
        if(err) return res.status(404).json({status: "Post body didn't have required data."});
        return res.status(201).json( {status: "New comment created."} )
        })
})

//get user info with all the user's posts too
router.get("/api/list/user/:id", (req, res) => {
    Users.findById({_id: req.params.id}, function(err, user) {
        if(err) throw err;
        if(user) {
            return res.json(user).status(200)
        } else {
            return res.send({status: "not ok"})
        }
    })

})

//get all posts
router.get("/api/list/posts", (req, res) => {
    Posts.find({}, function(err, posts) {
        if(err) throw err;
        if(posts) {
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

//List comments by postId
router.get("/api/list/comments/:id", (req, res) => {
    Comments.find({ post: req.params.id }, function (err, comments) {
        if(err) throw err;
        if(comments) {
            return res.json(comments).status(200)
        } else {
            return res.status(404)
        }
    }).populate("author")
})

//Get one comment data with commentId
router.get("/api/list/comment/:id", (req, res) => {
    Comments.findOne({ _id: req.params.id }, function (err, comments) {
        if(err) throw err;
        if(comments) {
            return res.json(comments).status(200)
        } else {
            return res.status(404)
        }
    }).populate("author")
})

//Get all posts done by one user
router.get("/api/list/postsbyuser/:id", (req, res) => {
    Posts.find({ owner: req.params.id }, function (err, post) {
        if(err) throw err;
        if(post) {
            return res.json(post).status(200)
        } else {
            return res.status(404)
        }
    }).populate("owner")
})



//Edit post 
router.put("/api/edit/post", passport.authenticate("jwt", { session: false }), (req, res) => {
    Posts.findById({_id: req.body.id}, function(err, post) {
        if(err) throw err;
        if(post) {
            const token = req.headers.authorization
            const tokenContent = token.split(".")
            const decode = atob(tokenContent[1])
            const json = JSON.parse(decode)
            if(json.id === post.owner.id) { //Before edit check that user is the post owner
                Posts.findByIdAndUpdate({_id: req.body.id}, {content: req.body.content}, function(err, post) { //If it does, edit the post
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

//Edit comment
router.put("/api/edit/comment" , passport.authenticate("jwt", { session: false }), (req, res) => {
    Comments.findById({_id: req.body.id}, function(err, comment) {
        if(err) throw err;
        if(comment) {
            const token = req.headers.authorization
            const tokenContent = token.split(".")
            const decode = atob(tokenContent[1])
            const json = JSON.parse(decode)
            if(json.id === comment.author._id.toString()) { //First check if user owns the comment 
                Comments.findByIdAndUpdate({_id: req.body.id}, {content: req.body.content}, function(err, comment) { //If it does, edit comment
                    if(err) throw err;
                    if(comment) {
                        res.json({status: "updated"})
                    }
                })
            } else {
                res.json({status: "Not authorized"}).status(401)
            }
        }
    }).populate("author").populate("post")
})

module.exports = router;
