const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    content: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Comments", commentSchema);
