const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// get the full date
function date () {
  let actualDate = new Date();
  // Individual
  let day = actualDate.getDate();
  let month = actualDate.getMonth() + 1;
  let year = actualDate.getFullYear();
  if (day < 10)
    day = `0${actualDate.getDate()}`;
  if (month < 10)
    month = `0${actualDate.getMonth() + 1}`;

  let finalDate = `${day}-${month}-${year}`;

  return finalDate;
}

const BollywoodNewsSchema = new Schema({
  title:{type:String, trim:true , required:true},
  image:{type:String, trim:true , required:true},
  thumbnail:{type:String , trim:true,required:true},
  newsModel:{type:String , trim:true , required:true},
  uploader:{type:String , trim:true , required:true},
  content:{type:String},
  created:  {type: Date, default: Date.now},
  time: {type: String},
  comments:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
   }
  ],
  subNews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"SubNews"
    }
  ]
})

module.exports = mongoose.model('BollywoodNews', BollywoodNewsSchema);
