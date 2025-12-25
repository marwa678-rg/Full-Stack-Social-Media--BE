//Imports
const { Post } = require("../models/Post");
const{User}=require("../models/User");
const { createPostSchema, updatePostSchema } = require("../validation/postValidate");


//TODO:CREATE-POST
async function createPost(request,response){
  try {
    const userId = request.user.id;
    const user= await User.findById(userId);
    if(!user){
      return response.status(404).json({message:"User Not Found"})
    }
    //validate data
    const{error,value}= createPostSchema.validate(request.body,{abortEarly:false})
    if(error){
      return response.status(400).json({messages:error.details.map((e)=>e.message)})
    }
    //images from multer
    let images=[];
    if(request.files && request.files.length > 0 ){
      images = request.files.map((file)=>`/uploads/${file.filename}`)
    }
    //Extract Data
    const {content}=value;
    //create post
    const post = await Post.create({
      userId,
      content,
      images,
    });

    response.status(201).json({message:"Post Created successfully",post})

  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"})
  }
}

//TODO:GET ALL POSTS(FEED)
async function getAllPosts(request,response){
  try {
    
    //Pagination & search
    let {page=1,pageSize=10,search=""}=request.query;

    const limit= pageSize;
    const skip=(page-1) * pageSize;
    //search condition
    const query =  search
      ? { content: { $regex: search, $options: "i" } }
      : {};//search for words in content

    // Get All Posts
    const posts = await Post.find(query)
                   .populate("userId","name avatar")
                   .sort({createdAt:-1})
                   .skip(skip) 
                   .limit(limit);
    //Total of Posts
    const total = await Post.countDocuments(query);
    response.json({page,
      pageSize:limit,totalPages:Math.ceil(total /limit),
      total,
      posts})               
  } catch (error) {
     console.log(error);
    response.status(500).json({message:"Internal Server Error"})
  }
}
//Todo:UPdate post by user
async function updatePost(request,response){
  try {
    const postId = request.params.id;
    //Check post
    const post = await Post.findById(postId);
    if(!post){
      return response.status(404).json({message:"Post Not Found"})
    }
    //validate
    const {error,value}= updatePostSchema.validate(request.body,{abortEarly:false});
    if(error){
     return response.status(400).json({
    messages: error.details.map((e) => e.message),
  });
    }
  
    //Extract Data
    const{content}=value;
    //Update
    if(content)post.content = content;
    
    //update Images
    if(request.files && request.files.length > 0){
      post.images = request.files.map((file)=>`/upload/${file.filename}`)
    }


    await post.save();

    response.status(200).json({message:"Post Updated Successfully",post})
  } catch (error) {
     console.log(error);
    response.status(500).json({message:"Internal Server Error"})
  }
}


//TODO:DELETE POST
async function deletePost(request,response){
  try {
    const postId = request.params.id;
    const userId = request.user.id;
    const role = request.user.role;
    //ckeck post
    
    const post = await Post.findById(postId);
    if(!post){
      return response.status(404).json({message:"Post Not Found"})
    }
    //owner /admin
    if(post.userId.toString() !== userId &&  role!== "admin"){
      return response.status(403).json({message:"You are not allowed to delete this post"});
    }
    await post.deleteOne();
    response.status(200).json({message:"Post Deleted Successfully"})
  } catch (error) {
     console.log(error);
    response.status(500).json({message:"Internal Server Error"})
  }
}


module.exports={
  createPost,
  getAllPosts,
  updatePost,
  deletePost
}