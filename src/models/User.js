//Imports
const mongoose = require("mongoose");
const path = require("path")


const userSchema = new mongoose.Schema({
  //______________Auth_________________________//

  email:{type:String,unique:true,required:true},
  password:{type:String,required:true,},
  role:{type:String,enum:["user","admin"],default:"user"},
//______________ Profile________________________//

name:{type:String,minLength:2,maxLength:30,required:true},
bio:{type:String,maxLength:160,default:""},
avatar:{type:String,default:path.join("public","default-avatar.png")},
//_____________Verification_____________________//

isVerify:{type:Boolean,default:false},
otp:{type:String,maxLength:6},
otpExpires:{type:Date},
//count of Request of Otp  => prevent Spam
otpRequestCount:{type:Number,default:0},

//for password
resetPasswordToken:{type:String},
resetPasswordExpires:{type:Date},

});



const User = mongoose.model("User",userSchema);


module.exports={User};