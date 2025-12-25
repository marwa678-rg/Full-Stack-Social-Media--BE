
//Imports
const express= require("express");
const router= express.Router();

//Internal Imports
const { createPost, getAllPosts, updatePost, deletePost } = require("../controllers/postControllers");
const { authMiddleware } = require("../middlewares/auth.middleware");
const{roleMiddleware}=require("../middlewares/role.middleware");
const upload = require("../utils/upload");

//TODO:Create post
router.post("/create",authMiddleware,upload.array("images",5),createPost);


//TODO:getALLPosts
router.get("/",authMiddleware,getAllPosts)

//TODO:UPDATE POST
router.patch("/:id/update",authMiddleware,upload.array("images",5),updatePost)


//TODO:DELETE POST
router.delete("/:id/delete",authMiddleware,deletePost)












module.exports=router;