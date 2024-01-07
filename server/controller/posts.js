const Posts = require("../models/Posts");

exports.uploadPost = (req, res) => {
    const token = req.headers.authorization;
    const tokenContent = token.split(".");
    const decode = atob(tokenContent[1]);
    const json = JSON.parse(decode);
    new Posts({
        owner: json.id,
        title: req.body.title,
        content: req.body.content,
        votes: 0,
    }).save((err) => {
        if (err) throw err;
        return res.status(201).json({ status: "New post created." });
    });
};

exports.getAllPosts = (req, res) => {
    Posts.find({}, (err, posts) => {
        if (err) throw err;
        if (posts) {
            return res.json(posts).status(200);
        }
        return res.send({ status: "not ok" });
    }).populate("owner", "username");
};

exports.getOnePost = (req, res) => {
    Posts.findById(req.params.id, (err, post) => {
        if (err) throw err;
        if (post) {
            return res.json(post).status(200);
        }
        return res.status(404);
    }).populate("owner");
};

exports.editPost = (req, res) => {
    Posts.findById({ _id: req.body.id }, (err, post) => {
        if (err) throw err;
        if (post) {
            const token = req.headers.authorization;
            const tokenContent = token.split(".");
            const decode = atob(tokenContent[1]);
            const json = JSON.parse(decode);
            if (json.id === post.owner.id) { // Before edit check that user is the post owner
                Posts.findByIdAndUpdate({ _id: req.body.id }, { content: req.body.content }, (err, post) => { // If it is, edit the post
                    if (err) throw err;
                    if (post) {
                        res.json({ status: "updated" });
                    }
                });
            } else {
                res.json({ status: "Not authorized" }).status(401);
            }
        }
    }).populate("owner");
};

exports.markAsSolved = (req, res) => {
    Posts.findById({ _id: req.body.id }, (err, post) => {
        if (err) throw err;
        if (post) {
            const token = req.headers.authorization;
            const tokenContent = token.split(".");
            const decode = atob(tokenContent[1]);
            const json = JSON.parse(decode);
            if (json.id === post.owner.id) { // Before edit check that user is the post owner
                Posts.findByIdAndUpdate({ _id: req.body.id }, { solved: req.body.solved }, (err, post) => { // If it does, edit the post
                    if (err) throw err;
                    if (post) {
                        res.status(201).json({ status: "updated" });
                    }
                });
            } else {
                res.json({ status: "Not authorized" }).status(401);
            }
        }
    }).populate("owner");
};
