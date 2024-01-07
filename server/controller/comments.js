const Comments = require("../models/Comments");

exports.uploadComment = (req, res) => {
    const token = req.headers.authorization;
    const tokenContent = token.split(".");
    const decode = atob(tokenContent[1]);
    const json = JSON.parse(decode);
    if (req.body.solved === false) {
        new Comments({
            post: req.body.postid,
            author: json.id,
            content: req.body.content,
        }).save((err) => {
            if (err) return res.status(404).json({ status: "Post body didn't have required data." });
            return res.status(201).json({ status: "New comment created." });
        });
    }
};

exports.getAllCommentsById = (req, res) => {
    Comments.find({ post: req.params.id }, (err, comments) => {
        if (err) throw err;
        if (comments) {
            return res.json(comments).status(200);
        }
        return res.status(404);
    }).populate("author");
};

exports.getOneCommentById = (req, res) => {
    Comments.findOne({ _id: req.params.id }, (err, comments) => {
        if (err) throw err;
        if (comments) {
            return res.json(comments).status(200);
        }
        return res.status(404);
    }).populate("author");
};

exports.editComment = (req, res) => {
    Comments.findById({ _id: req.body.id }, (err, comment) => {
        if (err) throw err;
        if (comment) {
            const token = req.headers.authorization;
            const tokenContent = token.split(".");
            const decode = atob(tokenContent[1]);
            const json = JSON.parse(decode);
            if (json.id === comment.author._id.toString()) { // First check if user owns the comment
                Comments.findByIdAndUpdate({ _id: req.body.id }, { content: req.body.content }, (err, comment) => { // If it does, edit comment
                    if (err) throw err;
                    if (comment) {
                        res.json({ status: "updated" });
                    }
                });
            } else {
                res.json({ status: "Not authorized" }).status(401);
            }
        }
    }).populate("author").populate("post");
};
