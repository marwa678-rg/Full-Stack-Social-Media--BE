
//Imports


//Internal Imports
const { addCommentSchema } = require("../validation/commentValidation");
const{Comment}=require("../models/Comments")





//TODO:CREATE COMMENT(ADD-COMMENT)
async function addComment(request,response){
try {
const userId = request.user.id;
//validate
const{error,value}=addCommentSchema.validate(request.body,{abortEarly:false})
if(error){
  return response.status(400).json({messages:error.details.map((e)=>e.message)})
}
//Extract Datat
const{postId,text}= value;
//create
const comment = await Comment.create({text,postId,userId})
response.status(201).json({message:"Comment Added successfully",comment})

} catch (error) {
  console.log(error);
  response.status(500).json({message:"Internal Server Error"});
}
}

//TODO: Get All Comments Per Post
async function getCommentsByPost(request,response){
  try {
    //get postID
    const postId = request.params.id;
    //pagination
    let{page=1,pageSize=10}=request.query;
    const limit =pageSize;
    const skip=(page-1) * pageSize;


    //get all comments
    const comments = await Comment.find({postId})
    .populate("userId","name avatar")
    .sort({createdAt:-1})
    .skip(skip)
    .limit(limit)
    //Total of Comments
const total = await Comment.countDocuments({postId})

    response.json({message:"Comments fetched successfully",
      comments,
      page,
      limit,
      total,
      totalPages:Math.ceil(total/limit),
      count:comments.length});

  } catch (error) {
     console.log(error);
  response.status(500).json({message:"Internal Server Error"});
  }
}

//TODO:update
async function editComment(request,response){
  try {
    const commentId = request.params.id;
    const userId = request.user.id;
    const {text}= request.body;

    //validate
    if(!text || text.trim === ""){
      return response.status(400).json({message:"Comment text is required"})
    }
    //check comment
    const comment = await Comment.findById(commentId);
  if(!comment){
    return response.status(404).json({message:"Comment Not Found"})
  }
  //check user
  if(comment.userId.toString() !== userId){
    return response.status(403).json({message:"You are not allowed to edit this comment"})
  }
  //update data
  comment.text = text;
  await comment.save();

   response.status(200).json({message:"The Comment Updated Successfully",comment})
    
  } catch (error) {
    console.log(error);
  response.status(500).json({message:"Internal Server Error"});
  }
}


//TODO:Delete Comment
async function deleteComment(request,response){
  try {
    const commentId= request.params.id;
    const userId= request.user.id;
    //check comment
    const comment = await Comment.findById(commentId);
    if(!comment){
      return response.status(404).json({message:"The Comment Not Found"})
    }
    //check user
    if(comment.userId.toString() !== userId){
      return response.status(403).json({messsage:"You are not allowed to delete this comment"})
    }
    comment.deleteOne();
    response.json({message:"The Comment Deleted successfully"})
  } catch (error) {
    console.log(error);
  response.status(500).json({message:"Internal Server Error"});
  }
}










module.exports={
  addComment,
  getCommentsByPost,
  editComment,
  deleteComment,
}