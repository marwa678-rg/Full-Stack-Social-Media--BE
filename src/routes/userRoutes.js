
//Imports
const express= require("express");
const router= express.Router();
const upload = require("../utils/upload");


//Internal Imports
const { updateProfile, getMyProfile,getAllUsers, getMyPosts } = require("../controllers/userControllers");
const { authMiddleware} = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");



//TODO:Get All Users (Admin)
router.get("/",authMiddleware,roleMiddleware("admin"),getAllUsers)

//TODO:Get my Profile
router.get("/myProfile",authMiddleware,getMyProfile);

//TODO:Update My profile
router.put("/profile/update",authMiddleware,upload.single("avatar"),updateProfile);

//TODO:get posts of me
router.get("/myPosts",authMiddleware,getMyPosts)

















module.exports=router;