
//Imports
const express= require("express");
const router= express.Router();
const upload = require("../utils/upload");


//Internal Imports
const { updateProfile, getMyProfile,getAllUsers } = require("../controllers/userControllers");
const { authMiddleware} = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");


//TODO:Get All Users
router.get("/",authMiddleware,roleMiddleware("admin"),getAllUsers)

//TODO:Get my Profile
router.get("/me",authMiddleware,getMyProfile);

//TODO:Update My profile
router.put("/profile/update",authMiddleware,upload.single("avatar"),updateProfile);



















module.exports=router;