const express = require("express");

const router = express.Router();
require("dotenv").config();
const passport = require("passport");
const userController = require("../controller/users");
const postController = require("../controller/posts");
const commentController = require("../controller/comments");

// Authentication
router.get("/", (req, res) => {
    res.render("index", { title: "Express" });
});

// New user register
router.post("/api/user/register", userController.register);

// Tries to find user to login
// If found and correct password -> create jwt-token that is returned
// If not-> status 400
router.post("/api/user/login", userController.login);

// Get user info with all the user's posts too
router.get("/api/list/user/:id", userController.getUserInfoWithPosts);

// Get all posts done by one user
router.get("/api/list/postsbyuser/:id", userController.getAllPostsFromUser);

// Upload post
router.post("/api/upload/post", passport.authenticate("jwt", { session: false }), postController.uploadPost);

// Get all posts
router.get("/api/list/posts", postController.getAllPosts);

// Get one post
router.get("/api/list/post/:id", postController.getOnePost);

// Edit post
router.put("/api/edit/post", passport.authenticate("jwt", { session: false }), postController.editPost);

// Put solved to a post
router.put("/api/solve/post", passport.authenticate("jwt", { session: false }), postController.markAsSolved);

// Upload comment
router.post("/api/upload/comment", passport.authenticate("jwt", { session: false }), commentController.uploadComment);

// Edit comment
router.put("/api/edit/comment", passport.authenticate("jwt", { session: false }), commentController.editComment);

// Get one comment data with commentId
router.get("/api/list/comment/:id", commentController.getOneCommentById);

// List comments by postId
router.get("/api/list/comments/:id", commentController.getAllCommentsById);

module.exports = router;
