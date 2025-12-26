
//Imports
const Joi = require("joi");


//cretecomment schema
const addCommentSchema = Joi.object({
  postId: Joi.string().required() ,
  text:Joi.string().required(),
});






module.exports={
addCommentSchema,


}