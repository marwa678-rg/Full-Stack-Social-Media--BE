
const {generate} = require("otp-generator");

function generateOtp(){
  //Generate otp + otpExpires
   const otp = generate(6, {digits:true,specialChars: false,});

   const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes


   return {otp,otpExpires}
}

module.exports={generateOtp}