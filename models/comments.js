let mongoose = require('mongoose');

//Schema Setup(3)
let commentSchema = new mongoose.Schema({
    text: String,
    author: String,
});

//Create Model from Schema(4)
module.exports = mongoose.model("Comment", commentSchema);
