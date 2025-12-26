
//Imports
const express= require("express");
const router= express.Router();

//Internal Imports
const { createPost, getAllPosts, updatePost, deletePost, handleLikePost } = require("../controllers/postControllers");
const { authMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../utils/upload");
const { getCommentsByPost } = require("../controllers/commentControllers");


//TODO:Create post
router.post("/create",authMiddleware,upload.array("images",5),createPost);


//TODO:getALLPosts
router.get("/",authMiddleware,getAllPosts)

//TODO:UPDATE POST
router.patch("/:id",authMiddleware,upload.array("images",5),updatePost)


//TODO:DELETE POST
router.delete("/:id",authMiddleware,deletePost)

//TODO:LIKE / DISLIKE 
  router.put("/:id/like",authMiddleware,handleLikePost);


//TODO: Get ALL comments per post
router.get("/:id/comments",getCommentsByPost)








module.exports=router;