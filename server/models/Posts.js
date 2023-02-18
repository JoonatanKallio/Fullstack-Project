let mongoose = require("mongoose")
const Schema = mongoose.Schema;

let postSchema = new Schema ({
    owner: { type: Schema.Types.ObjectId, required: true },
    post: { type: String }
});

module.exports = mongoose.model("Posts", postSchema);