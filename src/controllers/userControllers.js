

//Imports
const {User}= require("../models/User")

//Internal Imports
const { updateProfileSchema } = require("../validation/userValidate")



//TODO:Update profile
async function updateProfile(request,response){
  try {
    //check user
    const userId = request.user.id;
    const user = await User.findById(userId).select("-password  -otp -otpExpires -otpRequestCount ");
    if(!user){
      return response.status(404).json({message:"User Not Found"})
    }
  
    //validate
    const {error,value}=updateProfileSchema.validate(request.body,{abortEarly:false});
    if(error){
      return response.status(400).json({messages:error.details.map((e)=>e.message)});
    }
    //Extract Data
    const{name,bio}=value;
    //Update DATA 
    if(name)user.name = name;
    if(bio)user.bio = bio;
      //Get image
    if(request.file){
      user.avatar = `/uploads/${request.file.filename}`;
    }
    await user.save();
    response.status(200).json({message:"Profile updated successfully",user})
  } catch (error) {
    console.log(error)
    response.status(500).json({message:"Internal Server Error"})
  }
}

//TODO:Get my profile
async function getMyProfile(request,response){
  try {
    const userId = request.user.id;
    const user = await User.findById(userId).select("-password -otp -otpExpires -otpRequestCount");
    if(!user){
      return response.status(404).json({message:"User Not Found"})
    }
    response.status(200).json(user);
  } catch (error) {
    console.log(error)
    response.status(500).json({message:"Internal Server Error"})
  }
}
//TODO:Get ALL Users (Admin Role)
async function getAllUsers(request,response){
  try {
    const users = await User.find().select("-password -otp -otpExpires -otpRequestCount -__v");
    response.status(200).json({count:users.length,users})
    
    
  } catch (error) {
     console.log(error)
    response.status(500).json({message:"Internal Server Error"})
  }
}

















module.exports={updateProfile,getMyProfile,getAllUsers}