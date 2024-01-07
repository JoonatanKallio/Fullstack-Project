const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const Posts = require("../models/Posts");

exports.register = [
    body("email").isEmail().normalizeEmail(),
    body("username").isLength({ min: 3 }),
    body("password").isStrongPassword(),
    (req, res) => {
        // Validation error handling
        const errors = validationResult(req);
        let userBio = "";
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Check database for email match and if no match found, register
        Users.findOne({ email: req.body.email }, (err, user) => {
            if (err) throw err;
            if (user) { // If email is in use
                return res.status(400).json({ status: "Email is already in use." });
            }
            Users.findOne({ username: req.body.username }, (err, user) => {
                if (user) { // If username is in use
                    return res.status(400).json({ status: "Username is already in use." });
                } // If no matching email or username found, register
                bcrypt.genSalt(10)
                    .then((salt) => bcrypt.hash(req.body.password, salt))
                    .then((hash) => {
                        if (req.body.bio) {
                            userBio = req.body.bio;
                        }
                        new Users({
                            email: req.body.email,
                            username: req.body.username,
                            password: hash,
                            bio: userBio,
                        }).save((err) => {
                            if (err) throw err;
                            return res.status(201).json({ status: "New user created." });
                        });
                    });
            });
        });
    },
];

exports.login = (req, res) => {
    Users.findOne({ email: req.body.email }, (err, user) => {
        if (err) throw err;
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    const token = jwt.sign({
                        email: user.email,
                        id: user._id,
                        username: user.username,
                    }, process.env.SECRET, { expiresIn: 10000 });
                    return res.json({ success: true, token, status: "Login successful." });
                }
                return res.status(400).json({ status: "Invalid credentials" });
            });
        } else {
            return res.status(400).json({ status: "Invalid credentials" });
        }
    });
};

exports.getUserInfoWithPosts = (req, res) => {
    Users.findById({ _id: req.params.id }, (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json(user).status(200);
        }
        return res.send({ status: "not ok" });
    });
};

exports.getAllPostsFromUser = (req, res) => {
    Posts.find({ owner: req.params.id }, (err, post) => {
        if (err) throw err;
        if (post) {
            return res.json(post).status(200);
        }
        return res.status(404);
    }).populate("owner");
};
