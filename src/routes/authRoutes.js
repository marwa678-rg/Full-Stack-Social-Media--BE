
//Imports
const express= require("express");
//Internal Imports
const{register, verifyOtp, login, resendOtp,myInfo, forgotPassword, resetPassword}= require("../controllers/authControllers")
const {authMiddleware}=require("../middlewares/auth.middleware.js")

const router = express.Router();

//TODO: REGISTER
router.post("/register", register)

//TODO:Verify-otp
router.post("/verify-otp",verifyOtp)

//TODO:login
router.post("/login",login)

//TODO:RESEND OTP
router.post("/resendOtp",resendOtp);

//TODO:get my info
router.get("/myInfo",authMiddleware,myInfo)

//TODO:Forget Password
router.post("/forgotPassword",forgotPassword)

//TODO:reset Password
router.post("/resetPassword",resetPassword)









module.exports=router;