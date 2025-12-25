
//IMPORTS
const mongoose = require("mongoose");

//Internal Imports


const postSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },

  content:{type:String,
    required:true,
    maxlength:500,
  },

  images:{type:[String],
    default:[],
  },

  likes:[{type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },],

  commentsCount:{type:Number,
    default:0,
  },
},{timestamps:true});



const Post = mongoose.model("Post",postSchema);



module.exports={Post};