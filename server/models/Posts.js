let mongoose = require("mongoose")
const Schema = mongoose.Schema;

let postSchema = new Schema ({
    owner: { type: Schema.Types.ObjectId, required: true, ref: "Users"},
    title: { type: String },
    content: { type: String },
    votes: { type: Number},
}, {timestamps: true});

module.exports = mongoose.model("Posts", postSchema);