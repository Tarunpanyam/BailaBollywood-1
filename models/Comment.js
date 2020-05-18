
const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    name:String,
    email: String,
    text:String
});


module.exports = mongoose.model("Comment", CommentSchema);
