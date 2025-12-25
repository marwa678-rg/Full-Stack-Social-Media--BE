
//Imports
const Joi = require("joi");


//create schema
const createPostSchema = Joi.object({
  content:Joi.string().max(500).required(),
}) ;

const updatePostSchema= Joi.object({
   content:Joi.string().trim().max(500).optional(),
});













module.exports={
  createPostSchema,
  updatePostSchema,
}