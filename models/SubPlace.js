const mongoose = require('mongoose');

var subPlaceSchema = new mongoose.Schema({
    title:{type:String},
    content:{type:String},
    image:{type:String} 
 });

 module.exports = mongoose.model("SubPlace", subPlaceSchema);

