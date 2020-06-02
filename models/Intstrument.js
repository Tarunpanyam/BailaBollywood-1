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

const InstrumentSchema = new Schema({
  title:{type:String, trim:true , required:true,default:""},
  image:{type:String, trim:true  ,default:""},
  imageSource:{type:String, trim:true,default:""},
  thumbnail:{type:String , trim:true,required:true,default:""},
  content:{type:String,default:""},
  created:  {type: Date, default: Date.now},
  time: {type: String},
  audio:{type:String,default:""},
  index:{type:Number},
  comments:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
   }
  ],
  subInstruments:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"SubInstrument"
    }
  ]
  
})

module.exports = mongoose.model('Instrument', InstrumentSchema);
