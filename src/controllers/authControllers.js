
//Imports
const bcrypt = require("bcrypt");
const {generate}= require("otp-generator");
const jwt = require("jsonwebtoken");
const crypto =require("crypto")
//Internal Imports
const { User } = require("../models/User");
const { registerSchema, verifySchema, loginSchema, resendOtpSchema, forgotPasswordSchema, resetPasswordSchema } = require("../validation/userValidate");
const {sendMail}=require("../utils/sendMail");
const { generateOtp } = require("../utils/generateOtp");

//REGISTER ROUTE
async function register(request,response){
  try {
    //validate
    const {error,value}= registerSchema.validate(request.body,
      {abortEarly:false,});

    if(error){
      return response.status(400).json({messages:error.details.map((e)=>e.message)})
    }
    //Extract Data
    const {email,password}=value;
    //Check user
    const userExisting = await User.findOne({email});
    if(userExisting){
      return response.status(400).json({message:"Email Already Exist "})
    }
    //HASH USER PASSWORD
    const hashPassword = await bcrypt.hash(password,12)
    //GENERATE OTP + otpExpires
     const {otp,otpExpires}= generateOtp();
    
    //create user 
      const user = await User.create({
        email,
        password:hashPassword,
        otp,
        otpExpires,

      });

//send Mail
await sendMail(email,"OTP Code", `Your OTP IS : ${otp}`);
response.status(201).json({message:"OTP Send To Your Email"})

  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"});
  }
}

//VERIFY-OTP
async function verifyOtp(request,response){
  try {
    //validate
    const{error,value}=verifySchema.validate(request.body,
      {abortEarly:false});
    if(error){
      return response.status(400).json({messages:error.details.map((e)=>e.message)});
    }
    //Extract Data
    const{email,otp}=value;
   //validate User
   const user = await User.findOne({email});
   if(!user){
    return response.status(400).json({message:"This Email Not Related To User"})
   } 
   //validate otp
   if(user.otp !== otp || user.otpExpires < Date.now()){
    return response.status(400).json({message:"Invalid OTP or Expired OTP"})
   }
   //verify
   user.isVerify = true;
   //clear
   user.otp = undefined;
   user.otpExpires = undefined;
   //save user
   await user.save();
   response.json({message:"Account Verified Successfully"})

  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"});
  }
}

//LOGIN
async function login(request,response){

  try {
    //Validate
    const {error,value}= loginSchema.validate(request.body,
      {abortEarly:false});
      if(error){
        return response.status(400).json({messages:error.details.map((e)=>e.message)})
      }

      //Extract Data 
      const{email,password}=value;
      const user = await User.findOne({email});
      if(!user){
        return response.status(400).json({message:"Invalid Email OR Password"});
      }
      //Compare Password
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch){
        return response.status(400).json({message:"Invalid Email OR Password "});
      }
      //check is Verify
      if(!user.isVerify){
        return response.status(403).json({message:"Account Not Verified Yet ",
          isVerify:false,
          email:user.email,//redirect verify otp as frontend
        });
      }
      //generate Token
      const token = jwt.sign({id:user._id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN});
        response.json({
          message:"Loggedin Successfully",token
        })
  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"});
  }
}

//TODO:Resend OTP
async function resendOtp(request,response){
try {
  //validate
  const{error,value}=resendOtpSchema.validate(request.body);
  if(error){
    return response.status(400).json({message:error.message})
  }
  //Extract Data
  const {email}= value;
  //check user
  const user = await User.findOne({email});
  if(!user){
    return response.status(400).json({message:"This Email is Not Related To User"});
  }
  //check verification
  if(user.isVerify){
    return response.json({message:"User Already is Verified"})
  }
  // Limit resend Otp
  if(user.otpRequestCount >= 2){
    return response.json({message:"OTP limit Reached ,Try Again Later..."})
  }
  //generate otp + otpExpires
  const {otp,otpExpires}= generateOtp();
  //update userInfo
  user.otp=otp;
  user.otpExpires=otpExpires;
  user.otpRequestCount +=1;
  //save user
  await user.save();
//send Mail
await sendMail(email,"New OTP CODE" ,`YOUR OTP IS: ${otp}`)
response.json({message:"Otp Sent Successfuly",count :user.otpRequestCount})

} catch (error) {
  console.log(error);
    response.status(500).json({message:"Internal Server Error"});
}
}

//TODO:My Info
async function myInfo(request,response){
  try {
    //extract data from authmiddleware
    const id = request.user._id;
    //aviod return pass & otp
    const user = await User.findById(id).select("-password  -otp");
    //check user
    if(!user){
      return response.status(404).json({message:"User Not Found"})
    }
    response.status(200).json({message:"User Fetched Successfully",user})
  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"});
  }
}

//TODO:Forgot Password
async function forgotPassword(request,response){
  try {
    //validate
    const{error,value}=forgotPasswordSchema.validate(request.body);
    if(error){
      return response.status(400).json({message:error.message});
    }
    //Extract DATA
    const {email}=value;
    //check user
    const user = await User.findOne({email});
    if(!user){
      return response.status(400).json({message:"This Email Not Related to User"})
    }
    //generate token
  const  resetPasswordToken = crypto.randomBytes(32).toString("hex") //generate random bytes
  const resetPasswordExpires= Date.now() + 10 * 60 * 1000;
  //update user
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpires = resetPasswordExpires;
  await user.save();
  //origin front +  resetPass/{token}
  const resetUrl =`${process.env.CLIENT_ORIGIN}/resetPassword/${resetPasswordToken}`
  //send mail
  await sendMail(email,"reset password",`Click this link to reset your password :${resetUrl} `);
  response.json({message:"Reset Password Link To Your Mail ."})

  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"});
  }
}
//TODO:RESET PASSWORD
async function resetPassword(request,response){
  try {
    //validate 
    const{error,value}= resetPasswordSchema.validate(request.body,{abortEarly:false});
    if(error){
      return response.status(400).json({messages:error.details.map((e)=>e.message)});
    }
    //Extract Data
    const {token ,newPassword}=value;
    //Check user
    const user= await User.findOne({
      resetPasswordToken:token,
      resetPasswordExpires:{$gt:Date.now()},
    });
    if(!user){
      return response.status(400).json({message:"Invalid Token or Expired"});
    }
    //Hash Password
const password = await bcrypt.hash(newPassword,12);
//update:
user.password= password;
//clear
user.resetPasswordToken= undefined;
user.resetPasswordExpires = undefined;
await user.save();
response.json({message:"Password Changes Successfully"})
  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"});
  }
}

















module.exports={
  register,
  verifyOtp,
  login,
  resendOtp,
  myInfo,
  forgotPassword,
  resetPassword,


}