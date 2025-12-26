
//Imports
const express= require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { editComment, deleteComment, addComment, getAllComments } = require("../controllers/commentControllers");
const router= express.Router();

//Internal Imports

//Add Comment
router.post("/",authMiddleware,addComment)

//TODO:UPDATE -COMMENT
router.put("/:id",authMiddleware,editComment)

//TODO:DELETE-COMMENT
router.delete("/:id",authMiddleware,deleteComment);



module.exports=router;