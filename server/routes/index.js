var express = require('express');
var router = express.Router();
require("dotenv").config()
const userController = require("../controller/users")
const postController = require("../controller/posts")
const commentController = require("../controller/comments")

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

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//New user register
router.post("/api/user/register", userController.register)

//Tries to find user to login, if found and correct password -> create jwt-token that is returned, if not-> status 400
router.post("/api/user/login", userController.login)

//get user info with all the user's posts too
router.get("/api/list/user/:id", userController.getUserInfoWithPosts)

//Get all posts done by one user
router.get("/api/list/postsbyuser/:id", userController.getAllPostsFromUser)

//Upload post
router.post("/api/upload/post", passport.authenticate("jwt", { session: false }), postController.uploadPost)

//get all posts
router.get("/api/list/posts", postController.getAllPosts)

//get one post
router.get("/api/list/post/:id", postController.getOnePost)

//Edit post 
router.put("/api/edit/post", passport.authenticate("jwt", { session: false }), postController.editPost)

//put solved to a post
router.put("/api/solve/post", passport.authenticate("jwt", { session: false }), postController.markAsSolved)

//Upload comment
router.post("/api/upload/comment", passport.authenticate("jwt", { session: false }), commentController.uploadComment)

//Edit comment
router.put("/api/edit/comment" , passport.authenticate("jwt", { session: false }), commentController.editComment)

//Get one comment data with commentId
router.get("/api/list/comment/:id", commentController.getOneCommentById)

//List comments by postId
router.get("/api/list/comments/:id", commentController.getAllCommentsById)

module.exports = router;