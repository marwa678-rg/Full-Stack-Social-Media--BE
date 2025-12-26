
//Imports
const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },


  postId:{type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
    required:true,
  },


  text:{type:String,minlength:1,maxlength:500,required:true}
},{timestamps:true});


const Comment = mongoose.model("Comment",commentSchema);


module.exports= {Comment}