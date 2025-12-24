//Imports
const Joi = require("joi");


const registerSchema = Joi.object({
  email:Joi.string().email().required(),
  password:Joi.string().min(6).required(),
  name:Joi.string().min(2).max(30).required(),
});


const verifySchema = Joi.object({
  email:Joi.string().email().required(),
  otp:Joi.string().length(6).required(),
});

const loginSchema=Joi.object({
  email:Joi.string().email().required(),
  password:Joi.string().min(6).required(),
  name:Joi.string().min(2).max(30).required(),
});


const resendOtpSchema = Joi.object({
  email:Joi.string().email().required(),
});

const forgotPasswordSchema=Joi.object({
   email:Joi.string().email().required(),
});


const resetPasswordSchema = Joi.object({
token:Joi.string().required(),
newPassword:Joi.string().min(6).required(),
});

//____________profile-Validation__________________//


const updateProfileSchema = Joi.object({
  name:Joi.string().min(2).max(30).optional(),
  bio:Joi.string().max(160).optional(),
}) ;











module.exports={
  registerSchema,
  verifySchema,
  loginSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
}