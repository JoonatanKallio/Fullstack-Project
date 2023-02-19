let mongoose = require("mongoose")
const Schema = mongoose.Schema;

let commentSchema = new Schema ({
    post: { type: Schema.Types.ObjectId, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    content: { type: String }
});

module.exports = mongoose.model("Comments", commentSchema);