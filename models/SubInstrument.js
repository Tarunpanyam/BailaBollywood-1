const mongoose = require('mongoose');

var subInstrument = new mongoose.Schema({
    title:{type:String,default:""},
    content:{type:String,default:""},
    image:{type:String,default:""},
    imageSource:{type:String,default:""} 
 });

 module.exports = mongoose.model("SubInstrument", subInstrument);

