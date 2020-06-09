const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subPlace = new Schema({
    title   :{type:String , trim:true , default:""},
    image   :{type:String , trim:true , default:""},
    content :{type:String , default:""}


})

module.exports = mongoose.model('SubPlace',subPlace);