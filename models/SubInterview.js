const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subInterviewSchema = new Schema({
    title   :{type:String , trim:true , default:""},
    image   :{type:String , trim:true , default:""},
    video   :{type:String , trim:true , default:""},
    content :{type:String , default:""}


})

module.exports = mongoose.model('SubInterview',subInterviewSchema);