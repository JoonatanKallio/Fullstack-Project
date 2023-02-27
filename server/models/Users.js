let mongoose = require("mongoose")

const Schema = mongoose.Schema;
let userSchema = new Schema ({
    email: { type: String, required: true  },
    username: { type: String, required: true},
    password: { type: String, required: true },
    bio: { type: String }
}, {timestamps: true});

module.exports = mongoose.model("Users", userSchema);